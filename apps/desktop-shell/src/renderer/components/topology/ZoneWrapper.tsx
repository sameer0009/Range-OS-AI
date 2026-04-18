import * as React from 'react';

export interface ZoneProps {
  id: 'RED' | 'BLUE' | 'TARGET' | 'EVIDENCE';
  title: string;
  children: React.ReactNode;
  className?: string;
}

const ZONE_THEMES = {
  RED: 'border-cyber-alert/20 bg-cyber-alert/5',
  BLUE: 'border-cyber-primary/20 bg-cyber-primary/5',
  TARGET: 'border-cyber-secondary/20 bg-cyber-secondary/5',
  EVIDENCE: 'border-cyber-forensic/20 bg-cyber-forensic/5',
};

const TEXT_THEMES = {
  RED: 'text-cyber-alert',
  BLUE: 'text-cyber-primary',
  TARGET: 'text-cyber-secondary',
  EVIDENCE: 'text-cyber-forensic',
};

export function ZoneWrapper({ id, title, children, className = '' }: ZoneProps) {
  return (
    <div className={`relative border rounded-lg p-6 min-h-[300px] overflow-hidden ${ZONE_THEMES[id]} ${className}`}>
      {/* Zone Label Vertical */}
      <div className="absolute top-0 right-1 h-full flex items-center pointer-events-none opacity-20 select-none">
        <span className={`rotate-90 origin-center text-4xl font-mono font-black uppercase tracking-[0.5em] whitespace-nowrap ${TEXT_THEMES[id]}`}>
          {title}
        </span>
      </div>

      {/* Decorative corner */}
      <div className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 opacity-30 ${TEXT_THEMES[id]}`} />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
