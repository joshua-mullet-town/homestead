/**
 * Secrets management for Homestead
 * Loads project-specific environment variables from .env.secrets
 */

import { readFileSync } from 'fs';
import { join } from 'path';

interface ProjectSecrets {
  envLocal?: string;
  envDevelopment?: string;
  serviceAccountJsonBase64?: string;
}

/**
 * Loads secrets for a specific project from .env.secrets
 * Format: REPO_NAME__ENV_VAR_NAME=value
 * Example: CROWNE_VAULT__SENDGRID_API_KEY=sk_...
 */
export function loadProjectSecrets(repoName: string): ProjectSecrets {
  const secretsPath = join(process.cwd(), '.env.secrets');

  try {
    const secretsContent = readFileSync(secretsPath, 'utf-8');

    // Parse .env format
    const lines = secretsContent.split('\n');
    const secrets: Record<string, string> = {};

    // Normalize repo name for matching (lowercase, replace - with _)
    const normalizedRepoName = repoName.toLowerCase().replace(/-/g, '_').toUpperCase();
    const prefix = `${normalizedRepoName}__`;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const [key, ...valueParts] = trimmed.split('=');
      if (!key || valueParts.length === 0) continue;

      const value = valueParts.join('='); // Handle values with = in them

      if (key.startsWith(prefix)) {
        const envVarName = key.substring(prefix.length);
        secrets[envVarName] = value;
      }
    }

    // Build .env.local content
    const envLocalVars: string[] = [];
    const envDevVars: string[] = [];
    let serviceAccountJsonBase64: string | undefined;

    for (const [key, value] of Object.entries(secrets)) {
      if (key === 'SERVICE_ACCOUNT_JSON_BASE64') {
        serviceAccountJsonBase64 = value;
      } else if (key.startsWith('NEXT_PUBLIC_')) {
        // Public vars go in .env.development
        envDevVars.push(`${key}=${value}`);
      } else {
        // Private vars go in .env.local
        envLocalVars.push(`${key}=${value}`);
      }
    }

    // Add Firebase service account path if we have the JSON
    if (serviceAccountJsonBase64) {
      envLocalVars.push('GOOGLE_APPLICATION_CREDENTIALS=./service-account-dev.json');
    }

    return {
      envLocal: envLocalVars.length > 0 ? envLocalVars.join('\n') : undefined,
      envDevelopment: envDevVars.length > 0
        ? `# Firebase - Development\n${envDevVars.join('\n')}`
        : undefined,
      serviceAccountJsonBase64,
    };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      console.warn('[Secrets] No .env.secrets file found, proceeding without project secrets');
      return {};
    }
    throw err;
  }
}

/**
 * Get a human-readable summary of available secrets for a project
 */
export function getSecretsInfo(repoName: string): string {
  const secrets = loadProjectSecrets(repoName);
  const parts: string[] = [];

  if (secrets.envLocal) {
    const count = secrets.envLocal.split('\n').length;
    parts.push(`${count} private env vars`);
  }

  if (secrets.envDevelopment) {
    const count = secrets.envDevelopment.split('\n').filter(l => l && !l.startsWith('#')).length;
    parts.push(`${count} public env vars`);
  }

  if (secrets.serviceAccountJsonBase64) {
    parts.push('service account JSON');
  }

  return parts.length > 0 ? parts.join(', ') : 'no secrets configured';
}
