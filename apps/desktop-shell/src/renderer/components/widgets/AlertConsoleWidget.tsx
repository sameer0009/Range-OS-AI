import { Badge } from '@rangeos/ui';
import { AlertTriangle, ShieldAlert, Info } from 'lucide-react';
import { SecurityAlert } from '../../api/mockData';

export function AlertConsoleWidget({ alerts }: { alerts: SecurityAlert[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
        <ShieldAlert size={14} className="text-cyber-alert" /> Signal Intelligence Console
      </h2>

      <div className="bg-cyber-surface/30 border border-cyber-surface-elevated rounded-lg overflow-hidden backdrop-blur-sm">
        <div className="max-h-[300px] overflow-y-auto font-mono text-xs">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-cyber-surface/90 backdrop-blur z-10 border-b border-cyber-surface-elevated">
              <tr>
                <th className="p-3 text-gray-500 font-normal uppercase tracking-tighter">LVL</th>
                <th className="p-3 text-gray-500 font-normal uppercase tracking-tighter">SRC</th>
                <th className="p-3 text-gray-500 font-normal uppercase tracking-tighter">MSG</th>
                <th className="p-3 text-gray-500 font-normal uppercase tracking-tighter text-right">TIME</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-surface-elevated/30">
              {alerts.map(alert => (
                <tr key={alert.id} className="hover:bg-cyber-primary/5 transition-colors group">
                  <td className="p-3 align-top">
                    {alert.level === 'critical' ? (
                      <Badge variant="alert" glow size="sm">CRIT</Badge>
                    ) : alert.level === 'warn' ? (
                      <Badge variant="secondary" size="sm">WARN</Badge>
                    ) : (
                      <Badge variant="ghost" size="sm">INFO</Badge>
                    )}
                  </td>
                  <td className="p-3 align-top text-cyber-secondary font-bold opacity-80">{alert.source}</td>
                  <td className="p-3 align-top text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                    {alert.message}
                  </td>
                  <td className="p-3 align-top text-right text-gray-600 whitespace-nowrap">{alert.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-cyber-primary/5 p-2 text-center border-t border-cyber-surface-elevated/50">
          <button className="text-[10px] uppercase font-bold text-cyber-primary hover:text-white transition-colors tracking-widest">
            Access Full Event Logs →
          </button>
        </div>
      </div>
    </div>
  );
}
