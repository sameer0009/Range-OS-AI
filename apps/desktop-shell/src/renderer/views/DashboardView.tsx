import { useState } from 'react';
import { 
  Box, 
  Server, 
  Shield, 
  AlertTriangle, 
  Activity, 
  Zap,
  Terminal,
  Database
} from 'lucide-react';
import { 
  Button, 
  Badge, 
  Card, 
  Table, 
  TopologyNode, 
  Modal 
} from '@rangeos/ui';

export default function DashboardView() {
  const [isModalOpen, setModalOpen] = useState(false);

  const tableHeaders = ["Node ID", "Address", "Type", "Status", "Trust Zone"];
  const tableRows = [
    ["SRV-01", "10.0.1.5", "Server", <Badge variant="success">Active</Badge>, <Badge variant="ht">High Trust</Badge>],
    ["WK-04", "10.0.1.12", "Workstation", <Badge variant="secondary">Idle</Badge>, <Badge variant="mt">Moderate</Badge>],
    ["SQL-DB", "10.0.2.20", "Database", <Badge variant="success">Active</Badge>, <Badge variant="mt">Moderate</Badge>],
    ["VPN-GW", "172.16.0.1", "Gateway", <Badge variant="alert" glow>Warning</Badge>, <Badge variant="lt">Low Trust</Badge>],
    ["UNK-09", "10.0.1.99", "Unknown", <Badge variant="alert">Alert</Badge>, <Badge variant="qt" glow>Quarantined</Badge>],
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
      
      {/* Header section */}
      <header className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-cyber-primary font-mono text-xs uppercase tracking-[0.3em]">
            <Zap size={14} className="animate-pulse" /> Platform Operations
          </div>
          <h1 className="text-3xl font-mono font-bold text-white tracking-tight uppercase">Command Center</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setModalOpen(true)}>System Audit</Button>
          <Button variant="primary">Generate Lab</Button>
        </div>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Lab Instances" icon={<Box size={18} />} accent="primary">
          <div className="flex items-end justify-between">
            <div className="text-4xl font-mono font-bold text-cyber-primary">04</div>
            <Badge variant="primary">+1 Active</Badge>
          </div>
        </Card>
        <Card title="Security Alerts" icon={<AlertTriangle size={18} />} accent="alert">
          <div className="flex items-end justify-between">
            <div className="text-4xl font-mono font-bold text-cyber-alert">12</div>
            <Badge variant="alert" glow>Critical</Badge>
          </div>
        </Card>
        <Card title="Traffic Nodes" icon={<Activity size={18} />} accent="none">
          <div className="flex items-end justify-between">
            <div className="text-4xl font-mono font-bold text-cyber-blue-team">28</div>
            <Badge variant="secondary">Stable</Badge>
          </div>
        </Card>
        <Card title="Evidence Count" icon={<Database size={18} />} accent="forensic">
          <div className="flex items-end justify-between">
            <div className="text-4xl font-mono font-bold text-cyber-forensic">104</div>
            <Badge variant="ev-hashed">Verified</Badge>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Nodes Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <Server size={14} /> Network Node Registry
            </h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyber-success animate-pulse"></span>
              <span className="text-[10px] font-mono text-cyber-success uppercase">Live Telemetry</span>
            </div>
          </div>
          <Table headers={tableHeaders} rows={tableRows} />
        </div>

        {/* Mini Topology Preview */}
        <div className="space-y-4">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <Shield size={14} /> Rapid Topology
          </h2>
          <Card className="flex-1 min-h-[300px] flex items-center justify-center bg-cyber-background/50">
            <div className="grid grid-cols-2 gap-x-12 gap-y-8">
              <TopologyNode label="App Server" ip="10.0.1.5" type="server" />
              <TopologyNode label="Edge Router" ip="172.16.0.1" type="router" status="loading" />
              <TopologyNode label="DB Master" ip="10.0.2.20" type="server" />
              <TopologyNode label="Threat Node" ip="CALI.INFEC" status="alert" type="workstation" />
            </div>
            <div className="absolute bottom-4 right-4 animate-pulse">
               <Terminal size={14} className="text-cyber-primary" />
            </div>
          </Card>
        </div>

      </div>

      {/* System Audit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        title="Automated System Audit"
      >
        <div className="space-y-4">
          <p className="text-sm">Initiating full platform diagnostic. This will verify all trust boundaries and lab isolation rules.</p>
          <div className="p-4 bg-cyber-surface rounded border border-cyber-surface-elevated font-mono text-xs space-y-2">
            <div className="text-cyber-success">[OK] Root authentication service operational.</div>
            <div className="text-cyber-success">[OK] P2P Telemetry bus encrypted.</div>
            <div className="text-cyber-primary">[INFO] Evidence vault synchronization at 94%.</div>
            <div className="text-cyber-alert">[WARN] Node 172.16.0.1 reporting high latency.</div>
          </div>
        </div>
      </Modal>

    </div>
  );
}
