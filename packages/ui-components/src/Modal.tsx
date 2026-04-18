import * as React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'default' | 'alert' | 'forensic';
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  variant = 'default' 
}) => {
  if (!isOpen) return null;

  let headerBorder = 'border-cyber-surface-elevated';
  if (variant === 'alert') headerBorder = 'border-cyber-alert/50';
  if (variant === 'forensic') headerBorder = 'border-cyber-forensic/50';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-cyber-background/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className={`
        relative w-full max-w-2xl glass-panel rounded-sm shadow-2xl overflow-hidden
        border-t-2 ${variant === 'alert' ? 'border-cyber-alert' : variant === 'forensic' ? 'border-cyber-forensic' : 'border-cyber-primary'}
      `}>
        {/* Header */}
        <div className={`px-6 py-4 flex items-center justify-between border-b ${headerBorder} bg-cyber-surface/50`}>
          <h2 className={`font-mono text-sm font-bold uppercase tracking-widest ${variant === 'alert' ? 'text-cyber-alert' : variant === 'forensic' ? 'text-cyber-forensic' : 'text-cyber-primary'}`}>
            {title}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto font-sans text-gray-300">
          {children}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-cyber-surface/30 border-t border-cyber-surface-elevated flex justify-end gap-3">
          {footer ? footer : (
            <>
              <Button variant="ghost" onClick={onClose}>Close</Button>
              <Button variant={variant === 'alert' ? 'alert' : 'primary'} onClick={onClose}>Confirm</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
