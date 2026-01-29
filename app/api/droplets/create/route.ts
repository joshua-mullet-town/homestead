import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, appendFileSync } from 'fs';
import { join } from 'path';
import { saveSession } from '@/lib/sessions';
import { loadProjectSecrets, getSecretsInfo } from '@/lib/secrets';

const DO_API_TOKEN = process.env.DO_API_TOKEN;
const SSH_KEY_ID = '53651428';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const GITHUB_PAT = process.env.GH_TOKEN;

// API logging
const API_LOG_FILE = '/tmp/homestead-api.log';

function logAPI(message: string, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [API] [${level}] ${message}\n`;

  try {
    appendFileSync(API_LOG_FILE, logMessage);
  } catch (err) {
    console.error('Failed to write to API log file:', err);
  }

  console.log(logMessage.trim());
}

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
  logAPI(`Creating droplet: ${name}`);
  logAPI(`Droplet config: region=nyc3, size=s-2vcpu-4gb, image=ubuntu-22-04-x64`);

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
    logAPI(`Failed to create droplet: ${error}`, 'ERROR');
    throw new Error(`Failed to create droplet: ${error}`);
  }

  const result = await response.json();
  logAPI(`Droplet created successfully: ID=${result.droplet.id}`);
  return result;
}

async function getDropletStatus(dropletId: number) {
  logAPI(`Checking status for droplet ${dropletId}`);
  const response = await fetch(`https://api.digitalocean.com/v2/droplets/${dropletId}`, {
    headers: {
      Authorization: `Bearer ${DO_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    logAPI(`Failed to get droplet status for ${dropletId}`, 'ERROR');
    throw new Error('Failed to get droplet status');
  }

  const result = await response.json();
  logAPI(`Droplet ${dropletId} status: ${result.droplet.status}`);
  return result;
}

async function waitForDropletActive(dropletId: number, maxWaitMs = 120000): Promise<string> {
  const startTime = Date.now();
  const pollInterval = 5000;

  logAPI(`Waiting for droplet ${dropletId} to become active (timeout: ${maxWaitMs}ms)`);

  while (Date.now() - startTime < maxWaitMs) {
    const { droplet } = await getDropletStatus(dropletId);
    const elapsed = Date.now() - startTime;

    if (droplet.status === 'active' && droplet.networks.v4.length > 0) {
      const ip = droplet.networks.v4[0].ip_address;
      logAPI(`Droplet ${dropletId} is active at ${ip} (took ${elapsed}ms)`);
      return ip;
    }

    logAPI(`Droplet ${dropletId} status: ${droplet.status}, waiting... (${elapsed}ms elapsed)`);
    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }

  logAPI(`Droplet ${dropletId} provisioning timeout after ${maxWaitMs}ms`, 'ERROR');
  throw new Error('Droplet provisioning timeout');
}

function loadCloudInitTemplate(variables: {
  repoPath: string;
  branchName: string;
  apiKey: string;
  githubPat: string;
  projectEnvLocal?: string;
  projectEnvDevelopment?: string;
  serviceAccountJsonBase64?: string;
}): string {
  const templatePath = join(process.cwd(), 'cloud-init.yaml');
  const template = readFileSync(templatePath, 'utf-8');

  // Base64 encode env files to avoid YAML parsing issues
  const envLocalB64 = variables.projectEnvLocal
    ? Buffer.from(variables.projectEnvLocal).toString('base64')
    : '';
  const envDevB64 = variables.projectEnvDevelopment
    ? Buffer.from(variables.projectEnvDevelopment).toString('base64')
    : '';

  return template
    .replace(/\{\{REPO_PATH\}\}/g, variables.repoPath)
    .replace(/\{\{BRANCH_NAME\}\}/g, variables.branchName)
    .replace(/\{\{ANTHROPIC_API_KEY\}\}/g, variables.apiKey)
    .replace(/\{\{GITHUB_PAT\}\}/g, variables.githubPat)
    .replace(/\{\{PROJECT_ENV_LOCAL_B64\}\}/g, envLocalB64)
    .replace(/\{\{PROJECT_ENV_DEVELOPMENT_B64\}\}/g, envDevB64)
    .replace(/\{\{SERVICE_ACCOUNT_JSON_B64\}\}/g, variables.serviceAccountJsonBase64 || '');
}

export async function POST(request: NextRequest) {
  logAPI('=== POST /api/droplets/create ===');

  try {
    // Validate environment variables
    logAPI('Validating environment variables...');
    if (!DO_API_TOKEN) {
      logAPI('DO_API_TOKEN not configured', 'ERROR');
      return NextResponse.json(
        { error: 'DO_API_TOKEN not configured' },
        { status: 500 }
      );
    }

    if (!ANTHROPIC_API_KEY || !GITHUB_PAT) {
      logAPI('Missing ANTHROPIC_API_KEY or GH_TOKEN', 'ERROR');
      return NextResponse.json(
        { error: 'Missing ANTHROPIC_API_KEY or GH_TOKEN' },
        { status: 500 }
      );
    }
    logAPI('Environment variables validated successfully');

    const body: CreateDropletRequest = await request.json();
    const { repoUrl, repoName, branchName, issueNumber } = body;
    logAPI(`Request body: repoUrl=${repoUrl}, repoName=${repoName}, branchName=${branchName}, issueNumber=${issueNumber}`);

    if (!repoUrl || !repoName) {
      logAPI('Missing required fields: repoUrl or repoName', 'ERROR');
      return NextResponse.json(
        { error: 'repoUrl and repoName are required' },
        { status: 400 }
      );
    }

    // Extract repo path from URL (e.g., "joshua-mullet-town/crowne-vault" from "https://github.com/...")
    const repoPath = repoUrl.replace(/^https:\/\/github\.com\//, '').replace(/\.git$/, '');
    logAPI(`Extracted repo path: ${repoPath}`);

    // Generate branch name
    const branch = branchName || (issueNumber ? `issue-${issueNumber}` : `session-${Date.now()}`);
    const sessionId = `${repoName}-${Date.now()}`;
    logAPI(`Generated branch: ${branch}, sessionId: ${sessionId}`);

    // Load project-specific secrets
    logAPI(`Loading secrets for project: ${repoName}`);
    const secrets = loadProjectSecrets(repoName);
    const secretsInfo = getSecretsInfo(repoName);
    logAPI(`Secrets loaded: ${secretsInfo}`);

    // Load and populate cloud-init template
    logAPI('Loading cloud-init template...');
    const cloudInit = loadCloudInitTemplate({
      repoPath,
      branchName: branch,
      apiKey: ANTHROPIC_API_KEY!,
      githubPat: GITHUB_PAT!,
      projectEnvLocal: secrets.envLocal,
      projectEnvDevelopment: secrets.envDevelopment,
      serviceAccountJsonBase64: secrets.serviceAccountJsonBase64,
    });
    logAPI('Cloud-init template loaded and variables substituted');

    // Create droplet
    const dropletName = `homestead-${repoName}-${Date.now()}`;
    logAPI(`Creating droplet: ${dropletName}`);
    const { droplet } = await createDroplet(dropletName, cloudInit);

    logAPI(`Droplet created with ID: ${droplet.id}, waiting for active status...`);

    // Wait for droplet to become active
    const ip = await waitForDropletActive(droplet.id);
    logAPI(`Droplet ${droplet.id} is now active at IP: ${ip}`);

    // Save session metadata
    logAPI('Saving session metadata...');
    saveSession({
      sessionId,
      dropletId: droplet.id,
      ip,
      repoName,
      repoUrl,
      branch,
      issueNumber,
      createdAt: new Date().toISOString(),
    });
    logAPI(`Session saved: ${sessionId}`);

    // Return droplet details
    const response: DropletResponse = {
      dropletId: droplet.id,
      ip,
      sessionId,
      repoName,
      branch,
      status: 'active',
    };

    logAPI(`SUCCESS: Returning response - dropletId=${droplet.id}, ip=${ip}, sessionId=${sessionId}`);
    return NextResponse.json(response);
  } catch (error) {
    logAPI(`ERROR in POST handler: ${error instanceof Error ? error.message : String(error)}`, 'ERROR');
    if (error instanceof Error) {
      logAPI(`Error stack: ${error.stack}`, 'ERROR');
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
