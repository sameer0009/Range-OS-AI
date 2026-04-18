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
        
        {/* High-Quality Brand Identity Assets */}
        <div className="relative flex flex-col items-center gap-6">
          <div className="absolute -inset-10 bg-cyber-primary blur-[100px] opacity-10 animate-pulse"></div>
          
          <img 
            src="../renderer/assets/splash-loading.png" 
            alt="RangeOS Logo" 
            className="w-48 h-auto relative z-10 animate-in zoom-in duration-1000"
          />
          
          <img 
            src="../renderer/assets/logo-text.png" 
            alt="RANGE OS AI" 
            className="w-80 h-auto relative z-10"
          />
          
          <p className="text-cyber-primary font-mono text-[10px] tracking-[0.5em] uppercase opacity-60 animate-pulse">
            Secure · Intelligent · Controlled
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
