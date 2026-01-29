import { NextRequest } from 'next/server';
import { getClaudeManager } from '@/lib/claude-manager-singleton';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ sessionId: string }> }
) {
  const params = await context.params;
  const sessionId = params.sessionId;
  console.log('[ChatStream] Stream requested for session:', sessionId);

  if (!sessionId) {
    console.error('[ChatStream] No session ID provided');
    return new Response('Session ID required', { status: 400 });
  }

  console.log('[ChatStream] Getting manager...');
  const manager = getClaudeManager();
  console.log('[ChatStream] Manager obtained, setting up SSE...');

  // Set up Server-Sent Events (SSE)
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      console.log('[ChatStream] Stream started for session:', sessionId);

      // Send initial connection message
      const initialData = `data: ${JSON.stringify({
        type: 'connected',
        sessionId,
        timestamp: new Date().toISOString(),
      })}\n\n`;
      console.log('[ChatStream] Sending initial connection message');
      controller.enqueue(encoder.encode(initialData));

      // Listen for stream events from Claude process
      const eventHandler = ({ sessionId: eventSessionId, event }: any) => {
        console.log('[ChatStream] Received event for session:', eventSessionId, 'event:', event);
        if (eventSessionId === sessionId) {
          const data = `data: ${JSON.stringify(event)}\n\n`;
          try {
            controller.enqueue(encoder.encode(data));
            console.log('[ChatStream] Event sent to client');
          } catch (error) {
            console.error('[ChatStream] Error enqueueing:', error);
          }
        }
      };

      manager.on('stream-event', eventHandler);
      console.log('[ChatStream] Event listener attached');

      // Clean up on close
      request.signal.addEventListener('abort', () => {
        console.log('[ChatStream] Client disconnected, cleaning up');
        manager.off('stream-event', eventHandler);
        controller.close();
      });
    },
  });

  console.log('[ChatStream] Returning SSE response');
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
