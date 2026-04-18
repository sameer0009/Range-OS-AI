import { useState, useRef, useEffect } from 'react';
import { TopologyNode, Card, Badge } from '@rangeos/ui';
import { Search, Filter, Shield, Activity, Zap, Maximize, MousePointer2 } from 'lucide-react';
import { ZoneWrapper } from '../components/topology/ZoneWrapper';
import { LinkLayer } from '../components/topology/LinkLayer';
import { InspectorPanel } from '../components/topology/InspectorPanel';

const MOCK_NODES = [
  { id: 'kali-01', label: 'Kali Attacker', type: 'workstation', zone: 'RED', status: 'active', ip: '10.0.1.5' },
  { id: 'router-01', label: 'Core Gateway', type: 'router', zone: 'BLUE', status: 'loading', ip: '172.16.0.1' },
  { id: 'srv-dc', label: 'Domain Master', type: 'server', zone: 'TARGET', status: 'alert', ip: '10.0.2.100' },
  { id: 'wrk-01', label: 'Finance Desktop', type: 'workstation', zone: 'TARGET', status: 'active', ip: '10.0.2.22' },
  { id: 'vault-01', label: 'Evidence Hub', type: 'server', zone: 'EVIDENCE', status: 'active', ip: '192.168.99.1' },
];

const MOCK_LINKS: any[] = [
  { from: 'kali-01', to: 'router-01', status: 'active' },
  { from: 'router-01', to: 'srv-dc', status: 'active' },
  { from: 'router-01', to: 'wrk-01', status: 'idle' },
  { from: 'srv-dc', to: 'vault-01', status: 'idle' },
];

export default function TopologyView() {
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number, y: number }>>({});

  // Calculate node positions for the SVG link layer
  useEffect(() => {
    const updatePositions = () => {
      const positions: Record<string, { x: number, y: number }> = {};
      MOCK_NODES.forEach(node => {
        const el = document.getElementById(`node-${node.id}`);
        if (el && containerRef.current) {
          const rect = el.getBoundingClientRect();
          const containerRect = containerRef.current.getBoundingClientRect();
          positions[node.id] = {
            x: rect.left + rect.width / 2 - containerRect.left,
            y: rect.top + rect.height / 2 - containerRect.top
          };
        }
      });
      setNodePositions(positions);
    };

    updatePositions();
    window.addEventListener('resize', updatePositions);
    return () => window.removeEventListener('resize', updatePositions);
  }, []);

  const renderZoneNodes = (zone: string) => (
    <div className="flex flex-wrap gap-12 justify-center">
      {MOCK_NODES.filter(n => n.zone === zone).map(node => (
        <div 
          key={node.id} 
          id={`node-${node.id}`} 
          className="transition-transform hover:scale-110 active:scale-95 duration-200"
          onClick={() => setSelectedNode(node)}
        >
          <TopologyNode 
            label={node.label} 
            type={node.type as any} 
            status={node.status as any} 
            ip={node.ip}
            className={selectedNode?.id === node.id ? 'ring-2 ring-cyber-primary ring-offset-4 ring-offset-cyber-background rounded-lg' : ''}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full relative" ref={containerRef}>
      
      {/* Command Bar */}
      <div className="flex items-center justify-between p-4 border-b border-cyber-surface-elevated bg-cyber-background/50 backdrop-blur-sm z-30">
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 text-cyber-primary font-mono text-xs uppercase tracking-[0.3em]">
              <Maximize size={14} /> Battle Map Navigation
           </div>
           <div className="flex gap-2">
              {['RED', 'BLUE', 'TARGET', 'EVIDENCE'].map(zone => (
                <button 
                  key={zone}
                  onClick={() => setActiveZone(activeZone === zone ? null : zone)}
                  className={`px-3 py-1 rounded font-mono text-[9px] font-bold uppercase border transition-all ${
                    activeZone === zone ? 'bg-cyber-primary text-black border-cyber-primary' : 'text-gray-500 border-cyber-surface-elevated hover:text-white'
                  }`}
                >
                  {zone}
                </button>
              ))}
           </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 bg-cyber-surface px-3 py-1.5 rounded-full border border-cyber-surface-elevated">
              <Search size={14} className="text-gray-500" />
              <input 
                placeholder="Search resources..." 
                className="bg-transparent border-none focus:ring-0 text-[10px] font-mono text-white w-32"
              />
           </div>
           <Button variant="ghost" size="sm" className="px-2">
              <Filter size={16} />
           </Button>
        </div>
      </div>

      {/* Main Command Workspace */}
      <div className="flex-1 relative overflow-hidden bg-cyber-background select-none">
        
        {/* Background Grid Mesh */}
        <div className="absolute inset-0 z-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <LinkLayer links={MOCK_LINKS} nodePositions={nodePositions} />

        <div className="grid grid-cols-2 grid-rows-2 h-full gap-4 p-8 relative z-10 p-20">
           <ZoneWrapper id="RED" title="RED_ENCLAVE" className={activeZone && activeZone !== 'RED' ? 'opacity-20 blur-[1px]' : ''}>
              {renderZoneNodes('RED')}
           </ZoneWrapper>
           <ZoneWrapper id="BLUE" title="BLUE_SECURITY" className={activeZone && activeZone !== 'BLUE' ? 'opacity-20 blur-[1px]' : ''}>
              {renderZoneNodes('BLUE')}
           </ZoneWrapper>
           <ZoneWrapper id="TARGET" title="TARGET_INFRA" className={activeZone && activeZone !== 'TARGET' ? 'opacity-20 blur-[1px]' : ''}>
              {renderZoneNodes('TARGET')}
           </ZoneWrapper>
           <ZoneWrapper id="EVIDENCE" title="IMMUTABLE_VAULT" className={activeZone && activeZone !== 'EVIDENCE' ? 'opacity-20 blur-[1px]' : ''}>
              {renderZoneNodes('EVIDENCE')}
           </ZoneWrapper>
        </div>

        {/* Floating Legends */}
        <div className="absolute top-10 right-10 flex flex-col gap-2 z-20">
           <Card className="py-2 px-4 border-cyber-surface-elevated bg-cyber-background/80">
              <div className="flex items-center gap-4 text-[9px] font-mono font-bold text-gray-500">
                 <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cyber-primary" /> ACTIVE</div>
                 <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cyber-alert animate-pulse" /> ALERT</div>
                 <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gray-600" /> IDLE</div>
              </div>
           </Card>
        </div>

        {/* Global Action HUD Overlay (Centered bottom above inspector) */}
        {!selectedNode && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-20">
             <div className="px-6 py-2 bg-cyber-primary/10 border border-cyber-primary/30 backdrop-blur rounded-full flex items-center gap-3">
                <MousePointer2 size={14} className="text-cyber-primary" />
                <span className="text-[10px] font-mono font-bold text-cyber-primary uppercase tracking-widest italic">Target node for deep inspection</span>
             </div>
          </div>
        )}
      </div>

      <InspectorPanel selectedNode={selectedNode} onClose={() => setSelectedNode(null)} />
    </div>
  );
}
