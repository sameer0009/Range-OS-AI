import React from 'react';

interface StatusChipProps {
  label: string;
  status?: 'active' | 'warning' | 'error' | 'neutral';
  className?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({ 
  label, 
  status = 'neutral',
  className = ''
}) => {
  const getColors = () => {
    switch (status) {
      case 'active': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'warning': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'error': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className={`px-2 py-0.5 rounded border text-[9px] font-tactical inline-flex items-center gap-1.5 ${getColors()} ${className}`}>
      <div className={`w-1 h-1 rounded-full ${status === 'active' ? 'animate-pulse' : ''}`} style={{ backgroundColor: 'currentColor' }} />
      {label}
    </div>
  );
};
