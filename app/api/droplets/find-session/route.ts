import { NextRequest, NextResponse } from 'next/server';
import { findSessionByIssue } from '@/lib/sessions';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const repoName = searchParams.get('repoName');
    const issueNumber = searchParams.get('issueNumber');

    if (!repoName || !issueNumber) {
      return NextResponse.json(
        { error: 'repoName and issueNumber are required' },
        { status: 400 }
      );
    }

    const session = findSessionByIssue(repoName, parseInt(issueNumber, 10));

    if (session) {
      return NextResponse.json({
        found: true,
        session,
      });
    } else {
      return NextResponse.json({
        found: false,
        session: null,
      });
    }
  } catch (error) {
    console.error('[FindSession] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
