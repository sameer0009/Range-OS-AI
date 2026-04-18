import { Card, Badge, Button } from '@rangeos/ui';
import { Box, Play, Square, Activity, Clock } from 'lucide-react';
import { LabInstance } from '../../api/mockData';

export function LabGalleryWidget({ labs }: { labs: LabInstance[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
          <Box size={14} className="text-cyber-primary" /> Active Deployments
        </h2>
        <Badge variant="secondary">{labs.length} Nodes Online</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {labs.map(lab => (
          <Card key={lab.id} className="relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-1 h-full ${
              lab.status === 'running' ? 'bg-cyber-success' : 
              lab.status === 'deploying' ? 'bg-cyber-primary animate-pulse' : 
              'bg-gray-600'
            }`} />
            
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-mono font-bold text-white uppercase tracking-tight">{lab.name}</h3>
                  <p className="text-[10px] font-mono text-gray-500 uppercase">{lab.template}</p>
                </div>
                {lab.status === 'running' ? (
                  <Activity size={16} className="text-cyber-success animate-pulse" />
                ) : (
                  <Clock size={16} className="text-gray-600" />
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono">
                <div className="flex flex-col">
                  <span className="text-gray-500">NODES</span>
                  <span className="text-gray-300">{lab.nodes}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-gray-500">UPTIME</span>
                  <span className="text-gray-300">{lab.uptime}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-cyber-surface-elevated/50">
                <Button size="sm" variant={lab.status === 'running' ? 'ghost' : 'primary'} className="flex-1 text-[10px]">
                  {lab.status === 'running' ? <Square size={12} className="mr-2" /> : <Play size={12} className="mr-2" />}
                  {lab.status === 'running' ? 'TERMINATE' : 'INITIALIZE'}
                </Button>
                <Button size="sm" variant="ghost" className="px-3">
                  <Activity size={12} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
