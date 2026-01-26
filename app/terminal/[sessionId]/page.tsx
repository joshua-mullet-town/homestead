'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';

export default function TerminalPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<any>(null);
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let xterm: any;
    let fitAddon: any;
    let mounted = true;

    const initTerminal = async () => {
      try {
        // Dynamically import xterm to avoid SSR issues
        const [{ Terminal }, { FitAddon }] = await Promise.all([
          import('@xterm/xterm'),
          import('@xterm/addon-fit')
        ]);

        if (!mounted) return;

        // Create terminal instance
        xterm = new Terminal({
          cols: 100,
          rows: 30,
          fontSize: 14,
          fontFamily: 'Menlo, Monaco, "Courier New", monospace',
          cursorBlink: true,
          theme: {
            background: '#1e1e1e',
            foreground: '#d4d4d4',
            cursor: '#d4d4d4',
            cursorAccent: '#1e1e1e',
            selection: 'rgba(255, 255, 255, 0.3)',
          }
        });

        fitAddon = new FitAddon();
        xterm.loadAddon(fitAddon);

        // Mount terminal
        if (terminalRef.current) {
          xterm.open(terminalRef.current);
          fitAddon.fit();
          xtermRef.current = xterm;
        }

        // Connect to Socket.IO - use current hostname so it works on mobile
        const socketUrl = typeof window !== 'undefined'
          ? `http://${window.location.hostname}:3005`
          : 'http://localhost:3005';

        const socket = io(socketUrl, {
          transports: ['websocket', 'polling']
        });

        socketRef.current = socket;

        socket.on('connect', () => {
          console.log('[Socket] Connected');
          setIsConnected(true);
          setError(null);

          // Create terminal session
          socket.emit('terminal:create', sessionId, '/Users/joshuamullet/code');
        });

        socket.on('disconnect', () => {
          console.log('[Socket] Disconnected');
          setIsConnected(false);
        });

        socket.on('terminal:ready', (sid) => {
          console.log('[Terminal] Ready:', sid);
          xterm.write('\r\n\x1b[1;32mTerminal connected!\x1b[0m\r\n');
        });

        socket.on('terminal:output', (sid, data) => {
          if (sid === sessionId) {
            xterm.write(data);
          }
        });

        socket.on('terminal:exit', (sid, { exitCode }) => {
          console.log(`[Terminal] Exited with code ${exitCode}`);
          xterm.write(`\r\n\r\n\x1b[1;31mProcess exited with code ${exitCode}\x1b[0m\r\n`);
        });

        socket.on('terminal:error', (sid, message) => {
          console.error('[Terminal] Error:', message);
          setError(message);
          xterm.write(`\r\n\x1b[1;31mError: ${message}\x1b[0m\r\n`);
        });

        // Handle user input
        xterm.onData((data: string) => {
          socket.emit('terminal:input', sessionId, data);
        });

        // Handle resize
        xterm.onResize(({ cols, rows }: { cols: number; rows: number }) => {
          socket.emit('terminal:resize', sessionId, cols, rows);
        });

        // Handle window resize
        const handleResize = () => {
          if (fitAddon) {
            fitAddon.fit();
          }
        };

        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
          if (socket) {
            socket.emit('terminal:kill', sessionId);
            socket.disconnect();
          }
          if (xterm) {
            xterm.dispose();
          }
        };
      } catch (err) {
        console.error('[Terminal] Init error:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize terminal');
      }
    };

    initTerminal();

    return () => {
      mounted = false;
    };
  }, [sessionId]);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black flex flex-col">
      {/* Status Bar */}
      <div className="bg-gray-900 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span style={{ fontFamily: 'VT323, monospace' }} className="text-xl text-white">
            TERMINAL: {sessionId}
          </span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-400">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        {error && (
          <span className="text-sm text-red-400">Error: {error}</span>
        )}
      </div>

      {/* Terminal Container */}
      <div
        ref={terminalRef}
        className="flex-1 p-2"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
