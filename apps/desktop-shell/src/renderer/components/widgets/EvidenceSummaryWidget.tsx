import { Card, Badge } from '@rangeos/ui';
import { Database, ShieldCheck, Lock, Unlock } from 'lucide-react';
import { EvidenceCase } from '../../api/mockData';

export function EvidenceSummaryWidget({ cases }: { cases: EvidenceCase[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
        <Database size={14} className="text-cyber-forensic" /> Evidence Vault Summary
      </h2>

      <div className="space-y-3">
        {cases.map(c => (
          <Card key={c.id} className="border-cyber-forensic/20 group hover:bg-cyber-forensic/5 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded ${c.status === 'sealed' ? 'bg-cyber-success/10' : 'bg-cyber-secondary/10'}`}>
                  {c.status === 'sealed' ? (
                    <Lock size={16} className="text-cyber-success" />
                  ) : (
                    <Unlock size={16} className="text-cyber-secondary" />
                  )}
                </div>
                <div>
                  <h4 className="text-[11px] font-mono font-bold text-gray-200 group-hover:text-white transition-colors">{c.name}</h4>
                  <p className="text-[10px] font-mono text-gray-500">{c.id} • {c.artifacts} Artifacts</p>
                </div>
              </div>
              {c.isVerified && (
                 <div className="flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-cyber-success" />
                    <span className="text-[9px] font-bold text-cyber-success uppercase tracking-tighter">Verified</span>
                 </div>
              )}
            </div>
            {c.status === 'sealed' && (
              <div className="mt-2 h-0.5 w-full bg-cyber-surface-elevated overflow-hidden">
                <div className="h-full w-full bg-cyber-success opacity-30 shadow-glow-success" />
              </div>
            )}
          </Card>
        ))}
        
        <button className="w-full py-2 border border-dashed border-cyber-forensic/30 rounded text-[10px] font-mono text-cyber-forensic hover:bg-cyber-forensic/10 transition-colors uppercase tracking-[0.2em] font-bold">
           + Secure New Artifact
        </button>
      </div>
    </div>
  );
}
