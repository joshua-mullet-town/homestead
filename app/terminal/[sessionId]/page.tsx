'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { ZoomIn, ZoomOut } from 'lucide-react';

export default function TerminalPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const sessionId = params.sessionId as string;
  const dropletIp = searchParams.get('ip');
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<any>(null);
  const fitAddonRef = useRef<any>(null);
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(14);
  const [showPreview, setShowPreview] = useState(false);

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
          fontSize: fontSize,
          fontFamily: 'Menlo, Monaco, "Courier New", monospace',
          cursorBlink: true,
          theme: {
            background: '#1e1e1e',
            foreground: '#d4d4d4',
            cursor: '#d4d4d4',
            cursorAccent: '#1e1e1e',
            selectionBackground: 'rgba(255, 255, 255, 0.3)',
          }
        });

        fitAddon = new FitAddon();
        xterm.loadAddon(fitAddon);
        fitAddonRef.current = fitAddon;

        // Mount terminal
        if (terminalRef.current) {
          xterm.open(terminalRef.current);
          fitAddon.fit();
          xtermRef.current = xterm;
        }

        // Connect to Socket.IO - use droplet IP if provided, otherwise local
        const protocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'https' : 'http';

        const socketUrl = dropletIp
          ? `http://${dropletIp}:3005` // Connect to droplet
          : (typeof window !== 'undefined'
              ? `${protocol}://${window.location.hostname}:3005` // Local with explicit port
              : 'http://localhost:3005');

        console.log('[Socket] Connecting to:', socketUrl, dropletIp ? `(droplet: ${dropletIp})` : '(local)');

        const socket = io(socketUrl, {
          transports: ['websocket', 'polling'],
          path: '/socket.io' // Explicit path
        });

        socketRef.current = socket;

        socket.on('connect', () => {
          console.log('[Socket] Connected');
          setIsConnected(true);
          setError(null);

          // Create terminal session (server will default to HOME directory)
          socket.emit('terminal:create', sessionId);
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
  }, [sessionId]); // Removed fontSize from dependencies

  // Handle font size change - update without reinitializing
  useEffect(() => {
    if (xtermRef.current && fitAddonRef.current) {
      xtermRef.current.options.fontSize = fontSize;
      // Refit terminal to adjust layout after font size change
      setTimeout(() => {
        if (fitAddonRef.current) {
          fitAddonRef.current.fit();
        }
      }, 100);
    }
  }, [fontSize]);

  // Handle sending messages from voice recorder
  const handleSendMessage = useCallback((message: string) => {
    if (socketRef.current && message.trim()) {
      // Send each character individually to simulate typing
      message.split('').forEach((char, index) => {
        setTimeout(() => {
          socketRef.current?.emit('terminal:input', sessionId, char);
        }, index * 10);
      });
      // Send enter key after the message
      setTimeout(() => {
        socketRef.current?.emit('terminal:input', sessionId, '\r');
      }, message.length * 10 + 100);
    }
  }, [sessionId]);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black flex flex-col overflow-hidden">
      {/* Status Bar */}
      <div className="flex-shrink-0 bg-gray-900 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
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
        <div className="flex items-center gap-3">
          {/* Toggle button */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-3 py-1.5 bg-[#00FF66] text-black font-bold rounded hover:bg-[#FFCC00] transition-colors text-sm"
          >
            {showPreview ? 'TERMINAL' : 'PREVIEW'}
          </button>

          {/* Font size controls */}
          <button
            onClick={() => setFontSize(prev => Math.max(10, prev - 2))}
            className="p-2 rounded bg-gray-800 hover:bg-gray-700 text-white active:scale-95 transition-transform"
            title="Decrease font size"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-sm text-gray-400 min-w-[3ch] text-center">{fontSize}</span>
          <button
            onClick={() => setFontSize(prev => Math.min(32, prev + 2))}
            className="p-2 rounded bg-gray-800 hover:bg-gray-700 text-white active:scale-95 transition-transform"
            title="Increase font size"
          >
            <ZoomIn size={16} />
          </button>
          {error && (
            <span className="text-sm text-red-400 ml-4">Error: {error}</span>
          )}
        </div>
      </div>

      {/* Terminal Container */}
      <div
        ref={terminalRef}
        className="flex-1 p-2 overflow-auto"
        style={{
          width: '100%',
          display: showPreview ? 'none' : 'block'
        }}
      />

      {/* Preview Container */}
      {showPreview && (
        <div className="flex-1 relative bg-white">
          {dropletIp ? (
            <iframe
              src={`http://${dropletIp}:3000`}
              className="absolute inset-0 w-full h-full border-0 bg-white"
              title="App Preview"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <p className="text-xl font-bold mb-2">No Preview Available</p>
                <p>No droplet IP provided</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
