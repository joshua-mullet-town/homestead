const { createServer: createHttpServer } = require('http');
const { createServer: createHttpsServer } = require('https');
const { readFileSync, existsSync, appendFileSync, mkdirSync } = require('fs');
const { parse } = require('url');
const { join } = require('path');
const next = require('next');
const { Server } = require('socket.io');
const pty = require('node-pty');
const os = require('os');

// Logging utility
const LOG_DIR = '/tmp';
const LOG_FILE = join(LOG_DIR, 'homestead-server.log');

function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}\n`;

  // Write to file
  try {
    appendFileSync(LOG_FILE, logMessage);
  } catch (err) {
    // Fallback to console if file write fails
    console.error('Failed to write to log file:', err);
  }

  // Also write to console
  console.log(logMessage.trim());
}

log('=== Homestead Server Starting ===', 'STARTUP');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '::'; // Listen on all interfaces (IPv6 + IPv4)
const port = 3005;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// For development, use HTTP on localhost (Chrome trusts it for microphone)
// For production, use HTTPS with proper domain
const useHttps = false; // Disabled for development

// Terminal manager
class TerminalManager {
  constructor() {
    this.terminals = new Map();
  }

  createTerminal(sessionId, cwd = process.env.HOME || '/root') {
    log(`[TerminalManager] createTerminal called - sessionId: ${sessionId}, cwd: ${cwd}`);

    if (this.terminals.has(sessionId)) {
      log(`[TerminalManager] Terminal already exists for session: ${sessionId}`, 'WARN');
      return this.terminals.get(sessionId);
    }

    const shell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL'];
    log(`[Terminal] Spawning shell: ${shell}, cwd: ${cwd}, platform: ${os.platform()}`);

    let ptyProcess;
    try {
      log(`[Terminal] Attempting to spawn PTY with shell: ${shell}`);
      ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 24,
        cwd: cwd,
        env: process.env
      });
      log(`[Terminal] PTY spawned successfully, pid: ${ptyProcess.pid}`);
    } catch (error) {
      log(`[Terminal] Spawn error: ${error.message}`, 'ERROR');
      log(`[Terminal] Error code: ${error.code}, errno: ${error.errno}`, 'ERROR');
      log(`[Terminal] Stack: ${error.stack}`, 'ERROR');
      throw error;
    }

    const terminalData = {
      ptyProcess,
      sessionId,
      clients: new Set(),
      created: new Date()
    };

    this.terminals.set(sessionId, terminalData);
    log(`[Terminal] Created terminal for session: ${sessionId}, total terminals: ${this.terminals.size}`);

    return terminalData;
  }

  writeToTerminal(sessionId, data) {
    const terminal = this.terminals.get(sessionId);
    if (terminal && terminal.ptyProcess) {
      // Log only first 100 chars to avoid spam
      const preview = data.length > 100 ? data.substring(0, 100) + '...' : data;
      log(`[Terminal] Writing to ${sessionId}: ${JSON.stringify(preview)}`);
      terminal.ptyProcess.write(data);
      return true;
    }
    log(`[Terminal] Write failed - no terminal found for session: ${sessionId}`, 'WARN');
    return false;
  }

  resizeTerminal(sessionId, cols, rows) {
    const terminal = this.terminals.get(sessionId);
    if (terminal && terminal.ptyProcess) {
      try {
        terminal.ptyProcess.resize(cols, rows);
        log(`[Terminal] Resized ${sessionId} to ${cols}x${rows}`);
      } catch (e) {
        log(`[Terminal] Resize error for ${sessionId}: ${e.message}`, 'ERROR');
      }
    } else {
      log(`[Terminal] Resize failed - no terminal found for session: ${sessionId}`, 'WARN');
    }
  }

  killTerminal(sessionId) {
    const terminal = this.terminals.get(sessionId);
    if (terminal) {
      log(`[Terminal] Killing terminal: ${sessionId}, pid: ${terminal.ptyProcess.pid}`);
      terminal.ptyProcess.kill();
      this.terminals.delete(sessionId);
      log(`[Terminal] Killed terminal: ${sessionId}, remaining: ${this.terminals.size}`);
    } else {
      log(`[Terminal] Kill failed - no terminal found for session: ${sessionId}`, 'WARN');
    }
  }

  getTerminal(sessionId) {
    return this.terminals.get(sessionId);
  }
}

app.prepare().then(() => {
  // Use HTTP for development (localhost is trusted by Chrome for microphone)
  const server = createHttpServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  const terminalManager = new TerminalManager();

  io.on('connection', (socket) => {
    log(`[Socket] Client connected: ${socket.id}, address: ${socket.handshake.address}`);

    socket.on('terminal:create', (sessionId, cwd) => {
      log(`[Socket] terminal:create event - sessionId: ${sessionId}, cwd: ${cwd || 'default'}, client: ${socket.id}`);

      try {
        const terminal = terminalManager.createTerminal(sessionId, cwd);
        terminal.clients.add(socket.id);
        log(`[Socket] Added client ${socket.id} to terminal ${sessionId}, total clients: ${terminal.clients.size}`);

        // Send ready event
        log(`[Socket] Emitting terminal:ready for session: ${sessionId}`);
        socket.emit('terminal:ready', sessionId);

        // Auto-start Claude Code in project directory after a brief delay
        log(`[Socket] Scheduling auto-start commands for session: ${sessionId}`);
        setTimeout(() => {
          if (terminal.ptyProcess) {
            log(`[Socket] Executing auto-start: cd /root/project`);
            terminal.ptyProcess.write('cd /root/project\n');
            setTimeout(() => {
              log(`[Socket] Executing auto-start: clear`);
              terminal.ptyProcess.write('clear\n');
              setTimeout(() => {
                log(`[Socket] Executing auto-start: IS_SANDBOX=1 claude --dangerously-skip-permissions`);
                terminal.ptyProcess.write('IS_SANDBOX=1 claude --dangerously-skip-permissions\n');
              }, 100);
            }, 100);
          } else {
            log(`[Socket] Auto-start failed - ptyProcess is null for session: ${sessionId}`, 'ERROR');
          }
        }, 500);

        // Forward PTY data to client
        terminal.ptyProcess.on('data', (data) => {
          // Don't log every data event - too spammy
          socket.emit('terminal:output', sessionId, data);
        });

        // Handle PTY exit
        terminal.ptyProcess.on('exit', (exitCode) => {
          log(`[Terminal] Process exited with code ${exitCode} for session: ${sessionId}`);
          socket.emit('terminal:exit', sessionId, { exitCode });
          terminalManager.killTerminal(sessionId);
        });

      } catch (error) {
        log(`[Terminal] Error creating terminal for session ${sessionId}: ${error.message}`, 'ERROR');
        log(`[Terminal] Error stack: ${error.stack}`, 'ERROR');
        socket.emit('terminal:error', sessionId, error.message);
      }
    });

    socket.on('terminal:input', (sessionId, data) => {
      // Already logged in writeToTerminal
      terminalManager.writeToTerminal(sessionId, data);
    });

    socket.on('terminal:resize', (sessionId, cols, rows) => {
      // Already logged in resizeTerminal
      terminalManager.resizeTerminal(sessionId, cols, rows);
    });

    socket.on('terminal:kill', (sessionId) => {
      log(`[Socket] terminal:kill event for session: ${sessionId}, client: ${socket.id}`);
      terminalManager.killTerminal(sessionId);
      socket.emit('terminal:killed', sessionId);
    });

    socket.on('disconnect', () => {
      log(`[Socket] Client disconnected: ${socket.id}`);
      // Clean up terminals if no clients left
      terminalManager.terminals.forEach((terminal, sessionId) => {
        terminal.clients.delete(socket.id);
        log(`[Socket] Removed client ${socket.id} from terminal ${sessionId}, remaining: ${terminal.clients.size}`);
        if (terminal.clients.size === 0) {
          log(`[Terminal] No clients left, killing terminal: ${sessionId}`);
          terminalManager.killTerminal(sessionId);
        }
      });
    });
  });

  log(`[Server] Starting HTTP server on ${hostname}:${port}`, 'STARTUP');
  server.listen(port, hostname, (err) => {
    if (err) {
      log(`[Server] Failed to start: ${err.message}`, 'ERROR');
      throw err;
    }
    log(`[Server] Ready on http://${hostname}:${port}`, 'STARTUP');
    log(`[Server] Socket.IO server running`, 'STARTUP');
    log(`[Server] Log file: ${LOG_FILE}`, 'STARTUP');
  });
});
