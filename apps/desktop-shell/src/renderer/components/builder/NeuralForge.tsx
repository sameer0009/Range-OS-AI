import { useState } from 'react';
import { Sparkles, Terminal as TerminalIcon, Send } from 'lucide-react';
import { Button } from '@rangeos/ui';

export function NeuralForge({ onSynthesize }: { onSynthesize: (prompt: string) => void }) {
  const [prompt, setPrompt] = useState('');

  return (
    <div className="space-y-4">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyber-primary to-cyber-secondary rounded-lg blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
        <div className="relative bg-cyber-background border border-cyber-surface-elevated rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3 text-cyber-primary">
            <Sparkles size={16} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Neural Forge Engine v2.0</span>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your target network architecture... e.g. 'Build a Windows AD network with a DMZ and 2 workstations'"
            className="w-full h-32 bg-transparent border-none focus:ring-0 text-white font-mono text-sm resize-none placeholder:text-gray-700"
          />
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2 text-gray-600 text-[10px] font-mono">
              <TerminalIcon size={12} />
              <span>GPT-4O INFRASTRUCTURE CONNECTED</span>
            </div>
            <Button 
              variant="primary" 
              size="sm" 
              disabled={!prompt.trim()}
              onClick={() => onSynthesize(prompt)}
              className="px-6"
            >
              <Send size={14} className="mr-2" /> SYNTHESIZE
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-3 bg-cyber-primary/5 border border-dashed border-cyber-primary/20 rounded-lg text-[10px] font-mono text-gray-500 italic">
        Tip: You can specify difficulty levels and specific CVE types in your prompt for better synthesis accuracy.
      </div>
    </div>
  );
}
