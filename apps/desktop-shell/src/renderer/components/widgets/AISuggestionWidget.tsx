import { Card, Badge } from '@rangeos/ui';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { AISuggestion } from '../../api/mockData';

export function AISuggestionWidget({ suggestions }: { suggestions: AISuggestion[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
        <Sparkles size={14} className="text-cyber-primary" /> Cognitive Insights
      </h2>

      <div className="space-y-3">
        {suggestions.map(s => (
          <Card key={s.id} className="group border-cyber-primary/20 hover:border-cyber-primary/50 transition-all cursor-pointer">
            <div className="flex gap-4">
              <div className="mt-1">
                {s.type === 'security' ? (
                  <ShieldCheck size={20} className="text-cyber-alert" />
                ) : (
                  <Zap size={20} className="text-cyber-primary" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-white uppercase">{s.title}</span>
                  <Badge variant="ghost" size="sm" className="opacity-50">GPT-4o Engaged</Badge>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed font-mono">
                  {s.description}
                </p>
                <div className="pt-2 flex items-center gap-1 text-[10px] font-bold text-cyber-primary uppercase tracking-widest hover:translate-x-1 transition-transform">
                  Deploy Resolution <ArrowRight size={10} />
                </div>
              </div>
            </div>
          </Card>
        ))}
        
        <div className="relative p-6 rounded-lg border border-dashed border-cyber-surface-elevated flex flex-col items-center text-center space-y-2 opacity-60">
           <div className="h-1 w-24 bg-gradient-to-r from-transparent via-cyber-primary to-transparent animate-pulse" />
           <p className="text-[10px] font-mono text-gray-500 italic">Processing real-time telemetry...</p>
        </div>
      </div>
    </div>
  );
}
