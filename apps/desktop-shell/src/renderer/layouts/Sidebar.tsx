import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Terminal, 
  Network, 
  ShieldAlert, 
  ShieldCheck, 
  Search, 
  Bot, 
  FileText, 
  Lock, 
  Settings 
} from 'lucide-react';

const navItems = [
  { path: '/shell/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/shell/lab-builder', label: 'Lab Builder', icon: Terminal },
  { path: '/shell/topology', label: 'Topology', icon: Network },
  { path: '/shell/red-workspace', label: 'Red Team', icon: ShieldAlert, color: 'text-cyber-alert group-hover:text-cyber-alert' },
  { path: '/shell/blue-workspace', label: 'Blue Team', icon: ShieldCheck, color: 'text-cyber-blue-team group-hover:text-cyber-blue-team' },
  { path: '/shell/forensics', label: 'Forensics', icon: Search, color: 'text-cyber-forensic group-hover:text-cyber-forensic' },
  { path: '/shell/ai-assistant', label: 'AI Assistant', icon: Bot, color: 'text-cyber-primary group-hover:text-cyber-primary' },
  { path: '/shell/reports', label: 'Reports', icon: FileText },
  { path: '/shell/policies', label: 'Policies', icon: Lock },
  { path: '/shell/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <div className="w-64 h-full bg-cyber-surface border-r border-cyber-surface-elevated flex flex-col">
      <div className="p-4 flex items-center justify-center border-b border-cyber-surface-elevated/50">
        <div className="text-center">
          <div className="text-xs text-gray-500 font-mono mb-1 uppercase tracking-wider">Access Level</div>
          <div className="px-3 py-1 bg-cyber-primary/10 border border-cyber-primary text-cyber-primary text-sm font-mono rounded shadow-glow-primary">
            ROOT/ADMIN
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2.5 rounded-md font-mono text-sm transition-all duration-200 group ${
                  isActive 
                    ? 'bg-cyber-surface-elevated text-white border-l-2 border-cyber-primary' 
                    : 'text-gray-400 hover:bg-cyber-surface-elevated/50 hover:text-gray-200 border-l-2 border-transparent'
                }`
              }
            >
              <Icon size={18} className={`${item.color || 'text-gray-400 group-hover:text-gray-200'} transition-colors`} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="p-4 text-xs font-mono text-gray-600 border-t border-cyber-surface-elevated/50 text-center">
        v0.1.0-alpha
      </div>
    </div>
  );
}
