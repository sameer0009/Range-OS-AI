import { Button } from '@rangeos/ui';
import { Box, Server, Shield, AlertTriangle, AlertCircle } from 'lucide-react';

export default function DashboardView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-mono text-white mb-2">System Dashboard</h1>
          <p className="text-gray-400 font-sans text-sm">Welcome back, Operator. System limits are steady.</p>
        </div>
        <div className="space-x-3">
          <Button variant="ghost">View Logs</Button>
          <Button variant="primary">Deploy New Lab</Button>
        </div>
      </header>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Active Labs" value="3" icon={Box} color="text-cyber-primary" />
        <MetricCard title="Total Nodes" value="14" icon={Server} color="text-cyber-secondary" />
        <MetricCard title="Policies Active" value="8" icon={Shield} color="text-cyber-success" />
        <MetricCard title="Pending Alerts" value="2" icon={AlertTriangle} color="text-cyber-alert" isAlert />
      </div>

      {/* Main Grid Floor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Environments */}
        <div className="lg:col-span-2 glass-panel rounded-lg p-5">
          <h2 className="text-lg font-mono text-gray-200 mb-4 flex items-center gap-2">
            <Server size={18}/> Active Environments
          </h2>
          <div className="space-y-3">
            <EnvRow name="Web Pentesting Alpha" status="Running" nodes={4} uptime="2h 14m" />
            <EnvRow name="AD Lateral Movement Practice" status="Running" nodes={6} uptime="45m" />
            <EnvRow name="Ransomware Analysis #02" status="Quarantined" nodes={1} uptime="0m" isAlert />
          </div>
        </div>

        {/* Action Feed / Alerts */}
        <div className="glass-panel rounded-lg p-5 flex flex-col">
          <h2 className="text-lg font-mono text-gray-200 mb-4 flex items-center gap-2">
            <AlertCircle size={18}/> Telemetry Feed
          </h2>
          <div className="flex-1 space-y-4 font-mono text-xs">
            <div className="p-3 bg-cyber-alert/10 border-l-2 border-cyber-alert text-gray-300">
              <span className="text-cyber-alert font-bold">[10:44:02]</span> Unauthorized outbound connection attempt blocked in Lab #2.
            </div>
            <div className="p-3 bg-cyber-surface border-l-2 border-cyber-primary text-gray-300">
              <span className="text-cyber-primary font-bold">[10:40:15]</span> User 'admin' logged into Shell.
            </div>
            <div className="p-3 bg-cyber-surface border-l-2 border-cyber-primary text-gray-300">
              <span className="text-cyber-primary font-bold">[10:15:00]</span> Sandbox snapshot created for AD Lab.
            </div>
          </div>
          <Button variant="ghost" className="w-full mt-4 text-xs">View Full Feed</Button>
        </div>

      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, color, isAlert = false }: any) {
  return (
    <div className={`p-4 glass-panel rounded-lg cyber-border relative overflow-hidden group ${isAlert ? 'border-cyber-alert/50 shadow-glow-alert' : ''}`}>
      <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform">
        <Icon size={64} className={color} />
      </div>
      <div className="relative z-10">
        <h3 className="text-gray-400 font-mono text-sm uppercase tracking-wider mb-2">{title}</h3>
        <div className={`text-4xl font-mono font-bold ${color}`}>{value}</div>
      </div>
    </div>
  );
}

function EnvRow({ name, status, nodes, uptime, isAlert }: any) {
  return (
    <div className="flex items-center justify-between p-3 bg-cyber-surface/50 border border-cyber-surface hover:border-cyber-surface-elevated rounded transition-colors group">
      <div>
        <div className="font-mono text-sm text-gray-200">{name}</div>
        <div className="text-xs text-gray-500 mt-1">Nodes: {nodes} | Uptime: {uptime}</div>
      </div>
      <div className="flex items-center gap-4">
        <span className={`text-xs font-mono px-2 py-1 rounded ${isAlert ? 'bg-cyber-alert/20 text-cyber-alert border border-cyber-alert' : 'bg-cyber-success/10 text-cyber-success'}`}>
          {status}
        </span>
        <Button variant="ghost" className="text-xs py-1 px-2">Manage</Button>
      </div>
    </div>
  );
}
