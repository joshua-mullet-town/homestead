import { NextRequest, NextResponse } from 'next/server';
import { getClaudeManager } from '@/lib/claude-manager-singleton';

export async function POST(request: NextRequest) {
  console.log('[ChatStart] Received request');
  try {
    const body = await request.json();
    console.log('[ChatStart] Request body:', body);
    const { sessionId, workingDirectory, initialPrompt, model } = body;

    if (!sessionId || !workingDirectory) {
      console.error('[ChatStart] Missing required fields');
      return NextResponse.json(
        { error: 'sessionId and workingDirectory are required' },
        { status: 400 }
      );
    }

    console.log('[ChatStart] Getting manager...');
    const manager = getClaudeManager();
    console.log('[ChatStart] Manager obtained');

    // Check if session already exists
    if (manager.hasProcess(sessionId)) {
      console.log('[ChatStart] Session already exists');
      return NextResponse.json(
        { error: 'Session already exists' },
        { status: 409 }
      );
    }

    // Start Claude conversation
    console.log('[ChatStart] Starting conversation...', {
      sessionId,
      workingDirectory,
      initialPrompt: initialPrompt?.substring(0, 50) + '...',
      model: model || 'claude-sonnet-4.5',
    });

    await manager.startConversation(sessionId, {
      workingDirectory,
      initialPrompt,
      model: model || 'claude-sonnet-4.5',
      dangerouslySkipPermissions: true, // Auto-approve for demo
    });

    console.log('[ChatStart] Conversation started successfully');
    return NextResponse.json({
      success: true,
      sessionId,
      message: 'Claude session started',
    });
  } catch (error) {
    console.error('[ChatStart] Error:', error);
    if (error instanceof Error) {
      console.error('[ChatStart] Error stack:', error.stack);
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
