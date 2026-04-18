import { useState, useEffect } from 'react';
import { Network, Activity, Cpu, Database, Bell } from 'lucide-react';

export default function TopStatusBar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMinimize = () => {
    // @ts-ignore
    window.electronAPI?.minimize();
  };

  const handleMaximize = () => {
    // @ts-ignore
    window.electronAPI?.maximize();
  };

  const handleClose = () => {
    // @ts-ignore
    window.electronAPI?.close();
  };

  return (
    <div 
      className="h-10 w-full bg-cyber-surface border-b border-cyber-surface-elevated flex items-center justify-between px-3 select-none"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties} // Allows dragging the frameless window
    >
      {/* Left side: System Status / Logo */}
      <div className="flex items-center space-x-4">
        <span className="font-mono font-bold text-cyber-primary tracking-widest text-sm flex items-center gap-2">
          <Activity size={16} className="text-cyber-primary animate-pulse" />
          RANGE_OS
        </span>
        <div className="hidden md:flex items-center space-x-3 text-xs font-mono text-gray-400">
          <span className="flex items-center gap-1"><Cpu size={14} className="text-cyber-alert"/> CPU: 14%</span>
          <span className="flex items-center gap-1"><Database size={14} className="text-cyber-secondary"/> RAM: 3.2GB</span>
          <span className="flex items-center gap-1"><Network size={14} className="text-cyber-success"/> NET: SECURE</span>
        </div>
      </div>

      {/* Right side: Controls and Time */}
      <div className="flex items-center space-x-4" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <span className="font-mono text-xs text-gray-400">
          {time.toLocaleTimeString([], { hour12: false })}
        </span>
        
        <button className="text-gray-400 hover:text-white transition-colors relative">
          <Bell size={16} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyber-alert rounded-full animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyber-alert rounded-full"></span>
        </button>

        {/* Window controls */}
        <div className="flex items-center space-x-2 ml-4">
          <button onClick={handleMinimize} className="w-3 h-3 rounded-full bg-gray-600 hover:bg-gray-400 focus:outline-none transition-colors"></button>
          <button onClick={handleMaximize} className="w-3 h-3 rounded-full bg-gray-600 hover:bg-cyber-success focus:outline-none transition-colors"></button>
          <button onClick={handleClose} className="w-3 h-3 rounded-full bg-cyber-alert/50 hover:bg-cyber-alert focus:outline-none shadow-glow-alert transition-all"></button>
        </div>
      </div>
    </div>
  );
}
