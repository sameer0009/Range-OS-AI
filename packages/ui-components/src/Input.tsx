import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-xs font-mono uppercase tracking-widest text-gray-500 ml-1">
            {label}
          </label>
        )}
        <div className="relative group">
          <input
            ref={ref}
            className={`
              w-full bg-cyber-background/50 border border-cyber-surface-elevated 
              rounded px-3 py-2 text-sm font-mono text-gray-200 placeholder:text-gray-600
              focus:outline-none focus:border-cyber-primary focus:shadow-glow-primary
              transition-all duration-300
              ${error ? 'border-cyber-alert focus:border-cyber-alert focus:shadow-glow-alert' : ''}
              ${className}
            `}
            {...props}
          />
          <div className="absolute inset-0 rounded pointer-events-none border border-transparent group-hover:border-cyber-primary/20 transition-colors" />
        </div>
        {error && (
          <p className="text-[10px] font-mono text-cyber-alert uppercase ml-1 animate-pulse">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
