import { useState } from 'react';
import { Card, Badge, Button, Table } from '@rangeos/ui';
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
  FolderOpen
} from 'lucide-react';

export default function ForensicsView() {
  const [activeTab, setActiveTab] = useState<'VAULT' | 'TIMELINE' | 'FINDINGS'>('VAULT');
  const [selectedCase, setSelectedCase] = useState<any>({
    id: 'CAS-2026-0042',
    title: 'Lateral Movement - Subnet B',
    status: 'ACTIVE',
    investigator: 'ROOT_ADMIN'
  });

  const evidenceHeaders = ["Name", "Type", "Source Node", "Size", "Status"];
  const evidenceRows = [
    ["srv-dc-mem.raw", <Badge variant="primary">Memory</Badge>, "SRV-DC", "16GB", <Badge variant="ht">VERIFIED</Badge>],
    ["edge-router.pcap", <Badge variant="primary">Network</Badge>, "ROUTER-01", "512MB", <Badge variant="ht">VERIFIED</Badge>],
    ["wk-finance-04.vhdx", <Badge variant="primary">Disk</Badge>, "WK-FIN-04", "120GB", <Badge variant="alert" glow>UNVERIFIED</Badge>],
  ];

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
                 <Badge variant="forensic">{selectedCase.id}</Badge>
                 <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Investigative Lead: {selectedCase.investigator}</span>
              </div>
              <h1 className="text-2xl font-mono font-bold text-white uppercase tracking-tight">{selectedCase.title}</h1>
           </div>
        </div>
        <div className="flex gap-3">
           <Button variant="ghost">Evidence Chain</Button>
           <Button variant="primary">
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
