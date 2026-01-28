'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ZapIcon, TerminalIcon, ChevronLeftIcon, Home } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'message' | 'file_edit' | 'bash_output' | 'error' | 'connected' | 'complete';
  data: any;
  timestamp: string;
}

export default function ChatPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const sessionId = params.sessionId as string;
  const ip = searchParams.get('ip');
  const workingDir = searchParams.get('dir') || '/root/workspace';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Start Claude session on mount
  useEffect(() => {
    startClaudeSession();
  }, [sessionId]);

  const startClaudeSession = async () => {
    setIsStarting(true);
    console.log('[Chat] Starting Claude session...', { sessionId, workingDir });
    try {
      const response = await fetch('/api/chat/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          workingDirectory: workingDir,
          initialPrompt: 'Hello! I\'m ready to help. What would you like me to do?',
        }),
      });

      console.log('[Chat] Start response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.log('[Chat] Start response error:', error);
        if (error.error === 'Session already exists') {
          // Session already running, just connect
          console.log('[Chat] Session already exists, connecting to stream');
        } else {
          throw new Error(error.error || 'Failed to start session');
        }
      } else {
        const data = await response.json();
        console.log('[Chat] Start response success:', data);
      }

      // Connect to event stream
      console.log('[Chat] Connecting to stream...');
      connectToStream();
    } catch (err) {
      console.error('[Chat] Error starting session:', err);
      setError(err instanceof Error ? err.message : 'Failed to start Claude session');
    } finally {
      setIsStarting(false);
    }
  };

  const connectToStream = () => {
    console.log('[Chat] Creating EventSource for session:', sessionId);
    const eventSource = new EventSource(`/api/chat/stream/${sessionId}`);

    eventSource.onopen = () => {
      console.log('[Chat] EventSource opened successfully');
    };

    eventSource.onmessage = (e) => {
      console.log('[Chat] Raw event data:', e.data);
      const event = JSON.parse(e.data);
      console.log('[Chat] Parsed event:', event);

      if (event.type === 'connected') {
        console.log('[Chat] Connected! Setting isConnected to true');
        setIsConnected(true);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-${Math.random()}`,
            ...event,
          },
        ]);
      }
    };

    eventSource.onerror = (err) => {
      console.error('[Chat] EventSource error:', err);
      console.error('[Chat] EventSource readyState:', eventSource.readyState);
      setIsConnected(false);
      eventSource.close();
    };

    return () => eventSource.close();
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: input,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Add user message to UI
      setMessages((prev) => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          type: 'message',
          data: { content: `You: ${input}`, isUser: true },
          timestamp: new Date().toISOString(),
        },
      ]);

      setInput('');
    } catch (err) {
      console.error('[Chat] Error sending message:', err);
      setError('Failed to send message');
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[rgb(var(--color-orange))] flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-gray-900 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/terminal/${sessionId}?ip=${ip}`}
            className="p-2 hover:bg-gray-800 rounded transition-colors"
          >
            <ChevronLeftIcon className="w-6 h-6 text-white" />
          </Link>
          <span style={{ fontFamily: 'VT323, monospace' }} className="text-xl text-white">
            🤖 CLAUDE CHAT: {sessionId}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-400">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <Link
            href="/"
            className="px-3 py-1.5 bg-gray-800 text-white font-bold rounded hover:bg-[#FF6600] transition-colors text-sm flex items-center gap-1"
          >
            <Home size={14} />
            HOME
          </Link>
          <Link
            href={`/terminal/${sessionId}?ip=${ip}`}
            className="px-3 py-1.5 bg-[#FF6600] text-white font-bold rounded hover:bg-[#FF3333] transition-colors text-sm"
          >
            <TerminalIcon className="inline w-4 h-4 mr-1" />
            TERMINAL
          </Link>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isStarting && (
          <div className="card-white shadow-retro-xl p-6 animate-pulse">
            <div className="flex items-center justify-center gap-3">
              <ZapIcon className="w-8 h-8 animate-spin" />
              <span className="text-2xl text-[rgb(var(--color-black))] font-black">
                STARTING CLAUDE...
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="card-red shadow-retro-xl p-4">
            <p className="text-white font-bold">⚠️ {error}</p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className="card-white shadow-retro-lg p-4">
            {msg.type === 'message' && (
              <div>
                <p
                  className={`font-bold text-lg whitespace-pre-wrap ${
                    msg.data.isUser ? 'text-[rgb(var(--color-orange))]' : 'text-[rgb(var(--color-black))]'
                  }`}
                  style={{ fontFamily: msg.data.isUser ? 'Rubik' : 'VT323' }}
                >
                  {msg.data.content}
                </p>
              </div>
            )}

            {msg.type === 'file_edit' && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📝</span>
                  <span className="font-black text-lg">{msg.data.file || 'File Edit'}</span>
                </div>
                <pre className="bg-black text-green-500 p-3 rounded overflow-x-auto text-sm">
                  {JSON.stringify(msg.data, null, 2)}
                </pre>
              </div>
            )}

            {msg.type === 'bash_output' && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">⚡</span>
                  <span className="font-black text-lg">Command Output</span>
                </div>
                <pre className="bg-black text-white p-3 rounded overflow-x-auto text-sm font-mono">
                  {msg.data.output || JSON.stringify(msg.data, null, 2)}
                </pre>
              </div>
            )}

            {msg.type === 'error' && (
              <div className="bg-red-100 border-4 border-red-500 p-3 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">❌</span>
                  <span className="font-black text-lg text-red-700">Error</span>
                </div>
                <p className="text-red-700 font-bold">{msg.data.message}</p>
              </div>
            )}

            {msg.type === 'complete' && (
              <div className="bg-green-100 border-4 border-green-500 p-3 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✅</span>
                  <span className="font-black text-lg text-green-700">
                    Claude session completed (exit code: {msg.data.exitCode})
                  </span>
                </div>
              </div>
            )}

            <div className="text-xs text-gray-500 mt-2">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 p-4 bg-gray-900 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Type a message to Claude..."
            className="flex-1 p-3 border-4 border-[rgb(var(--color-black))] text-lg font-bold"
            disabled={!isConnected}
          />
          <button
            onClick={sendMessage}
            disabled={!isConnected || !input.trim()}
            className="px-6 py-3 card-green shadow-retro-lg font-black text-lg disabled:opacity-50 disabled:cursor-not-allowed active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  );
}
