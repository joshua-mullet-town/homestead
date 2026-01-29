import { NextRequest, NextResponse } from 'next/server';
import { loadSession } from '@/lib/sessions';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface DropletStatusRequest {
  sessionId?: string;
  dropletId?: number;
}

interface ProvisioningStatus {
  dropletStatus: 'creating' | 'active' | 'error' | 'unknown';
  port3005Ready: boolean; // Homestead terminal server
  port7087Ready: boolean; // Dev server
  cloudInitComplete: boolean;
  ready: boolean; // All systems go
  message: string;
  steps: {
    step: string;
    status: 'pending' | 'in_progress' | 'complete' | 'error';
    message?: string;
  }[];
  logLines?: string[]; // Last 10 lines from provision.log
}

const DO_API_TOKEN = process.env.DO_API_TOKEN;

async function checkDropletStatus(dropletId: number): Promise<'creating' | 'active' | 'error' | 'unknown'> {
  try {
    const response = await fetch(`https://api.digitalocean.com/v2/droplets/${dropletId}`, {
      headers: {
        Authorization: `Bearer ${DO_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      return 'error';
    }

    const result = await response.json();
    return result.droplet.status as 'creating' | 'active';
  } catch (err) {
    console.error('Error checking droplet status:', err);
    return 'error';
  }
}

async function checkPort(ip: string, port: number): Promise<boolean> {
  try {
    // Use a simple HTTP request to check if port is responding
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

    const response = await fetch(`http://${ip}:${port}`, {
      signal: controller.signal,
      method: 'HEAD',
    });

    clearTimeout(timeoutId);
    return true; // Port is responding (even if it returns error status)
  } catch (err) {
    return false; // Port not responding or timeout
  }
}

async function readProvisionLog(ip: string): Promise<string[]> {
  try {
    // SSH config will automatically use the right key
    const { stdout } = await execAsync(
      `ssh -o ConnectTimeout=3 root@${ip} "tail -15 /root/provision.log 2>/dev/null || echo 'Log not available yet'"`,
      { timeout: 5000 }
    );

    return stdout.trim().split('\n').filter(line => line.length > 0);
  } catch (err) {
    return ['Log not available yet'];
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: DropletStatusRequest = await request.json();
    const { sessionId, dropletId: requestDropletId } = body;

    if (!sessionId && !requestDropletId) {
      return NextResponse.json(
        { error: 'sessionId or dropletId is required' },
        { status: 400 }
      );
    }

    // Load session to get droplet details
    let session;
    let dropletId: number;
    let ip: string;

    if (sessionId) {
      session = loadSession(sessionId);
      if (!session) {
        return NextResponse.json(
          { error: 'Session not found' },
          { status: 404 }
        );
      }
      dropletId = session.dropletId;
      ip = session.ip;
    } else {
      dropletId = requestDropletId!;
      // We don't have IP yet, need to fetch from DO API
      const dropletStatus = await checkDropletStatus(dropletId);
      if (dropletStatus === 'error') {
        return NextResponse.json(
          { error: 'Failed to fetch droplet info' },
          { status: 500 }
        );
      }

      // Fetch droplet to get IP
      const response = await fetch(`https://api.digitalocean.com/v2/droplets/${dropletId}`, {
        headers: {
          Authorization: `Bearer ${DO_API_TOKEN}`,
        },
      });

      const result = await response.json();
      ip = result.droplet.networks.v4[0]?.ip_address || '';
    }

    // Check all status indicators
    const dropletStatus = await checkDropletStatus(dropletId);
    const port3005Ready = ip ? await checkPort(ip, 3005) : false;
    const port7087Ready = ip ? await checkPort(ip, 7087) : false;

    // Read provision log if droplet is active
    const logLines = (dropletStatus === 'active' && ip) ? await readProvisionLog(ip) : [];

    // Determine cloud-init status based on ports
    const cloudInitComplete = port3005Ready && port7087Ready;

    // Build status steps
    const steps: ProvisioningStatus['steps'] = [
      {
        step: 'Droplet Creation',
        status: dropletStatus === 'active' ? 'complete' : dropletStatus === 'creating' ? 'in_progress' : 'pending',
        message: dropletStatus === 'active' ? `Droplet online at ${ip}` : 'Creating droplet...',
      },
      {
        step: 'Cloud-Init Provisioning',
        status: cloudInitComplete ? 'complete' : dropletStatus === 'active' ? 'in_progress' : 'pending',
        message: cloudInitComplete
          ? 'System provisioned successfully'
          : dropletStatus === 'active'
            ? 'Installing Node.js, PM2, Claude Code...'
            : 'Waiting for droplet...',
      },
      {
        step: 'Terminal Server (Port 3005)',
        status: port3005Ready ? 'complete' : cloudInitComplete ? 'error' : dropletStatus === 'active' ? 'in_progress' : 'pending',
        message: port3005Ready ? 'Homestead terminal server ready' : 'Starting PM2 services...',
      },
      {
        step: 'Dev Server (Port 7087)',
        status: port7087Ready ? 'complete' : cloudInitComplete ? 'error' : dropletStatus === 'active' ? 'in_progress' : 'pending',
        message: port7087Ready ? 'Next.js dev server ready' : 'Starting development server...',
      },
    ];

    const ready = dropletStatus === 'active' && port3005Ready && port7087Ready;

    const status: ProvisioningStatus = {
      dropletStatus,
      port3005Ready,
      port7087Ready,
      cloudInitComplete,
      ready,
      message: ready
        ? 'All systems ready!'
        : dropletStatus === 'creating'
          ? 'Creating droplet...'
          : 'Provisioning environment...',
      steps,
      logLines,
    };

    return NextResponse.json(status);

  } catch (error) {
    console.error('Error checking droplet status:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
