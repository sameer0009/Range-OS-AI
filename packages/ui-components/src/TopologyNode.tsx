import * as React from 'react';

export interface TopologyNodeProps {
  type?: 'server' | 'workstation' | 'router' | 'cloud' | 'shield';
  status?: 'active' | 'alert' | 'inactive' | 'loading';
  label: string;
  ip?: string;
  className?: string;
}

export const TopologyNode: React.FC<TopologyNodeProps> = ({ 
  type = 'server', 
  status = 'active', 
  label, 
  ip,
  className = '' 
}) => {
  
  let colorClass = 'text-cyber-primary';
  let glowClass = 'shadow-glow-primary';
  
  if (status === 'alert') {
    colorClass = 'text-cyber-alert';
    glowClass = 'shadow-glow-alert';
  } else if (status === 'inactive') {
    colorClass = 'text-gray-600';
    glowClass = '';
  }

  return (
    <div className={`flex flex-col items-center gap-2 group cursor-pointer ${className}`}>
      <div className={`
        relative w-12 h-12 flex items-center justify-center rounded-sm 
        bg-cyber-surface border-2 transition-all duration-300
        ${status === 'alert' ? 'border-cyber-alert animate-pulse' : 'border-cyber-surface-elevated group-hover:border-cyber-primary'}
      `}>
        {/* Node Icon Placeholder (Simulated via SVG paths) */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={colorClass}>
          {type === 'server' && <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />}
          {type === 'server' && <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />}
          {type === 'workstation' && <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />}
          {type === 'workstation' && <line x1="8" y1="21" x2="16" y2="21" />}
          {type === 'workstation' && <line x1="12" y1="17" x2="12" y2="21" />}
          {type === 'router' && <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />}
        </svg>

        {/* Status indicator pulse */}
        {status === 'active' && (
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyber-success rounded-full border-2 border-cyber-background shadow-glow-success" />
        )}
      </div>

      <div className="text-center">
        <div className={`text-[10px] font-mono font-bold uppercase tracking-widest leading-none ${status === 'alert' ? 'text-cyber-alert' : 'text-gray-300 group-hover:text-cyber-primary'}`}>
          {label}
        </div>
        {ip && <div className="text-[9px] font-mono text-gray-600">{ip}</div>}
      </div>
    </div>
  );
};
