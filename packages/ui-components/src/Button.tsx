import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'alert' | 'ghost' | 'glass';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', ...props }, ref) => {
    
    let variantStyles = '';
    
    switch(variant) {
      case 'primary':
        variantStyles = 'bg-cyber-primary/20 text-cyber-primary border-cyber-primary hover:bg-cyber-primary/40 hover:shadow-glow-primary';
        break;
      case 'secondary':
        variantStyles = 'bg-cyber-secondary/20 text-cyber-secondary border-cyber-secondary hover:bg-cyber-secondary/40';
        break;
      case 'alert':
        variantStyles = 'bg-cyber-alert/20 text-cyber-alert border-cyber-alert hover:bg-cyber-alert/40 hover:shadow-glow-alert';
        break;
      case 'ghost':
        variantStyles = 'bg-transparent text-gray-300 border-transparent hover:bg-cyber-surface-elevated hover:text-white';
        break;
      case 'glass':
        variantStyles = 'glass-panel text-white hover:border-cyber-primary hover:shadow-glow-primary';
        break;
    }

    return (
      <button
        ref={ref}
        className={`px-4 py-2 border rounded-md transition-all duration-300 font-mono text-sm tracking-wider uppercase font-bold focus:outline-none focus:ring-2 focus:ring-cyber-primary/50 ${variantStyles} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
