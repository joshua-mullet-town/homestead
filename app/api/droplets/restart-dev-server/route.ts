import { NextRequest, NextResponse } from 'next/server';

interface RestartDevServerRequest {
  sessionId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RestartDevServerRequest = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      );
    }

    // This endpoint returns success immediately
    // The actual restart command will be sent via Socket.IO from the frontend
    // Command: export HOME=/root && pm2 restart dev-server

    return NextResponse.json({
      success: true,
      sessionId,
      command: 'export HOME=/root && pm2 restart dev-server\n',
    });

  } catch (error) {
    console.error('Error restarting dev server:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
