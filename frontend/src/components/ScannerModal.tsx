'use client';

import { useEffect, useRef, useState } from 'react';

interface ScannerModalProps {
  onClose: () => void;
  onScanComplete: (result: any) => void;
}

export default function ScannerModal({ onClose, onScanComplete }: ScannerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Start camera
    async function startCamera() {
      try {
        const mediastream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        setStream(mediastream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediastream;
        }
      } catch (err) {
        setError('Camera access denied or unavailable.');
        console.error(err);
      }
    }
    startCamera();

    return () => {
      // Cleanup camera on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const captureAndAnalyze = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    // Draw current video frame to canvas
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    // const imageBase64 = canvas.toDataURL('image/jpeg');

    setIsAnalyzing(true);
    
    // Simulate PyTorch AI delay over network
    setTimeout(() => {
      setIsAnalyzing(false);
      // In a real app we'd POST imageBase64 to /api/scan
      // Mocking the PyTorch result:
      const devices = ["MacBook Pro 2019", "iPhone 13", "Dell XPS", "ThinkPad T480"];
      const randDevice = devices[Math.floor(Math.random() * devices.length)];
      
      const mockResult = {
        device_model: randDevice,
        materials: {
          "Gold (g)": (Math.random() * 0.05).toFixed(3),
          "Copper (g)": (Math.random() * 15 + 5).toFixed(2),
          "Lithium (g)": (Math.random() * 3 + 1).toFixed(2)
        },
        eco_reward: (Math.random() * 10 + 2).toFixed(2)
      };
      
      onScanComplete(mockResult);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative">
        <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Real-Time E-Waste Scanner</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
             </svg>
          </button>
        </div>

        <div className="relative bg-black aspect-video flex items-center justify-center z-0">
          {error ? (
            <p className="text-red-400">{error}</p>
          ) : (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className={`w-full h-full object-cover ${isAnalyzing ? 'opacity-50 grayscale' : ''}`}
            />
          )}

          {/* Scanning Overlay Animation */}
          {isAnalyzing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <div className="w-full h-1 bg-emerald-500 animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_15px_#10b981] absolute top-0"></div>
              <div className="p-4 bg-black/60 rounded-xl backdrop-blur-md border border-emerald-500/50">
                <p className="text-emerald-400 font-mono font-bold animate-pulse text-lg">
                  Analyzing via PyTorch AI...
                </p>
              </div>
            </div>
          )}
          
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="p-6 bg-neutral-900 flex justify-end gap-3 border-t border-neutral-800">
          <button 
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-semibold text-neutral-300 hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={captureAndAnalyze}
            disabled={isAnalyzing || !!error}
            className="px-6 py-3 rounded-xl font-semibold text-black bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Capture & Analyze
          </button>
        </div>
      </div>
      
      {/* Required scan animation for Tailwind */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}} />
    </div>
  );
}
