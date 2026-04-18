import { Card, Badge } from '@rangeos/ui';
import { Layout, Server, Shield, Globe } from 'lucide-react';

const BLUEPRINTS = [
  { id: 'bp-1', name: 'AD Domain Range', nodes: 6, difficulty: 'Intermediate', icon: <Server size={20} /> },
  { id: 'bp-2', name: 'DMZ Perimeter', nodes: 4, difficulty: 'Advanced', icon: <Shield size={20} /> },
  { id: 'bp-3', name: 'Cloud Hybrid Hub', nodes: 12, difficulty: 'Expert', icon: <Globe size={20} /> },
  { id: 'bp-4', name: 'Malware Sandbox', nodes: 2, difficulty: 'Novice', icon: <Layout size={20} /> },
];

export function BlueprintBrowser({ 
  selectedId, 
  onSelect 
}: { 
  selectedId?: string, 
  onSelect: (id: string) => void 
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {BLUEPRINTS.map((bp) => (
        <Card 
          key={bp.id}
          onClick={() => onSelect(bp.id)}
          className={`cursor-pointer transition-all border-2 ${
            selectedId === bp.id 
              ? 'border-cyber-primary bg-cyber-primary/5 shadow-glow-primary' 
              : 'border-cyber-surface-elevated hover:border-cyber-primary/40'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${selectedId === bp.id ? 'bg-cyber-primary/20 text-cyber-primary' : 'bg-cyber-surface text-gray-400'}`}>
              {bp.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-mono font-bold text-sm text-white uppercase">{bp.name}</h3>
              <div className="flex gap-2 mt-2">
                <Badge variant="ghost" size="sm">{bp.nodes} Nodes</Badge>
                <Badge variant={bp.difficulty === 'Expert' ? 'alert' : 'secondary'} size="sm">{bp.difficulty}</Badge>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
