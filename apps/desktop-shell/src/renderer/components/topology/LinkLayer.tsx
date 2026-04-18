import * as React from 'react';

export interface Link {
  from: string; // Node ID
  to: string;   // Node ID
  type?: 'ethernet' | 'vpn' | 'tunnel';
  status?: 'active' | 'idle' | 'congested';
}

export function LinkLayer({ links, nodePositions }: { 
  links: Link[], 
  nodePositions: Record<string, { x: number, y: number }> 
}) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" className="text-cyber-primary/20" />
        </marker>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {links.map((link, i) => {
        const start = nodePositions[link.from];
        const end = nodePositions[link.to];
        
        if (!start || !end) return null;

        return (
          <g key={i}>
            <line 
              x1={start.x} y1={start.y} 
              x2={end.x} y2={end.y} 
              stroke="currentColor" 
              strokeWidth="2" 
              className={`${link.status === 'active' ? 'text-cyber-primary animate-pulse' : 'text-gray-800'} opacity-20`}
              filter="url(#glow)"
            />
            {link.status === 'active' && (
              <circle r="2" fill="currentColor" className="text-cyber-primary">
                <animateMotion 
                  path={`M ${start.x} ${start.y} L ${end.x} ${end.y}`} 
                  dur="2s" 
                  repeatCount="indefinite" 
                />
              </circle>
            )}
          </g>
        );
      })}
    </svg>
  );
}
