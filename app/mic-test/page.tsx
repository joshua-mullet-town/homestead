'use client';

import { useState } from 'react';

export default function MicTest() {
  const [log, setLog] = useState<string[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const addLog = (msg: string) => {
    console.log(msg);
    setLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  const testMicrophone = async () => {
    setLog([]);
    addLog('🔍 Starting microphone test...');

    try {
      // Basic checks
      addLog(`Protocol: ${window.location.protocol}`);
      addLog(`Host: ${window.location.host}`);
      addLog(`isSecureContext: ${window.isSecureContext}`);
      addLog(`navigator.mediaDevices exists: ${!!navigator.mediaDevices}`);

      if (!window.isSecureContext) {
        addLog('❌ ERROR: Not a secure context! Need HTTPS');
        return;
      }

      if (!navigator.mediaDevices) {
        addLog('❌ ERROR: navigator.mediaDevices not available');
        return;
      }

      // Try to enumerate devices BEFORE permission
      addLog('📋 Enumerating devices (before permission)...');
      const devicesBefore = await navigator.mediaDevices.enumerateDevices();
      addLog(`Found ${devicesBefore.length} total devices`);
      const audioInputsBefore = devicesBefore.filter(d => d.kind === 'audioinput');
      addLog(`Found ${audioInputsBefore.length} audioinput devices`);
      audioInputsBefore.forEach((d, i) => {
        addLog(`  Device ${i}: ${d.label || 'unlabeled'} (${d.deviceId.substring(0, 20)}...)`);
      });

      // Request microphone access
      addLog('🎤 Calling getUserMedia({ audio: true })...');
      addLog('⏳ Waiting for permission prompt...');

      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      addLog('✅ SUCCESS! Got media stream');
      addLog(`Stream ID: ${mediaStream.id}`);
      addLog(`Active: ${mediaStream.active}`);

      const audioTracks = mediaStream.getAudioTracks();
      addLog(`Audio tracks: ${audioTracks.length}`);
      audioTracks.forEach((track, i) => {
        addLog(`  Track ${i}: ${track.label}`);
        addLog(`    Enabled: ${track.enabled}, Muted: ${track.muted}, ReadyState: ${track.readyState}`);
      });

      setStream(mediaStream);

      // Enumerate devices AFTER permission
      addLog('📋 Enumerating devices (after permission)...');
      const devicesAfter = await navigator.mediaDevices.enumerateDevices();
      const audioInputsAfter = devicesAfter.filter(d => d.kind === 'audioinput');
      addLog(`Found ${audioInputsAfter.length} audioinput devices`);
      audioInputsAfter.forEach((d, i) => {
        addLog(`  Device ${i}: ${d.label} (${d.deviceId.substring(0, 20)}...)`);
      });

    } catch (err: any) {
      addLog(`❌ ERROR: ${err.name}: ${err.message}`);
      addLog(`Error details: ${JSON.stringify(err, null, 2)}`);

      if (err.name === 'NotAllowedError') {
        addLog('💡 User denied permission or browser blocked it');
      } else if (err.name === 'NotFoundError') {
        addLog('💡 No microphone device found');
      } else if (err.name === 'NotReadableError') {
        addLog('💡 Device is already in use or hardware error');
      }
    }
  };

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => {
        addLog(`Stopping track: ${track.label}`);
        track.stop();
      });
      setStream(null);
      addLog('✅ Stream stopped');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-4 text-[#FF6600]">Microphone Test</h1>

      <div className="space-y-4 mb-8">
        <button
          onClick={testMicrophone}
          className="px-6 py-3 bg-[#FF3333] text-white font-bold rounded-lg hover:bg-[#FF6600] transition-colors"
        >
          TEST MICROPHONE
        </button>

        {stream && (
          <button
            onClick={stopStream}
            className="ml-4 px-6 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-colors"
          >
            STOP STREAM
          </button>
        )}
      </div>

      <div className="bg-gray-900 border border-[#FF6600] rounded-lg p-4 font-mono text-sm">
        <div className="text-[#FFCC00] font-bold mb-2">Console Log:</div>
        {log.length === 0 ? (
          <div className="text-gray-500">Click TEST MICROPHONE to start</div>
        ) : (
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {log.map((line, i) => (
              <div key={i} className="text-green-400">{line}</div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 text-sm text-gray-400">
        <p>This test page will help debug microphone access issues.</p>
        <p>Access via: <span className="text-[#FFCC00]">https://graduate-minimum-qui-simple.trycloudflare.com/mic-test</span></p>
      </div>
    </div>
  );
}
