import React, { useState } from 'react';
import { Card, Badge, Button, Table } from '@rangeos/ui';
import { useForensicsStore } from '../store/ForensicsStore';
import { 
  Database, 
  Clock, 
  Search, 
  ShieldCheck, 
  Lock, 
  FileText, 
  Plus, 
  History,
  AlertTriangle,
  FolderOpen,
  Eye
} from 'lucide-react';

export default function ForensicsView() {
  const { activeCase, evidence, updateEvidenceStatus } = useForensicsStore();
  const [activeTab, setActiveTab] = useState<'VAULT' | 'TIMELINE' | 'FINDINGS'>('VAULT');

  const handleVerify = async (id: string) => {
    // In real impl, this calls POST /v1/evidence/{id}/verify
    setTimeout(() => {
        updateEvidenceStatus(id, true);
    }, 1000);
  };

  const logAccess = async (id: string) => {
     // Trigger Chain of Custody access log
     console.log(`[AUDIT] Evidence Access Recorded for artifact ${id}`);
  };

  const evidenceHeaders = ["Name", "Type", "Source Node", "Size", "Integrity", "Actions"];
  const evidenceRows = evidence.map(item => [
    <span className="font-mono text-xs">{item.name}</span>,
    <Badge variant="primary">{item.type}</Badge>,
    <span className="text-[10px] font-mono text-gray-400">{item.sourceNode}</span>,
    <span className="text-[10px] font-mono text-gray-500">{item.size}</span>,
    <Badge variant={item.is_verified ? 'ht' : 'alert'} glow={!item.is_verified}>
        {item.is_verified ? 'VERIFIED' : 'PENDING'}
    </Badge>,
    <div className="flex gap-2">
        <Button size="xs" variant="ghost" onClick={() => logAccess(item.id)}>
            <Eye size={12} />
        </Button>
        {!item.is_verified && (
            <Button size="xs" variant="primary" onClick={() => handleVerify(item.id)}>
                Verify
            </Button>
        )}
    </div>
  ]);

  if (!activeCase) {
    return (
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <Lock size={48} className="text-gray-800" />
            <p className="font-mono text-xs text-gray-600 uppercase tracking-widest">Select Case context to Unlock Investigative Vault</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-700">
      
      {/* Case Header */}
      <div className="flex justify-between items-center bg-cyber-surface/50 p-6 rounded-xl border border-cyber-surface-elevated">
        <div className="flex items-center gap-6">
           <div className="h-16 w-16 bg-cyber-forensic/10 rounded-lg flex items-center justify-center border border-cyber-forensic/30">
              <FolderOpen size={32} className="text-cyber-forensic" />
           </div>
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <Badge variant="forensic">{activeCase.id}</Badge>
                 <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Investigative Lead: {activeCase.investigator}</span>
              </div>
              <h1 className="text-2xl font-mono font-bold text-white uppercase tracking-tight">{activeCase.title}</h1>
           </div>
        </div>
        <div className="flex gap-3">
           <Button variant="ghost" className="border-cyber-forensic/20 text-cyber-forensic">
              <History size={16} className="mr-2" /> Evidence Chain
           </Button>
           <Button variant="primary" className="bg-cyber-forensic text-black hover:bg-white shadow-glow-forensic">
              <FileText size={16} className="mr-2" /> Finalize Report
           </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-cyber-surface rounded-lg w-fit border border-cyber-surface-elevated">
        {[
          { id: 'VAULT', icon: <Database size={14} />, label: 'Evidence Vault' },
          { id: 'TIMELINE', icon: <Clock size={14} />, label: 'Incident Timeline' },
          { id: 'FINDINGS', icon: <Search size={14} />, label: 'Forensic Findings' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2 rounded font-mono text-xs font-bold uppercase transition-all ${
              activeTab === tab.id ? 'bg-cyber-forensic text-black shadow-glow-forensic' : 'text-gray-500 hover:text-white'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'VAULT' && (
          <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
            <div className="flex justify-between items-center">
               <h2 className="text-sm font-mono font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <ShieldCheck size={16} className="text-cyber-forensic" /> Integrity Registry
               </h2>
               <Button size="sm" variant="ghost">
                  <Plus size={14} className="mr-2" /> Register Artifact
               </Button>
            </div>
            <Table headers={evidenceHeaders} rows={evidenceRows} />
          </div>
        )}

        {activeTab === 'TIMELINE' && (
          <div className="space-y-6 animate-in slide-in-from-left-4 duration-500 h-full overflow-y-auto pr-4">
             <div className="relative pt-4 pl-8 border-l border-cyber-surface-elevated ml-4 space-y-12">
                {[
                  { time: '2026-04-18 14:22:01', event: 'Initial beaconing detected from finance workstation.', node: 'WK-FIN-04', type: 'critical' },
                  { time: '2026-04-18 14:25:10', event: 'Unauthorized attempt to query domain controllers via LDAP.', node: 'SRV-DC', type: 'error' },
                  { time: '2026-04-18 14:40:00', event: 'Execution of PowerShell scripts on SRV-APP-01.', node: 'SRV-APP-01', type: 'warn' },
                  { time: '2026-04-18 15:10:00', event: 'Large data outbound transfer initiated (3.4GB).', node: 'ROUTER-01', type: 'critical' }
                ].map((ev, i) => (
                  <div key={i} className="relative">
                    <div className={`absolute -left-[41px] top-1 w-5 h-5 rounded-full border-4 border-cyber-background flex items-center justify-center ${
                      ev.type === 'critical' ? 'bg-cyber-alert shadow-glow-alert' : 
                      ev.type === 'error' ? 'bg-cyber-secondary shadow-glow-secondary' : 'bg-cyber-primary shadow-glow-primary'
                    }`} />
                    <div className="space-y-1">
                       <span className="text-[10px] font-mono text-gray-500 italic uppercase">{ev.time}</span>
                       <div className="flex items-center gap-4">
                          <h4 className="font-mono font-bold text-white uppercase">{ev.event}</h4>
                          <Badge variant="ghost" size="sm" className="bg-white/5">{ev.node}</Badge>
                       </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'FINDINGS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-left-4 duration-500">
             <Card title="Finding: Lateral Movement via WMI" accent="forensic" icon={<ShieldCheck size={18} />}>
                <p className="text-sm text-gray-400 mb-4 font-mono">
                  Analysis of memory dumps from WK-FIN-04 reveals the use of WMI for pivot detection. The attacker successfully utilized hijacked credentials...
                </p>
                <div className="flex justify-between items-center text-[10px] font-mono">
                   <span className="text-gray-600">CONFIDENCE: 92%</span>
                   <span className="text-cyber-forensic cursor-pointer hover:underline">View Proof Artifacts →</span>
                </div>
             </Card>
             <Card title="Finding: Data Exfiltration via HTTPS" accent="alert" icon={<AlertTriangle size={18} />}>
                <p className="text-sm text-gray-400 mb-4 font-mono">
                  Outbound telemetry indicates exfiltration of encrypted blobs over standard port 443. Target IP identified as calibrated malicious node in EU region.
                </p>
                <div className="flex justify-between items-center text-[10px] font-mono">
                   <span className="text-gray-600">CONFIDENCE: 84%</span>
                   <span className="text-cyber-alert cursor-pointer hover:underline">View Proof Artifacts →</span>
                </div>
             </Card>
          </div>
        )}
      </div>

    </div>
  );
}
