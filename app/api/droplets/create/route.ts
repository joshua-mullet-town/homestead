import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

const DO_API_TOKEN = process.env.DO_API_TOKEN;
const SSH_KEY_ID = '53651428';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const GITHUB_PAT = process.env.GH_TOKEN;

interface CreateDropletRequest {
  repoUrl: string;
  repoName: string;
  branchName?: string;
  issueNumber?: number;
}

interface DropletResponse {
  dropletId: number;
  ip: string;
  sessionId: string;
  repoName: string;
  branch: string;
  status: 'provisioning' | 'active' | 'error';
}

async function createDroplet(name: string, cloudInitData: string) {
  const response = await fetch('https://api.digitalocean.com/v2/droplets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DO_API_TOKEN}`,
    },
    body: JSON.stringify({
      name,
      region: 'nyc3',
      size: 's-2vcpu-4gb',
      image: 'ubuntu-22-04-x64',
      ssh_keys: [SSH_KEY_ID],
      user_data: cloudInitData,
      tags: ['homestead', 'auto-provisioned'],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create droplet: ${error}`);
  }

  return response.json();
}

async function getDropletStatus(dropletId: number) {
  const response = await fetch(`https://api.digitalocean.com/v2/droplets/${dropletId}`, {
    headers: {
      Authorization: `Bearer ${DO_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get droplet status');
  }

  return response.json();
}

async function waitForDropletActive(dropletId: number, maxWaitMs = 120000): Promise<string> {
  const startTime = Date.now();
  const pollInterval = 5000;

  while (Date.now() - startTime < maxWaitMs) {
    const { droplet } = await getDropletStatus(dropletId);

    if (droplet.status === 'active' && droplet.networks.v4.length > 0) {
      return droplet.networks.v4[0].ip_address;
    }

    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }

  throw new Error('Droplet provisioning timeout');
}

function loadCloudInitTemplate(variables: {
  repoUrl: string;
  branchName: string;
  apiKey: string;
  githubPat: string;
}): string {
  const templatePath = join(process.cwd(), 'cloud-init.yaml');
  const template = readFileSync(templatePath, 'utf-8');

  return template
    .replace(/\{\{REPO_URL\}\}/g, variables.repoUrl)
    .replace(/\{\{BRANCH_NAME\}\}/g, variables.branchName)
    .replace(/\{\{ANTHROPIC_API_KEY\}\}/g, variables.apiKey)
    .replace(/\{\{GITHUB_PAT\}\}/g, variables.githubPat);
}

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!DO_API_TOKEN) {
      return NextResponse.json(
        { error: 'DO_API_TOKEN not configured' },
        { status: 500 }
      );
    }

    if (!ANTHROPIC_API_KEY || !GITHUB_PAT) {
      return NextResponse.json(
        { error: 'Missing ANTHROPIC_API_KEY or GH_TOKEN' },
        { status: 500 }
      );
    }

    const body: CreateDropletRequest = await request.json();
    const { repoUrl, repoName, branchName, issueNumber } = body;

    if (!repoUrl || !repoName) {
      return NextResponse.json(
        { error: 'repoUrl and repoName are required' },
        { status: 400 }
      );
    }

    // Generate branch name
    const branch = branchName || (issueNumber ? `issue-${issueNumber}` : `session-${Date.now()}`);
    const sessionId = `${repoName}-${Date.now()}`;

    // Load and populate cloud-init template
    const cloudInit = loadCloudInitTemplate({
      repoUrl,
      branchName: branch,
      apiKey: ANTHROPIC_API_KEY!,
      githubPat: GITHUB_PAT!,
    });

    // Create droplet
    const dropletName = `homestead-${repoName}-${Date.now()}`;
    console.log(`[Droplet] Creating: ${dropletName}`);
    const { droplet } = await createDroplet(dropletName, cloudInit);

    console.log(`[Droplet] Created ID: ${droplet.id}, waiting for active status...`);

    // Wait for droplet to become active
    const ip = await waitForDropletActive(droplet.id);
    console.log(`[Droplet] Active at IP: ${ip}`);

    // Return droplet details
    const response: DropletResponse = {
      dropletId: droplet.id,
      ip,
      sessionId,
      repoName,
      branch,
      status: 'active',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[Droplet] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
