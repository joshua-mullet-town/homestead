'use client';

import { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, Circle, XCircle } from 'lucide-react';

interface ProvisioningStep {
  step: string;
  status: 'pending' | 'in_progress' | 'complete' | 'error';
  message?: string;
}

interface ProvisioningStatusData {
  dropletStatus: string;
  port3005Ready: boolean;
  port7087Ready: boolean;
  cloudInitComplete: boolean;
  ready: boolean;
  message: string;
  steps: ProvisioningStep[];
  logLines?: string[];
}

interface ProvisioningStatusProps {
  sessionId: string;
  onReady: () => void;
}

export default function ProvisioningStatus({ sessionId, onReady }: ProvisioningStatusProps) {
  const [status, setStatus] = useState<ProvisioningStatusData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;
    let timeInterval: NodeJS.Timeout;

    // Poll status every 3 seconds
    const pollStatus = async () => {
      try {
        const response = await fetch('/api/droplets/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch status');
        }

        const data: ProvisioningStatusData = await response.json();
        setStatus(data);

        // If ready, call onReady callback
        if (data.ready) {
          clearInterval(pollInterval);
          clearInterval(timeInterval);
          setTimeout(() => onReady(), 1000); // Small delay to show "complete" state
        }
      } catch (err) {
        console.error('Error polling status:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    // Start polling immediately and then every 3 seconds
    pollStatus();
    pollInterval = setInterval(pollStatus, 3000);

    // Update elapsed time every second
    timeInterval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(pollInterval);
      clearInterval(timeInterval);
    };
  }, [sessionId, onReady]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStepIcon = (stepStatus: string) => {
    switch (stepStatus) {
      case 'complete':
        return <CheckCircle2 className="text-[#00FF66]" size={24} />;
      case 'in_progress':
        return <Loader2 className="text-[#FFCC00] animate-spin" size={24} />;
      case 'error':
        return <XCircle className="text-[#FF3333]" size={24} />;
      default:
        return <Circle className="text-gray-600" size={24} />;
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-[#FF6600] flex items-center justify-center p-4">
        <div className="bg-black border-4 border-white p-8 max-w-lg">
          <h1 style={{ fontFamily: 'VT323, monospace' }} className="text-4xl text-white mb-4">
            ERROR
          </h1>
          <p className="text-white text-xl mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white text-black font-bold text-xl"
          >
            RETRY
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#FF6600] flex items-center justify-center p-4">
      <div className="bg-black border-4 border-white p-8 max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 style={{ fontFamily: 'VT323, monospace' }} className="text-5xl text-white mb-2">
            PROVISIONING DROPLET
          </h1>
          <p className="text-[#FFCC00] text-xl mb-2">Session: {sessionId}</p>
          <p className="text-white text-lg">
            Elapsed Time: <span className="text-[#00FF66] font-mono">{formatTime(elapsedTime)}</span>
          </p>
        </div>

        {/* Main Status Message */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Loader2 className="text-[#FFCC00] animate-spin" size={32} />
            <p style={{ fontFamily: 'VT323, monospace' }} className="text-3xl text-white">
              {status?.message || 'Initializing...'}
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="space-y-4">
          {status?.steps.map((step, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 bg-gray-900 border-2 border-gray-700 rounded"
            >
              <div className="flex-shrink-0 mt-1">
                {getStepIcon(step.status)}
              </div>
              <div className="flex-1">
                <h3 className="text-white text-xl font-bold mb-1">{step.step}</h3>
                <p className="text-gray-400">{step.message}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Live Provision Log */}
        {status?.logLines && status.logLines.length > 0 && status.logLines[0] !== 'Log not available yet' && (
          <div className="mt-6">
            <h3 className="text-white text-xl font-bold mb-3 flex items-center gap-2">
              <span>📋</span> Live Provision Log
            </h3>
            <div className="bg-black border-2 border-[#00FF66] p-4 rounded font-mono text-xs max-h-64 overflow-y-auto">
              {status.logLines.map((line, i) => (
                <div key={i} className="text-[#00FF66] mb-1 whitespace-pre-wrap break-all">
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estimated Time */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Typical provisioning time: 2-3 minutes
          </p>
          {elapsedTime > 180 && (
            <p className="text-[#FF3333] text-sm mt-2">
              ⚠️ Taking longer than expected. Cloud-init may have encountered issues.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
