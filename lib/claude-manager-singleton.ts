import { ClaudeProcessManager } from './claude-process-manager';

// Global singleton instance
let managerInstance: ClaudeProcessManager | null = null;

export function getClaudeManager(): ClaudeProcessManager {
  if (!managerInstance) {
    managerInstance = new ClaudeProcessManager();
  }
  return managerInstance;
}
