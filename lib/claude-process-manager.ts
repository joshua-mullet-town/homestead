/**
 * Simplified Claude Process Manager
 * Extracted from CUI and adapted for Homestead
 *
 * Spawns and manages Claude Code CLI processes with JSONL output
 */

import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
import { existsSync } from 'fs';
import path from 'path';

export interface ClaudeMessage {
  type: 'assistant' | 'user' | 'tool_use' | 'tool_result' | 'system';
  content?: string;
  toolName?: string;
  toolInput?: any;
  toolResult?: any;
  timestamp: string;
}

export interface ConversationConfig {
  workingDirectory: string;
  initialPrompt?: string;
  model?: string;
  dangerouslySkipPermissions?: boolean;
}

export interface StreamEvent {
  type: 'message' | 'file_edit' | 'bash_output' | 'error' | 'complete';
  data: any;
  timestamp: string;
}

export class ClaudeProcessManager extends EventEmitter {
  private processes: Map<string, ChildProcess> = new Map();
  private claudeExecutablePath: string;

  constructor(claudeExecutablePath?: string) {
    super();
    this.claudeExecutablePath = claudeExecutablePath || this.findClaudeExecutable();
  }

  /**
   * Find Claude executable in node_modules or PATH
   */
  private findClaudeExecutable(): string {
    // Try node_modules/.bin/claude
    const nodeModulesPath = path.join(process.cwd(), 'node_modules', '.bin', 'claude');
    if (existsSync(nodeModulesPath)) {
      return nodeModulesPath;
    }

    // Try global PATH
    const pathEnv = process.env.PATH || '';
    const pathDirs = pathEnv.split(path.delimiter);
    for (const dir of pathDirs) {
      const candidate = path.join(dir, 'claude');
      if (existsSync(candidate)) {
        return candidate;
      }
    }

    // Fallback to just 'claude' and hope it's on PATH
    return 'claude';
  }

  /**
   * Start a new Claude Code conversation
   */
  async startConversation(sessionId: string, config: ConversationConfig): Promise<void> {
    console.log(`[ClaudeProcess] Starting conversation for session: ${sessionId}`);

    const args: string[] = [];

    // Add initial prompt if provided
    if (config.initialPrompt) {
      args.push(config.initialPrompt);
    }

    // Add flags
    if (config.dangerouslySkipPermissions) {
      args.push('--dangerously-skip-permissions');
    }

    if (config.model) {
      args.push('--model', config.model);
    }

    // Spawn Claude process
    const childProcess = spawn(this.claudeExecutablePath, args, {
      cwd: config.workingDirectory,
      env: {
        ...process.env,
        ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
        // Force JSONL output mode (if Claude Code supports it)
        CLAUDE_OUTPUT_FORMAT: 'json',
      },
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    this.processes.set(sessionId, childProcess);

    // Handle stdout (JSONL events or regular output)
    let buffer = '';
    childProcess.stdout.on('data', (data: Buffer) => {
      buffer += data.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.trim()) {
          this.handleOutput(sessionId, line);
        }
      }
    });

    // Handle stderr
    childProcess.stderr.on('data', (data: Buffer) => {
      const output = data.toString();
      console.error(`[ClaudeProcess] stderr:`, output);
      this.emit('stream-event', {
        sessionId,
        event: {
          type: 'error',
          data: { message: output },
          timestamp: new Date().toISOString(),
        },
      });
    });

    // Handle process exit
    childProcess.on('exit', (code) => {
      console.log(`[ClaudeProcess] Process exited with code ${code}`);
      this.emit('stream-event', {
        sessionId,
        event: {
          type: 'complete',
          data: { exitCode: code },
          timestamp: new Date().toISOString(),
        },
      });
      this.processes.delete(sessionId);
    });

    // Handle errors
    childProcess.on('error', (error) => {
      console.error(`[ClaudeProcess] Process error:`, error);
      this.emit('stream-event', {
        sessionId,
        event: {
          type: 'error',
          data: { message: error.message },
          timestamp: new Date().toISOString(),
        },
      });
    });
  }

  /**
   * Handle output from Claude process
   * Try to parse as JSONL, fallback to plain text
   */
  private handleOutput(sessionId: string, line: string): void {
    try {
      // Try parsing as JSON (JSONL format)
      const event = JSON.parse(line);
      this.emit('stream-event', {
        sessionId,
        event: {
          type: event.type || 'message',
          data: event,
          timestamp: new Date().toISOString(),
        },
      });
    } catch {
      // Not JSON, treat as plain text output
      this.emit('stream-event', {
        sessionId,
        event: {
          type: 'message',
          data: { content: line },
          timestamp: new Date().toISOString(),
        },
      });
    }
  }

  /**
   * Send a message to Claude
   */
  sendMessage(sessionId: string, message: string): boolean {
    const childProcess = this.processes.get(sessionId);
    if (!childProcess || !childProcess.stdin.writable) {
      console.error(`[ClaudeProcess] No writable process for session: ${sessionId}`);
      return false;
    }

    try {
      // Send message to Claude's stdin
      childProcess.stdin.write(message + '\n');
      return true;
    } catch (error) {
      console.error(`[ClaudeProcess] Error sending message:`, error);
      return false;
    }
  }

  /**
   * Kill a Claude process
   */
  killProcess(sessionId: string): boolean {
    const childProcess = this.processes.get(sessionId);
    if (!childProcess) {
      return false;
    }

    childProcess.kill();
    this.processes.delete(sessionId);
    return true;
  }

  /**
   * Check if a process is running for a session
   */
  hasProcess(sessionId: string): boolean {
    return this.processes.has(sessionId);
  }

  /**
   * Get all active session IDs
   */
  getActiveSessions(): string[] {
    return Array.from(this.processes.keys());
  }
}
