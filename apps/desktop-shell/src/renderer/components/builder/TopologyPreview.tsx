import { TopologyNode, Card } from '@rangeos/ui';
import { Network } from 'lucide-react';

interface Node {
  id: string;
  type: 'server' | 'workstation' | 'router';
  label: string;
}

export function TopologyPreview({ nodes }: { nodes: Node[] }) {
  return (
    <div className="space-y-4 h-full flex flex-col">
      <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
        <Network size={14} className="text-cyber-secondary" /> Topology Synthesis Preview
      </h2>

      <Card className="flex-1 min-h-[400px] relative bg-cyber-background/50 flex items-center justify-center overflow-hidden border-dashed">
        {/* Background Grid Accent */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#00E5FF_1px,transparent_1px)] [background-size:30px_30px]"></div>

        {nodes.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 relative z-10 transition-all duration-1000 animate-in fade-in zoom-in">
            {nodes.map((node) => (
              <TopologyNode 
                key={node.id} 
                label={node.label} 
                type={node.type} 
                status="idle"
              />
            ))}
            
            {/* Visual SVG Links Connector Placeholder */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
               <line x1="20%" y1="20%" x2="80%" y2="80%" stroke="currentColor" strokeWidth="1" className="text-cyber-primary" />
               <line x1="80%" y1="20%" x2="20%" y2="80%" stroke="currentColor" strokeWidth="1" className="text-cyber-primary" />
            </svg>
          </div>
        ) : (
          <div className="text-center space-y-4">
             <div className="w-16 h-16 border-2 border-dashed border-gray-800 rounded-full mx-auto flex items-center justify-center text-gray-800">
                <Network size={32} />
             </div>
             <p className="font-mono text-[10px] text-gray-600 uppercase tracking-[0.2em]">Select a blueprint or use the forge to begin synthesis</p>
          </div>
        )}

        <div className="absolute bottom-4 left-4 flex gap-4 text-[9px] font-mono text-gray-700">
           <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-cyber-primary" /> Target Cluster</span>
           <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-cyber-secondary" /> Virtual Gateway</span>
        </div>
      </Card>
    </div>
  );
}
