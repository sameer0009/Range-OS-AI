import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hammer, ShieldCheck, AlertCircle, Save, Rocket, Trash2 } from 'lucide-react';
import { Button, Badge, Card } from '@rangeos/ui';
import { BlueprintBrowser } from '../components/builder/BlueprintBrowser';
import { NeuralForge } from '../components/builder/NeuralForge';
import { TopologyPreview } from '../components/builder/TopologyPreview';

export default function LabBuilderView() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'blueprint' | 'forge'>('blueprint');
  const [selectedId, setSelectedId] = useState<string>();
  const [nodes, setNodes] = useState<any[]>([]);
  const [isValidated, setValidated] = useState(false);

  // Mock Synthesis Logic
  const handleSynthesize = (val: string) => {
    setValidated(false);
    // Simple mock logic for different topologies
    if (val.toLowerCase().includes('windows')) {
      setNodes([
        { id: '1', type: 'server', label: 'WIN-DC-01' },
        { id: '2', type: 'workstation', label: 'WIN-WK-01' },
        { id: '3', type: 'router', label: 'V-GATEWAY' }
      ]);
    } else {
      setNodes([
        { id: '1', type: 'server', label: 'LINUX-SRV-01' },
        { id: '2', type: 'workstation', label: 'KALI-OPERATOR' },
        { id: '3', type: 'router', label: 'LAB-GW' },
        { id: '4', type: 'server', label: 'DATA-STORE' }
      ]);
    }
  };

  const handleSelectBlueprint = (id: string) => {
    setSelectedId(id);
    setValidated(false);
    // Mock blueprint data
    setNodes([
      { id: '1', type: 'server', label: 'DC-CORE' },
      { id: '2', type: 'server', label: 'WEB-SRV' },
      { id: '3', type: 'router', label: 'EDGE' }
    ]);
  };

  return (
    <div className="flex flex-col h-full max-w-[1600px] mx-auto p-2 space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-cyber-surface-elevated pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyber-primary font-mono text-xs uppercase tracking-[0.3em] mb-1">
            <Hammer size={14} /> Strategic Lab Synthesis
          </div>
          <h1 className="text-3xl font-mono font-bold text-white tracking-tight uppercase">Neural Forge</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => navigate('/shell/dashboard')}>Discard Draft</Button>
          <Button variant={isValidated ? 'primary' : 'ghost'} onClick={() => setValidated(true)}>
            {isValidated ? 'Validation Successful' : 'Pre-flight Validation'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 overflow-hidden">
        
        {/* Left Column: Generation Controls (5/12) */}
        <div className="lg:col-span-5 space-y-8 overflow-y-auto pr-2">
          
          <section className="space-y-4">
             <div className="flex bg-cyber-surface/50 p-1 rounded-lg border border-cyber-surface-elevated">
                <button 
                  onClick={() => setMode('blueprint')}
                  className={`flex-1 py-2 font-mono text-[11px] font-bold rounded transition-all ${mode === 'blueprint' ? 'bg-cyber-primary text-black' : 'text-gray-500 hover:text-white'}`}
                >
                  BLUEPRINT BROWSER
                </button>
                <button 
                  onClick={() => setMode('forge')}
                  className={`flex-1 py-2 font-mono text-[11px] font-bold rounded transition-all ${mode === 'forge' ? 'bg-cyber-primary text-black' : 'text-gray-500 hover:text-white'}`}
                >
                  NEURAL FORGE (AI)
                </button>
             </div>

             {mode === 'blueprint' ? (
                <BlueprintBrowser selectedId={selectedId} onSelect={handleSelectBlueprint} />
             ) : (
                <NeuralForge onSynthesize={handleSynthesize} />
             )}
          </section>

          <section className="space-y-4">
            <h3 className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest px-1">Synthesis Parameters</h3>
            <Card className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                  <label className="text-[9px] font-mono text-gray-400 uppercase">Target Difficulty</label>
                  <select className="w-full bg-cyber-background border border-cyber-surface-elevated rounded px-2 py-1.5 font-mono text-xs text-cyber-secondary focus:border-cyber-primary outline-none">
                     <option>INTERMEDIATE</option>
                     <option>NOVICE</option>
                     <option>EXPERT</option>
                     <option>BLACK_HAT</option>
                  </select>
               </div>
               <div className="space-y-1">
                  <label className="text-[9px] font-mono text-gray-400 uppercase">Policy Profile</label>
                  <select className="w-full bg-cyber-background border border-cyber-surface-elevated rounded px-2 py-1.5 font-mono text-xs text-cyber-primary focus:border-cyber-primary outline-none">
                     <option>STANDARD_QUOTA</option>
                     <option>STUDENT_ISOLATION</option>
                     <option>HIGH_TRUST_ADMIN</option>
                  </select>
               </div>
            </Card>
          </section>

          <section className="bg-cyber-primary/5 border border-cyber-primary/20 p-4 rounded-lg space-y-3">
             <div className="flex items-center gap-2 text-cyber-primary text-xs font-bold font-mono">
                <ShieldCheck size={14} /> DEPLOYMENT SUMMARY
             </div>
             <div className="grid grid-cols-2 gap-y-2 text-[10px] font-mono">
                <span className="text-gray-500">EST. NODES</span>
                <span className="text-white text-right">{nodes.length} VM(S)</span>
                <span className="text-gray-500">BOOT LATENCY</span>
                <span className="text-white text-right">~140 SECONDS</span>
                <span className="text-gray-500">RESOURCE TAX</span>
                <span className="text-white text-right">18.4% CPU / 12GB RAM</span>
             </div>
             <Button variant="primary" className="w-full mt-2 group py-4" disabled={!nodes.length}>
                <Rocket size={16} className="mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                DEPLOY LAB ENVIRONMENT
             </Button>
          </section>
        </div>

        {/* Right Column: Visualization (7/12) */}
        <div className="lg:col-span-7 h-full">
           <TopologyPreview nodes={nodes} />
        </div>

      </div>

      {/* Persistence Bar */}
      <footer className="py-4 border-t border-cyber-surface-elevated flex justify-between items-center text-[10px] font-mono">
         <div className="flex gap-6">
            <span className="text-gray-600">DRAFT_ID: UNTITLED_EXP_72B</span>
            <span className="text-gray-600">LAST_SYNTH: {nodes.length > 0 ? new Date().toLocaleTimeString() : 'IDLE'}</span>
         </div>
         <div className="flex gap-4">
            <button className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors">
               <Save size={12} /> SAVE DRAFT
            </button>
            <button className="flex items-center gap-2 text-gray-500 hover:text-cyber-alert transition-colors" onClick={() => setNodes([])}>
               <Trash2 size={12} /> CLEAR CANVAS
            </button>
         </div>
      </footer>
    </div>
  );
}
