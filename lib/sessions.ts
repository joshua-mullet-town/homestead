import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const SESSIONS_DIR = join(process.cwd(), '.sessions');
const SESSIONS_FILE = join(SESSIONS_DIR, 'sessions.json');

export interface SessionMetadata {
  sessionId: string;
  dropletId: number;
  ip: string;
  repoName: string;
  repoUrl: string;
  branch: string;
  issueNumber?: number;
  createdAt: string;
}

// Ensure sessions directory exists
function ensureSessionsDir() {
  if (!existsSync(SESSIONS_DIR)) {
    mkdirSync(SESSIONS_DIR, { recursive: true });
  }
}

// Read all sessions
export function getSessions(): SessionMetadata[] {
  ensureSessionsDir();

  if (!existsSync(SESSIONS_FILE)) {
    return [];
  }

  try {
    const data = readFileSync(SESSIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('[Sessions] Error reading sessions file:', error);
    return [];
  }
}

// Save a new session
export function saveSession(session: SessionMetadata) {
  ensureSessionsDir();

  const sessions = getSessions();
  sessions.push(session);

  try {
    writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
    console.log('[Sessions] Saved session:', session.sessionId);
  } catch (error) {
    console.error('[Sessions] Error saving session:', error);
    throw error;
  }
}

// Remove a session by sessionId
export function removeSession(sessionId: string) {
  ensureSessionsDir();

  const sessions = getSessions();
  const filtered = sessions.filter(s => s.sessionId !== sessionId);

  try {
    writeFileSync(SESSIONS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    console.log('[Sessions] Removed session:', sessionId);
  } catch (error) {
    console.error('[Sessions] Error removing session:', error);
    throw error;
  }
}

// Get a session by sessionId
export function getSession(sessionId: string): SessionMetadata | null {
  const sessions = getSessions();
  return sessions.find(s => s.sessionId === sessionId) || null;
}

// Find a session by repo name and issue number
export function findSessionByIssue(repoName: string, issueNumber: number): SessionMetadata | null {
  const sessions = getSessions();
  return sessions.find(s =>
    s.repoName === repoName && s.issueNumber === issueNumber
  ) || null;
}
