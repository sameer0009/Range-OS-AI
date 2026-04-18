import * as React from 'react';

export type BadgeVariant = 
  | 'default' | 'primary' | 'secondary' | 'success' | 'alert' | 'warning' | 'forensic'
  | 'ht' | 'mt' | 'lt' | 'qt' // Trust Zones
  | 'ev-proposed' | 'ev-acquired' | 'ev-hashed' | 'ev-analyzing' | 'ev-reported'; // Evidence States

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  glow?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant = 'default', glow = false, ...props }, ref) => {
    
    let variantStyles = 'bg-cyber-surface-elevated text-gray-400 border-gray-600';
    
    switch(variant) {
      case 'primary':
        variantStyles = 'bg-cyber-primary/10 text-cyber-primary border-cyber-primary/40';
        if (glow) variantStyles += ' shadow-glow-primary';
        break;
      case 'success':
        variantStyles = 'bg-cyber-success/10 text-cyber-success border-cyber-success/40';
        if (glow) variantStyles += ' shadow-glow-success';
        break;
      case 'alert': case 'qt':
        variantStyles = 'bg-cyber-alert/10 text-cyber-alert border-cyber-alert/40';
        if (glow) variantStyles += ' shadow-glow-alert';
        break;
      case 'warning':
        variantStyles = 'bg-cyber-warning/10 text-cyber-warning border-cyber-warning/40';
        break;
      case 'forensic': case 'lt':
        variantStyles = 'bg-cyber-forensic/10 text-cyber-forensic border-cyber-forensic/40';
        if (glow) variantStyles += ' shadow-glow-forensic';
        break;
      case 'blue-team': case 'secondary':
        variantStyles = 'bg-cyber-blue-team/10 text-cyber-blue-team border-cyber-blue-team/40';
        break;
      case 'ht':
        variantStyles = 'bg-white/5 text-white border-white/40 shadow-[0_0_5px_rgba(255,255,255,0.2)]';
        break;
      case 'mt':
        variantStyles = 'bg-cyber-zone-mt/10 text-cyber-zone-mt border-cyber-zone-mt/40';
        break;
      
      // Evidence States
      case 'ev-proposed': variantStyles = 'bg-cyber-ev-proposed/10 text-cyber-ev-proposed border-cyber-ev-proposed/40'; break;
      case 'ev-acquired': variantStyles = 'bg-cyber-ev-acquired/10 text-cyber-ev-acquired border-cyber-ev-acquired/40'; break;
      case 'ev-hashed': variantStyles = 'bg-cyber-ev-hashed/10 text-cyber-ev-hashed border-cyber-ev-hashed/40'; break;
      case 'ev-analyzing': variantStyles = 'bg-cyber-ev-analyzing/10 text-cyber-ev-analyzing border-cyber-ev-analyzing/40'; break;
      case 'ev-reported': variantStyles = 'bg-cyber-ev-reported/10 text-cyber-ev-reported border-cyber-ev-reported/40'; break;
    }

    return (
      <span
        ref={ref}
        className={`inline-flex items-center px-2 py-0.5 rounded-sm border text-[10px] font-mono font-bold tracking-wider uppercase ${variantStyles} ${className}`}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";
