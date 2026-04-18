import { useState } from 'react';
import { Card, Badge, Button } from '@rangeos/ui';
import { Activity, Shield, Layout, Terminal, Database, X } from 'lucide-react';

export interface InspectorProps {
  selectedNode: any | null;
  onClose: () => void;
}

export function InspectorPanel({ selectedNode, onClose }: InspectorProps) {
  const [activeTab, setActiveTab] = useState<'SERVICES' | 'POLICIES' | 'EVENTS' | 'FORENSICS'>('SERVICES');

  if (!selectedNode) return null;

  return (
    <div className="absolute bottom-4 left-4 right-4 h-64 bg-cyber-background/95 backdrop-blur-md border border-cyber-surface-elevated rounded-lg shadow-2xl z-50 flex flex-col animate-in slide-in-from-bottom-full duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-surface-elevated">
        <div className="flex items-center gap-4">
           <Badge variant={selectedNode.status === 'alert' ? 'alert' : 'primary'}>{selectedNode.id}</Badge>
           <h3 className="font-mono font-bold text-white uppercase tracking-widest">{selectedNode.label}</h3>
           <span className="text-gray-500 font-mono text-[10px]">{selectedNode.ip || '0.0.0.0'}</span>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Tabs */}
        <div className="w-48 border-r border-cyber-surface-elevated flex flex-col p-2 gap-1">
          {[
            { id: 'SERVICES', icon: <Layout size={14} />, label: 'Services' },
            { id: 'POLICIES', icon: <Shield size={14} />, label: 'Policies' },
            { id: 'EVENTS', icon: <Activity size={14} />, label: 'Events' },
            { id: 'FORENSICS', icon: <Database size={14} />, label: 'Forensics' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-4 py-2 rounded font-mono text-[10px] font-bold uppercase tracking-wider transition-all ${
                activeTab === tab.id ? 'bg-cyber-primary text-black' : 'text-gray-500 hover:bg-cyber-surface-elevated hover:text-white'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto font-mono">
           {activeTab === 'SERVICES' && (
             <div className="grid grid-cols-3 gap-4">
                {[
                  { name: 'SSHD', status: 'Active' },
                  { name: 'NGINX', status: 'Active' },
                  { name: 'POSTGRES', status: 'Idle' },
                  { name: 'FAIL2BAN', status: 'Blocked' },
                ].map(s => (
                  <Card key={s.name} className="py-2 px-3 border-cyber-surface-elevated">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-white">{s.name}</span>
                      <Badge variant={s.status === 'Active' ? 'success' : 'ghost'} size="sm">{s.status}</Badge>
                    </div>
                  </Card>
                ))}
             </div>
           )}

           {activeTab === 'EVENTS' && (
             <div className="space-y-2">
                <div className="text-[10px] text-cyber-alert">[ALRT] Unauthorized login attempt from 192.168.1.50</div>
                <div className="text-[10px] text-cyber-primary">[INFO] Service SSHD restarted by SYSTEM</div>
                <div className="text-[10px] text-gray-500">[DBUG] Kernel parameters updated</div>
                <div className="text-[10px] text-gray-500">[DBUG] Heartbeat pulse received</div>
             </div>
           )}

           {activeTab === 'POLICIES' && (
             <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-cyber-surface/30 border border-cyber-surface-elevated rounded">
                   <div className="flex flex-col">
                      <span className="text-[11px] text-white">ISOLATION_BOUNDARY_V1</span>
                      <span className="text-[9px] text-gray-500 uppercase">Enforced by GLOBAL_POLICY_SVC</span>
                   </div>
                   <Badge variant="ht">HI-TRUST</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-cyber-surface/30 border border-cyber-surface-elevated rounded">
                   <div className="flex flex-col">
                      <span className="text-[11px] text-white">EXTERNAL_TRAFFIC_DENY</span>
                      <span className="text-[9px] text-gray-500 uppercase">Source: ALL -> Target: INTERNET</span>
                   </div>
                   <Badge variant="alert">DENIED</Badge>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
