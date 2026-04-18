import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal } from 'lucide-react';

export default function SplashScreen() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fake boot sequence
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate('/login'), 500); // Route to login when complete
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="flex flex-col h-screen w-screen bg-cyber-background items-center justify-center p-8 select-none" style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}>
      <div className="max-w-md w-full space-y-8 flex flex-col items-center">
        
        {/* Animated Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-cyber-primary blur-xl opacity-20 rounded-full animate-pulse"></div>
          <Terminal size={80} className="text-cyber-primary relative z-10" />
        </div>

        {/* Brand */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-mono font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyber-primary to-cyber-secondary">
            RANGE_OS
          </h1>
          <p className="text-gray-400 font-mono text-sm tracking-widest animate-pulse">
            INITIALIZING SUBSYSTEMS...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full mt-10">
          <div className="flex justify-between font-mono text-xs text-cyber-primary mb-2">
            <span>BOOT SEQ</span>
            <span>{Math.min(progress, 100)}%</span>
          </div>
          <div className="h-1 w-full bg-cyber-surface-elevated rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyber-primary transition-all duration-150 ease-out shadow-glow-primary"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Fake Boot Logs */}
        <div className="w-full h-24 overflow-hidden mt-6 opacity-50 relative mask-image-b">
          <div className="font-mono text-xs text-cyber-primary/70 leading-relaxed break-all">
            {`[OK] Kernel loaded
[OK] Mounting virtual volumes
[OK] Starting identity boundary...
[OK] Loading policy definitions...
[${progress > 30 ? 'OK' : '...'}] Initializing evidence vault
[${progress > 60 ? 'OK' : '...'}] Connecting telemetry bus
[${progress > 80 ? 'OK' : '...'}] Starting UI bridge...`}
          </div>
        </div>

      </div>
    </div>
  );
}
