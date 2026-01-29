import { NextRequest, NextResponse } from 'next/server';
import { getClaudeManager } from '@/lib/claude-manager-singleton';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, message } = await request.json();

    if (!sessionId || !message) {
      return NextResponse.json(
        { error: 'sessionId and message are required' },
        { status: 400 }
      );
    }

    const manager = getClaudeManager();

    if (!manager.hasProcess(sessionId)) {
      return NextResponse.json(
        { error: 'Session not found or not started' },
        { status: 404 }
      );
    }

    const success = manager.sendMessage(sessionId, message);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[ChatMessage] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
