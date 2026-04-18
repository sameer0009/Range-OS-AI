import { Terminal, Shield, Target, FileText, Activity, AlertTriangle, ChevronRight } from 'lucide-react';
import { Card, Button, Badge } from '@rangeos/ui';
import { useRedWorkspaceStore } from '../store/RedWorkspaceStore';

export default function RedWorkspaceView() {
    const { objectives, findings, intelStream, isPolicyViolated, toggleObjective, addFinding } = useRedWorkspaceStore();

    return (
        <div className="flex flex-col h-full space-y-4 p-2 overflow-hidden">
            {/* Header */}
            <header className="flex justify-between items-center bg-cyber-surface/30 border border-cyber-surface-elevated p-4 rounded-xl backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-cyber-alert/20 text-cyber-alert rounded-lg border border-cyber-alert/30">
                        <Terminal size={20} />
                    </div>
                    <div>
                        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Active Mission</div>
                        <h1 className="text-xl font-mono font-bold text-white uppercase tracking-tight">Beginner Web Pentest Lab</h1>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <div className="text-[10px] font-mono text-gray-500 uppercase">Integrity</div>
                        <div className="text-cyber-secondary font-mono text-sm font-bold">STRICT</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-mono text-gray-500 uppercase">Elapsed</div>
                        <div className="text-white font-mono text-sm font-bold">00:42:12</div>
                    </div>
                </div>
            </header>

            {/* Main Stage */}
            <div className="flex-1 grid grid-cols-12 gap-4 overflow-hidden">
                
                {/* Left: Mission Specs */}
                <aside className="col-span-3 flex flex-col gap-4 overflow-y-auto pr-2">
                    <Card className="flex-1 flex flex-col gap-6">
                        <section>
                            <h3 className="flex items-center gap-2 text-cyber-alert text-[10px] font-mono font-bold uppercase mb-4 tracking-widest">
                                <Activity size={12} /> Objectives
                            </h3>
                            <div className="space-y-3">
                                {objectives.map(obj => (
                                    <div 
                                        key={obj.id} 
                                        onClick={() => toggleObjective(obj.id)}
                                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${obj.completed ? 'bg-cyber-secondary/10 border-cyber-secondary/30 text-cyber-secondary' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}
                                    >
                                        <div className={`w-2 h-2 rounded-full ${obj.completed ? 'bg-cyber-secondary animate-pulse' : 'bg-gray-600'}`} />
                                        <span className="text-[11px] font-mono font-bold leading-none">{obj.title}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="mt-auto">
                            <h3 className="flex items-center gap-2 text-gray-500 text-[10px] font-mono font-bold uppercase mb-4 tracking-widest">
                                <Target size={12} /> Target Brief
                            </h3>
                            <div className="bg-black/40 border border-white/5 p-4 rounded-lg space-y-3">
                                <div className="flex justify-between text-[10px] font-mono">
                                    <span className="text-gray-500">HOSTNAME</span>
                                    <span className="text-white font-bold">UBUNTU-JUICE</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-mono">
                                    <span className="text-gray-500">IP_ADDR</span>
                                    <span className="text-cyber-primary font-bold">10.0.10.20</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-mono">
                                    <span className="text-gray-500">ZONE</span>
                                    <span className="text-cyber-alert font-bold">TARGET</span>
                                </div>
                            </div>
                        </section>
                    </Card>
                </aside>

                {/* Center: Tactical Console */}
                <main className="col-span-6 flex flex-col gap-4 overflow-hidden">
                    <div className="flex-1 bg-black/80 border border-cyber-alert/20 rounded-xl overflow-hidden shadow-2xl shadow-cyber-alert/5 flex flex-col">
                        <div className="bg-cyber-alert/10 border-b border-cyber-alert/20 px-4 py-2 flex justify-between items-center">
                            <span className="text-cyber-alert text-[9px] font-mono font-bold uppercase tracking-widest">Console Shell v1.4.2 [KALI-RED]</span>
                            <div className="flex gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyber-alert animate-pulse" />
                                <div className="w-1.5 h-1.5 rounded-full bg-cyber-alert/30" />
                            </div>
                        </div>
                        <div className="flex-1 p-6 font-mono text-sm text-cyber-alert overflow-y-auto space-y-2 opacity-80">
                            <div>$ nmap -sC -sV 10.0.10.20</div>
                            <div className="text-white/60">Starting Nmap 7.94 ( https://nmap.org ) at 2026-04-18 22:15 UTC</div>
                            <div className="text-white/60">Nmap scan report for 10.0.10.20</div>
                            <div>PORT     STATE SERVICE VERSION</div>
                            <div>80/tcp   open  http    nginx 1.18.0</div>
                            <div>3000/tcp open  http    Node.js (Express framework)</div>
                            <div className="animate-pulse">_</div>
                        </div>
                    </div>
                </main>

                {/* Right: Field Intelligence */}
                <aside className="col-span-3 flex flex-col gap-4 overflow-y-auto pr-2">
                    <Card className="flex-1 flex flex-col gap-6">
                        <section>
                            <h3 className="flex items-center gap-2 text-cyber-secondary text-[10px] font-mono font-bold uppercase mb-4 tracking-widest">
                                <FileText size={12} /> Finding Ledger
                            </h3>
                            <div className="space-y-4">
                                {findings.map(f => (
                                    <div key={f.id} className="border-l-2 border-cyber-secondary pl-4 py-1 space-y-1">
                                        <div className="text-[10px] text-gray-500 font-mono italic">{f.timestamp}</div>
                                        <div className="text-xs font-bold text-white leading-tight">{f.title}</div>
                                    </div>
                                ))}
                                <Button 
                                    variant="ghost" 
                                    className="w-full border-dashed border-white/10 text-[10px] font-mono h-10 hover:bg-white/5"
                                    onClick={() => addFinding('Discovered open port 3000 running Express')}
                                >
                                    + RECORD OBSERVATION
                                </Button>
                            </div>
                        </section>

                        <section className="mt-auto pt-6 border-t border-white/5">
                            <Button variant="primary" className="w-full group py-6 text-xs font-bold bg-cyber-alert/20 border-cyber-alert/30 text-cyber-alert hover:bg-cyber-alert hover:text-black transition-all">
                                <Target size={14} className="mr-2 group-hover:scale-125 transition-transform" />
                                HANDOFF TO FORENSICS
                            </Button>
                        </section>
                    </Card>
                </aside>
            </div>

            {/* Footer Governance */}
            <footer className="h-12 flex items-center gap-6 px-6 bg-cyber-surface/50 border border-cyber-surface-elevated rounded-xl backdrop-blur-xl">
                <div className="flex items-center gap-3 min-w-[200px]">
                    <Shield size={14} className={isPolicyViolated ? 'text-cyber-alert animate-pulse' : 'text-cyber-secondary'} />
                    <span className="text-[10px] font-mono font-bold text-gray-500 uppercase">Policy Mode:</span>
                    <Badge variant={isPolicyViolated ? 'danger' : 'success'} className="px-2 font-mono">
                        {isPolicyViolated ? 'VIOLATION' : 'PERMITTED'}
                    </Badge>
                </div>

                <div className="flex-1 flex items-center gap-4 border-l border-white/5 pl-6 overflow-hidden">
                    <Activity size={12} className="text-cyber-primary" />
                    <div className="flex-1 flex items-center gap-6 overflow-hidden">
                        {intelStream.map((msg, idx) => (
                            <div key={idx} className="flex items-center gap-2 whitespace-nowrap text-[10px] font-mono text-gray-500">
                                <ChevronRight size={10} /> {msg}
                            </div>
                        ))}
                    </div>
                </div>
            </header>
        </div>
    );
}
