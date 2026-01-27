const { createServer: createHttpServer } = require('http');
const { createServer: createHttpsServer } = require('https');
const { readFileSync, existsSync } = require('fs');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const pty = require('node-pty');
const os = require('os');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = 3005;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Check for SSL certificates
const useHttps = existsSync('localhost-key.pem') && existsSync('localhost-cert.pem');
const httpsOptions = useHttps ? {
  key: readFileSync('localhost-key.pem'),
  cert: readFileSync('localhost-cert.pem')
} : null;

// Terminal manager
class TerminalManager {
  constructor() {
    this.terminals = new Map();
  }

  createTerminal(sessionId, cwd = '/Users/joshuamullet/code') {
    if (this.terminals.has(sessionId)) {
      return this.terminals.get(sessionId);
    }

    const shell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL'];
    console.log('[Terminal] Spawning shell:', shell, 'cwd:', cwd, 'platform:', os.platform());

    let ptyProcess;
    try {
      ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 24,
        cwd: cwd,
        env: process.env
      });
    } catch (error) {
      console.error('[Terminal] Spawn error details:', error);
      console.error('[Terminal] Error code:', error.code);
      console.error('[Terminal] Error errno:', error.errno);
      throw error;
    }

    const terminalData = {
      ptyProcess,
      sessionId,
      clients: new Set(),
      created: new Date()
    };

    this.terminals.set(sessionId, terminalData);
    console.log(`[Terminal] Created terminal for session: ${sessionId}`);

    return terminalData;
  }

  writeToTerminal(sessionId, data) {
    const terminal = this.terminals.get(sessionId);
    if (terminal && terminal.ptyProcess) {
      terminal.ptyProcess.write(data);
      return true;
    }
    return false;
  }

  resizeTerminal(sessionId, cols, rows) {
    const terminal = this.terminals.get(sessionId);
    if (terminal && terminal.ptyProcess) {
      try {
        terminal.ptyProcess.resize(cols, rows);
        console.log(`[Terminal] Resized ${sessionId} to ${cols}x${rows}`);
      } catch (e) {
        console.error(`[Terminal] Resize error:`, e);
      }
    }
  }

  killTerminal(sessionId) {
    const terminal = this.terminals.get(sessionId);
    if (terminal) {
      terminal.ptyProcess.kill();
      this.terminals.delete(sessionId);
      console.log(`[Terminal] Killed terminal: ${sessionId}`);
    }
  }

  getTerminal(sessionId) {
    return this.terminals.get(sessionId);
  }
}

app.prepare().then(() => {
  // Create HTTP or HTTPS server based on certificate availability
  const server = useHttps
    ? createHttpsServer(httpsOptions, async (req, res) => {
        try {
          const parsedUrl = parse(req.url, true);
          await handle(req, res, parsedUrl);
        } catch (err) {
          console.error('Error occurred handling', req.url, err);
          res.statusCode = 500;
          res.end('internal server error');
        }
      })
    : createHttpServer(async (req, res) => {
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
    console.log('[Socket] Client connected:', socket.id);

    socket.on('terminal:create', (sessionId, cwd) => {
      console.log(`[Socket] Creating terminal for session: ${sessionId}`);

      try {
        const terminal = terminalManager.createTerminal(sessionId, cwd);
        terminal.clients.add(socket.id);

        // Send ready event
        socket.emit('terminal:ready', sessionId);

        // Forward PTY data to client
        terminal.ptyProcess.on('data', (data) => {
          socket.emit('terminal:output', sessionId, data);
        });

        // Handle PTY exit
        terminal.ptyProcess.on('exit', (exitCode) => {
          console.log(`[Terminal] Process exited with code ${exitCode}`);
          socket.emit('terminal:exit', sessionId, { exitCode });
          terminalManager.killTerminal(sessionId);
        });

      } catch (error) {
        console.error('[Terminal] Error creating terminal:', error);
        socket.emit('terminal:error', sessionId, error.message);
      }
    });

    socket.on('terminal:input', (sessionId, data) => {
      terminalManager.writeToTerminal(sessionId, data);
    });

    socket.on('terminal:resize', (sessionId, cols, rows) => {
      terminalManager.resizeTerminal(sessionId, cols, rows);
    });

    socket.on('terminal:kill', (sessionId) => {
      terminalManager.killTerminal(sessionId);
      socket.emit('terminal:killed', sessionId);
    });

    socket.on('disconnect', () => {
      console.log('[Socket] Client disconnected:', socket.id);
      // Clean up terminals if no clients left
      terminalManager.terminals.forEach((terminal, sessionId) => {
        terminal.clients.delete(socket.id);
        if (terminal.clients.size === 0) {
          console.log(`[Terminal] No clients left, killing terminal: ${sessionId}`);
          terminalManager.killTerminal(sessionId);
        }
      });
    });
  });

  server.listen(port, hostname, (err) => {
    if (err) throw err;
    const protocol = useHttps ? 'https' : 'http';
    console.log(`> Ready on ${protocol}://${hostname}:${port}`);
    console.log(`> Socket.IO server running`);
    if (useHttps) {
      console.log(`> HTTPS enabled - microphone access available`);
    } else {
      console.log(`> WARNING: HTTP mode - microphone requires HTTPS (except localhost)`);
    }
  });
});
