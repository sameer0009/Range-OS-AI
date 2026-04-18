import { Shield, Activity, Clock, Search, AlertCircle, ChevronRight, HardDrive, Network, User } from 'lucide-react';
import { Card, Button, Badge } from '@rangeos/ui';
import { useBlueWorkspaceStore } from '../store/BlueWorkspaceStore';

export default function BlueWorkspaceView() {
  const { alerts, activeAlert, globalSeverity, setActiveAlert, resolveAlert } = useBlueWorkspaceStore();

  return (
    <div className="flex flex-col h-full space-y-4 p-2 overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center bg-cyber-surface/30 border border-cyber-surface-elevated p-4 rounded-xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-cyber-secondary/20 text-cyber-secondary rounded-lg border border-cyber-secondary/30">
            <Shield size={20} />
          </div>
          <div>
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Active Intelligence</div>
            <h1 className="text-xl font-mono font-bold text-white uppercase tracking-tight">Mission Defensive Monitor</h1>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-right">
            <div className="text-[10px] font-mono text-gray-500 uppercase mb-1">Threat Severity</div>
            <div className="flex items-center gap-3">
                <div className="w-32 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyber-secondary shadow-glow-secondary" style={{ width: `${globalSeverity}%` }} />
                </div>
                <span className="text-cyber-secondary font-mono text-sm font-bold">{globalSeverity}%</span>
            </div>
          </div>
          <div className="flex gap-4 border-l border-white/5 pl-8">
            <div className="text-right">
                <div className="text-[10px] font-mono text-gray-500 uppercase">Analyst</div>
                <div className="text-white font-mono text-sm font-bold flex items-center gap-2">
                    <User size={12} className="text-cyber-primary" /> ROOT_ADMIN
                </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-12 gap-4 overflow-hidden">
        
        {/* Left: Triage Queue */}
        <aside className="col-span-3 flex flex-col gap-4 overflow-hidden">
            <h3 className="flex items-center justify-between text-[10px] font-mono font-bold uppercase py-1 tracking-widest px-1">
                <span className="flex items-center gap-2 text-gray-500"><Activity size={12} /> Triage Queue</span>
                <span className="text-cyber-primary">{alerts.length} OPEN</span>
            </h3>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {alerts.map(alert => (
                    <div 
                        key={alert.id}
                        onClick={() => setActiveAlert(alert)}
                        className={`p-4 rounded-lg border transition-all cursor-pointer ${activeAlert?.id === alert.id ? 'bg-cyber-secondary/20 border-cyber-secondary/50 shadow-glow-secondary/10' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <Badge variant={alert.severity === 'CRITICAL' ? 'danger' : 'warning'} className="text-[8px] px-1.5 scale-90 -ml-1">
                                {alert.severity}
                            </Badge>
                            <span className="text-[9px] font-mono text-gray-600">{alert.timestamp}</span>
                        </div>
                        <div className="text-xs font-bold text-white mb-1">{alert.title}</div>
                        <div className="text-[10px] font-mono text-cyber-primary">{alert.nodeId}</div>
                    </div>
                ))}
            </div>
        </aside>

        {/* Center: Analysis Stage */}
        <main className="col-span-6 flex flex-col gap-4 overflow-hidden">
            {activeAlert ? (
                <div className="flex-1 flex flex-col gap-4 overflow-hidden animate-in fade-in duration-500">
                    <Card className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-lg font-mono font-bold text-white mb-1 uppercase tracking-tight">{activeAlert.title}</h2>
                                <div className="flex items-center gap-4 text-[10px] font-mono text-gray-500">
                                    <span>DETECTION_ID: {activeAlert.id}</span>
                                    <span className="text-cyber-secondary">MITRE: {activeAlert.technique}</span>
                                </div>
                            </div>
                            <Button size="sm" variant="ghost" onClick={() => resolveAlert(activeAlert.id)}>
                                Mark Resolved
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-4 bg-black/40 border border-white/5 rounded-lg space-y-2">
                                <div className="text-[9px] font-mono text-gray-500 uppercase">Detection Logic</div>
                                <div className="text-[10px] font-mono text-white leading-relaxed">
                                    Heuristic match for non-standard child processes spawned by standard terminal providers.
                                </div>
                            </div>
                            <div className="p-4 bg-black/40 border border-white/5 rounded-lg space-y-2">
                                <div className="text-[9px] font-mono text-gray-500 uppercase">Affected Source</div>
                                <div className="text-[10px] font-mono text-cyber-primary font-bold">/usr/bin/python3 (PID: 2842)</div>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col gap-3">
                             <h3 className="flex items-center gap-2 text-gray-500 text-[10px] font-mono font-bold uppercase tracking-widest px-1">
                                <Clock size={12} /> Incident Timeline
                             </h3>
                             <div className="flex-1 bg-black/20 border border-white/5 rounded-lg p-4 font-mono text-[10px] space-y-4 overflow-y-auto">
                                <div className="flex gap-4 border-l border-cyber-secondary pl-4 pb-4">
                                    <span className="text-gray-600">22:15:01</span>
                                    <span className="text-white">External HTTP connection established from 192.168.1.42</span>
                                </div>
                                <div className="flex gap-4 border-l border-cyber-secondary pl-4 pb-4">
                                    <span className="text-gray-600">22:17:40</span>
                                    <span className="text-white">Directory traversal detected on endpoint /api/v1/auth</span>
                                </div>
                                <div className="flex gap-4 border-l border-cyber-alert pl-4 pb-4 bg-cyber-alert/5 shadow-glow-alert/5">
                                    <span className="text-cyber-alert font-bold">22:18:01</span>
                                    <span className="text-cyber-alert font-bold">COMMAND_EXECUTION: Unauthorized script running on UBUNTU-JUICE</span>
                                </div>
                             </div>
                        </div>
                    </Card>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-black/5">
                    <div className="text-center space-y-2">
                        <Search size={32} className="mx-auto text-gray-700" />
                        <div className="text-xs font-mono text-gray-600 uppercase">Select Alert for Tactical Analysis</div>
                    </div>
                </div>
            )}
        </main>

        {/* Right: Asset Monitor */}
        <aside className="col-span-3 flex flex-col gap-4 overflow-y-auto pr-2">
            <Card className="space-y-6">
                <section>
                    <h3 className="flex items-center gap-2 text-cyber-primary text-[10px] font-mono font-bold uppercase mb-4 tracking-widest">
                        <Network size={12} /> Node Vitals
                    </h3>
                    <div className="space-y-4">
                        <div className="p-3 bg-black/40 border border-white/5 rounded-lg space-y-3">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-mono text-gray-500">Load Factor</span>
                                <span className="text-[10px] font-mono text-white">42%</span>
                            </div>
                            <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
                                <div className="h-full bg-cyber-primary" style={{ width: '42%' }} />
                            </div>
                        </div>
                        <div className="p-3 bg-black/40 border border-white/5 rounded-lg space-y-3">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-mono text-gray-500">I/O Throughput</span>
                                <span className="text-[10px] font-mono text-cyber-secondary">8.4 MB/s</span>
                            </div>
                            <div className="h-2 flex gap-1 items-end pt-2">
                                {[3,1,5,2,8,4,9,2,6,4].map((h, i) => (
                                    <div key={i} className="flex-1 bg-cyber-secondary/30 rounded-t-sm" style={{ height: `${h * 10}%` }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="flex items-center gap-2 text-gray-500 text-[10px] font-mono font-bold uppercase mb-4 tracking-widest">
                        <HardDrive size={12} /> Response Pivot
                    </h3>
                    <div className="space-y-3">
                        <Button variant="ghost" className="w-full text-[10px] font-mono h-10 border-white/10">
                            Capture RAM Dump
                        </Button>
                        <Button variant="primary" className="w-full text-xs font-bold py-3 bg-cyber-secondary/20 border-cyber-secondary/30 text-cyber-secondary hover:bg-cyber-secondary hover:text-black shadow-glow-secondary/5">
                            PIVOT TO FORENSICS
                        </Button>
                    </div>
                </section>
            </Card>
        </aside>
      </div>

      {/* Footer Intel Ticker */}
      <footer className="h-12 flex items-center gap-6 px-6 bg-cyber-surface/50 border border-cyber-surface-elevated rounded-xl backdrop-blur-xl">
        <div className="flex items-center gap-3 min-w-[200px]">
            <Activity size={14} className="text-cyber-secondary" />
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase">Intel Stream:</span>
            <Badge variant="ghost" className="bg-cyber-secondary/10 text-cyber-secondary px-2 font-mono">ENCRYPTED</Badge>
        </div>

        <div className="flex-1 flex items-center gap-4 border-l border-white/5 pl-6 overflow-hidden">
            <div className="flex-1 flex items-center gap-6 overflow-hidden scrolling-text">
                {[
                    '[INTEL] Monitoring isolated subnet 10.0.10.0/24',
                    '[SYSLOG] Node UBUNTU-JUICE heartbeating stable',
                    '[NET_SEC] ARP poisoning guard active on V-GATEWAY',
                    '[AUTH] Successful SSH from ROOT_ADMIN'
                ].map((msg, idx) => (
                    <div key={idx} className="flex items-center gap-2 whitespace-nowrap text-[10px] font-mono text-gray-500">
                        <ChevronRight size={10} /> {msg}
                    </div>
                ))}
            </div>
        </div>
      </footer>
    </div>
  );
}
