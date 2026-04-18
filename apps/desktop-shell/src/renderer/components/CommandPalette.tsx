import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, Terminal, Shield, Zap } from 'lucide-react';
import { useUIStore } from '../store/UIStore';

const COMMANDS = [
  { id: 'dashboard', label: 'Go to Dashboard', icon: <Zap size={18}/>, route: '/shell/dashboard' },
  { id: 'lab', label: 'Forge New Lab', icon: <Terminal size={18}/>, route: '/shell/lab-builder' },
  { id: 'forensics', label: 'Evidence Vault', icon: <Shield size={18}/>, route: '/shell/forensics' },
];

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, toggleCommandPalette, addTab } = useUIStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleCommandPalette();
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [toggleCommandPalette]);

  if (!isCommandPaletteOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => toggleCommandPalette(false)}
        />
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-xl tactical-glass overflow-hidden z-10 border-blue-500/30"
        >
          <div className="p-4 border-b border-white/10 flex items-center gap-3">
            <Search className="text-blue-400" size={20} />
            <input 
              autoFocus
              className="bg-transparent border-none outline-none text-white w-full font-mono placeholder:text-white/20"
              placeholder="SEARCH_MISSION_ASSETS..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-white/40 font-mono">
              ESC
            </div>
          </div>

          <div className="max-h-[300px] overflow-y-auto p-2">
            {COMMANDS.map((cmd) => (
              <button
                key={cmd.id}
                className="w-full p-3 flex items-center gap-3 rounded-lg hover:bg-blue-500/10 hover:text-blue-400 group transition-all text-left"
                onClick={() => {
                  addTab(cmd.route);
                  toggleCommandPalette(false);
                }}
              >
                <div className="text-white/40 group-hover:text-blue-400">
                  {cmd.icon}
                </div>
                <span className="font-mono text-sm uppercase tracking-wider">{cmd.label}</span>
              </button>
            ))}
          </div>

          <div className="p-3 bg-black/20 border-t border-white/5 flex justify-between items-center px-4">
             <div className="flex items-center gap-2">
                <Command size={12} className="text-white/40"/>
                <span className="text-[10px] text-white/40 font-mono">MOD+K TO TOGGLE</span>
             </div>
             <div className="text-[8px] text-blue-500/50 font-mono uppercase tracking-widest animate-pulse">
                Intelligence Link: ACTIVE
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
