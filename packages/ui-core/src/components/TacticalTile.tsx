import React from 'react';

interface TacticalTileProps {
  title: string;
  children: React.ReactNode;
  accentColor?: string;
  className?: string;
}

export const TacticalTile: React.FC<TacticalTileProps> = ({ 
  title, 
  children, 
  accentColor = 'var(--rangeos-primary)',
  className = ''
}) => {
  return (
    <div className={`tactical-glass p-0 overflow-hidden flex flex-col ${className}`}>
      <div 
        className="h-1 w-full" 
        style={{ backgroundColor: accentColor }} 
      />
      <div className="px-4 py-2 border-b border-white/5 flex justify-between items-center bg-white/5">
        <span className="font-tactical text-[10px] text-white/60">{title}</span>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
        </div>
      </div>
      <div className="p-4 flex-1">
        {children}
      </div>
    </div>
  );
};
