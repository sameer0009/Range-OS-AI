import { NavLink } from 'react-router-dom';

// Import SVG assets
import cyberRangeIcon from '../assets/icons/cyber-range.svg';
import pentestLabIcon from '../assets/icons/pentest-lab.svg';
import networkMapperIcon from '../assets/icons/network-mapper.svg';
import threatIntelIcon from '../assets/icons/threat-intel.svg';
import sandboxIcon from '../assets/icons/sandbox.svg';
import forensicsIcon from '../assets/icons/forensics.svg';
import aiCoreIcon from '../assets/icons/ai-core.svg';
import reportsIcon from '../assets/icons/reports.svg';
import policyEngineIcon from '../assets/icons/policy-engine.svg';
import settingsIcon from '../assets/icons/settings.svg';

const navItems = [
  { path: '/shell/dashboard', label: 'Dashboard', icon: cyberRangeIcon },
  { path: '/shell/lab-builder', label: 'Lab Builder', icon: pentestLabIcon },
  { path: '/shell/topology', label: 'Topology', icon: networkMapperIcon },
  { path: '/shell/red-workspace', label: 'Red Team', icon: threatIntelIcon, color: 'bg-cyber-alert group-hover:bg-cyber-alert' },
  { path: '/shell/blue-workspace', label: 'Blue Team', icon: sandboxIcon, color: 'bg-cyber-blue-team group-hover:bg-cyber-blue-team' },
  { path: '/shell/forensics', label: 'Forensics', icon: forensicsIcon, color: 'bg-cyber-forensic group-hover:bg-cyber-forensic' },
  { path: '/shell/ai-assistant', label: 'AI Assistant', icon: aiCoreIcon, color: 'bg-cyber-primary group-hover:bg-cyber-primary' },
  { path: '/shell/reports', label: 'Reports', icon: reportsIcon },
  { path: '/shell/policies', label: 'Policies', icon: policyEngineIcon },
  { path: '/shell/settings', label: 'Settings', icon: settingsIcon },
];

export default function Sidebar() {
  return (
    <div className="w-64 h-full bg-cyber-surface border-r border-cyber-surface-elevated flex flex-col">
      <div className="p-4 flex items-center justify-center border-b border-cyber-surface-elevated/50">
        <div className="text-center">
          <div className="text-xs text-gray-500 font-mono mb-1 uppercase tracking-wider">Access Level</div>
          <div className="px-3 py-1 bg-cyber-primary/10 border border-cyber-primary text-cyber-primary text-sm font-mono rounded shadow-glow-primary uppercase">
            Root / Admin
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2.5 rounded-md font-mono text-xs transition-all duration-200 group uppercase tracking-widest ${
                isActive 
                  ? 'bg-cyber-surface-elevated text-white border-l-2 border-cyber-primary' 
                  : 'text-gray-400 hover:bg-cyber-surface-elevated/50 hover:text-gray-200 border-l-2 border-transparent'
              }`
            }
          >
            {/* Custom Icon with Masking for Theme Color inheritance */}
            <div 
              className={`w-5 h-5 ${item.color || 'bg-gray-400 group-hover:bg-white'} transition-colors`}
              style={{
                maskImage: `url(${item.icon})`,
                maskRepeat: 'no-repeat',
                maskPosition: 'center',
                maskSize: 'contain',
                WebkitMaskImage: `url(${item.icon})`,
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                WebkitMaskSize: 'contain',
              }}
            />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="p-4 text-[10px] font-mono text-gray-600 border-t border-cyber-surface-elevated/50 text-center uppercase tracking-widest">
        v0.1.0-alpha / Kernel: 6.2.0-range
      </div>
    </div>
  );
}
