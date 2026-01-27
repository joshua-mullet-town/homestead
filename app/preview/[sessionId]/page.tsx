'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function PreviewPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  // For development, preview will be on localhost:3001
  // For production/droplet, this would be dynamic based on session
  const previewUrl = 'http://localhost:3001';

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-gray-900 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span style={{ fontFamily: 'VT323, monospace' }} className="text-xl text-white">
            PREVIEW: {sessionId}
          </span>
        </div>
        <Link
          href={`/terminal/${sessionId}`}
          className="px-4 py-2 bg-[#FF6600] text-white font-bold rounded hover:bg-[#FF3333] transition-colors"
        >
          TERMINAL
        </Link>
      </div>

      {/* Preview iframe */}
      <div className="flex-1 relative">
        <iframe
          src={previewUrl}
          className="absolute inset-0 w-full h-full border-0"
          title="App Preview"
        />
      </div>
    </div>
  );
}
