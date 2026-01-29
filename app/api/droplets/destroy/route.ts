import { NextRequest, NextResponse } from 'next/server';
import { getSession, removeSession } from '@/lib/sessions';

const DO_API_TOKEN = process.env.DO_API_TOKEN;

async function destroyDropletInDO(dropletId: number) {
  if (!DO_API_TOKEN) {
    throw new Error('DO_API_TOKEN not configured');
  }

  const response = await fetch(`https://api.digitalocean.com/v2/droplets/${dropletId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${DO_API_TOKEN}`,
    },
  });

  if (!response.ok && response.status !== 404) {
    const error = await response.text();
    throw new Error(`Failed to destroy droplet: ${error}`);
  }

  return true;
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      );
    }

    // Get session metadata
    const session = getSession(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Destroy droplet in DigitalOcean
    console.log(`[Destroy] Destroying droplet ${session.dropletId} for session ${sessionId}`);
    await destroyDropletInDO(session.dropletId);

    // Remove session metadata
    removeSession(sessionId);

    console.log(`[Destroy] Successfully destroyed session ${sessionId}`);

    return NextResponse.json({
      success: true,
      sessionId,
      message: 'Session destroyed successfully',
    });
  } catch (error) {
    console.error('[Destroy] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
