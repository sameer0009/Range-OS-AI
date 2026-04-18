import * as React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  icon?: React.ReactNode;
  headerAction?: React.ReactNode;
  accent?: 'primary' | 'alert' | 'forensic' | 'none';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', title, icon, headerAction, accent = 'none', children, ...props }, ref) => {
    
    let accentStyles = 'border-cyber-surface-elevated';
    if (accent === 'primary') accentStyles = 'border-t-cyber-primary border-l-cyber-primary/30';
    if (accent === 'alert') accentStyles = 'border-t-cyber-alert border-l-cyber-alert/30';
    if (accent === 'forensic') accentStyles = 'border-t-cyber-forensic border-l-cyber-forensic/30';

    return (
      <div
        ref={ref}
        className={`glass-panel rounded-sm flex flex-col relative overflow-hidden group border-t-2 ${accentStyles} ${className}`}
        {...props}
      >
        {/* Background Decorative Accent */}
        <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
          {icon}
        </div>

        {(title || icon || headerAction) && (
          <div className="px-4 py-3 border-b border-cyber-surface-elevated flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon && <span className="text-gray-400 group-hover:text-cyber-primary transition-colors">{icon}</span>}
              {title && <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-200">{title}</h3>}
            </div>
            {headerAction && <div>{headerAction}</div>}
          </div>
        )}
        
        <div className="flex-1 p-4">
          {children}
        </div>

        {/* Cyber Corner Accent */}
        <div className="absolute bottom-0 right-0 w-4 h-4 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 right-0 w-[150%] h-[150%] bg-cyber-surface-elevated rotate-45 translate-x-1/2 translate-y-1/2"></div>
        </div>
      </div>
    );
  }
);

Card.displayName = "Card";
