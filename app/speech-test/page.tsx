'use client';

import { useState, useEffect } from 'react';

export default function SpeechTest() {
  const [log, setLog] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  const addLog = (msg: string) => {
    console.log(msg);
    setLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  useEffect(() => {
    // Check for Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      addLog('✅ Web Speech API available');
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        addLog('🎤 Speech recognition started');
        setIsRecording(true);
      };

      recognitionInstance.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        addLog(`📝 Transcript: "${text}"`);
        setTranscript(text);
      };

      recognitionInstance.onerror = (event: any) => {
        addLog(`❌ Error: ${event.error}`);
        setIsRecording(false);
      };

      recognitionInstance.onend = () => {
        addLog('🛑 Speech recognition ended');
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    } else {
      addLog('❌ Web Speech API not available');
    }
  }, []);

  const startRecording = () => {
    if (recognition) {
      setLog([]);
      setTranscript('');
      addLog('🎤 Starting Web Speech API recording...');
      try {
        recognition.start();
      } catch (err: any) {
        addLog(`❌ Error starting: ${err.message}`);
      }
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-4 text-[#FF6600]">Web Speech API Test</h1>
      <p className="text-gray-400 mb-8">This uses the built-in browser speech recognition (no getUserMedia)</p>

      <div className="space-y-4 mb-8">
        <button
          onClick={startRecording}
          disabled={!recognition || isRecording}
          className="px-6 py-3 bg-[#FF3333] text-white font-bold rounded-lg hover:bg-[#FF6600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRecording ? 'RECORDING...' : 'START RECORDING'}
        </button>

        {isRecording && (
          <button
            onClick={stopRecording}
            className="ml-4 px-6 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-colors"
          >
            STOP
          </button>
        )}
      </div>

      {transcript && (
        <div className="bg-gray-900 border border-[#00FF66] rounded-lg p-4 mb-8">
          <div className="text-[#00FF66] font-bold mb-2">Transcript:</div>
          <div className="text-white text-lg">{transcript}</div>
        </div>
      )}

      <div className="bg-gray-900 border border-[#FF6600] rounded-lg p-4 font-mono text-sm">
        <div className="text-[#FFCC00] font-bold mb-2">Console Log:</div>
        {log.length === 0 ? (
          <div className="text-gray-500">Waiting...</div>
        ) : (
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {log.map((line, i) => (
              <div key={i} className="text-green-400">{line}</div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 text-sm text-gray-400">
        <p>Web Speech API doesn't require getUserMedia, so it might work where MediaRecorder fails.</p>
        <p>Access via: <span className="text-[#FFCC00]">https://graduate-minimum-qui-simple.trycloudflare.com/speech-test</span></p>
      </div>
    </div>
  );
}
