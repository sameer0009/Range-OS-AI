import { Badge } from '@rangeos/ui';
import { Shield, Zap, Activity, Cpu } from 'lucide-react';

export function StatusHeader() {
  return (
    <div className="w-full flex items-center justify-between border-b border-cyber-surface-elevated pb-6 mb-6">
      <div className="flex items-center gap-6">
        <div>
          <div className="flex items-center gap-2 text-cyber-primary font-mono text-xs uppercase tracking-[0.3em] mb-1">
            <Zap size={14} className="animate-pulse" /> Platform Operations
          </div>
          <h1 className="text-3xl font-mono font-bold text-white tracking-tight uppercase flex items-center gap-4">
            Command Center
            <span className="h-6 w-[2px] bg-cyber-surface-elevated rotate-12" />
            <span className="text-lg text-gray-500 font-normal">NOD-0192</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2">
                <Cpu size={14} className="text-gray-600" />
                <span className="text-[10px] font-mono text-gray-400">AI CORE</span>
                <Badge variant="success" size="sm" glow>STABLE</Badge>
             </div>
             <div className="flex items-center gap-2">
                <Activity size={14} className="text-gray-600" />
                <span className="text-[10px] font-mono text-gray-400">IO BUS</span>
                <Badge variant="success" size="sm">94.2%</Badge>
             </div>
          </div>
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-cyber-success animate-ping" />
             <span className="text-[9px] font-mono text-cyber-success/70 uppercase tracking-widest font-bold">Encrypted Telemetry Active</span>
          </div>
        </div>
        
        <div className="h-10 w-[1px] bg-cyber-surface-elevated mx-2" />
        
        <div className="flex items-center gap-3 bg-cyber-primary/10 border border-cyber-primary/20 rounded-full px-4 py-1.5">
           <Shield size={16} className="text-cyber-primary" />
           <div className="flex flex-col leading-none">
              <span className="text-[10px] font-mono text-gray-400 uppercase">Operator</span>
              <span className="text-[11px] font-mono font-bold text-white">ADMIN_01</span>
           </div>
        </div>
      </div>
    </div>
  );
}
