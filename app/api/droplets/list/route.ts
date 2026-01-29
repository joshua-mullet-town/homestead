import { NextResponse } from 'next/server';
import { getSessions } from '@/lib/sessions';

const DO_API_TOKEN = process.env.DO_API_TOKEN;

async function getDropletsFromDO() {
  if (!DO_API_TOKEN) {
    throw new Error('DO_API_TOKEN not configured');
  }

  const response = await fetch('https://api.digitalocean.com/v2/droplets?tag_name=homestead', {
    headers: {
      Authorization: `Bearer ${DO_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch droplets from DigitalOcean');
  }

  const data = await response.json();
  return data.droplets || [];
}

export async function GET() {
  try {
    // Get session metadata from local storage
    const sessions = getSessions();

    // Optionally verify droplets still exist in DigitalOcean
    let activeDropletIds: number[] = [];
    try {
      const droplets = await getDropletsFromDO();
      activeDropletIds = droplets.map((d: any) => d.id);
    } catch (error) {
      console.warn('[List] Could not verify droplets from DO:', error);
      // Continue anyway with local sessions data
    }

    // Filter sessions to only include ones with active droplets
    // (or return all if DO verification failed)
    const activeSessions = activeDropletIds.length > 0
      ? sessions.filter(s => activeDropletIds.includes(s.dropletId))
      : sessions;

    return NextResponse.json({
      sessions: activeSessions,
      count: activeSessions.length,
    });
  } catch (error) {
    console.error('[List] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
