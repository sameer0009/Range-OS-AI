import { useEffect, useState } from 'react';
import { StatusHeader } from '../components/widgets/StatusHeader';
import { LabGalleryWidget } from '../components/widgets/LabGalleryWidget';
import { AlertConsoleWidget } from '../components/widgets/AlertConsoleWidget';
import { AISuggestionWidget } from '../components/widgets/AISuggestionWidget';
import { EvidenceSummaryWidget } from '../components/widgets/EvidenceSummaryWidget';
import { getDashboardData, DashboardData } from '../api/mockData';
import { Card } from '@rangeos/ui';

// Import SVG assets
import aiCoreIcon from '../assets/icons/ai-core.svg';
import threatIntelIcon from '../assets/icons/threat-intel.svg';
import pentestLabIcon from '../assets/icons/pentest-lab.svg';
import networkMapperIcon from '../assets/icons/network-mapper.svg';
import forensicsIcon from '../assets/icons/forensics.svg';
import policyEngineIcon from '../assets/icons/policy-engine.svg';
import secureBrowserIcon from '../assets/icons/secure-browser.svg';

export default function DashboardView() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const dashboardData = await getDashboardData();
      setData(dashboardData);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center space-y-4 animate-pulse">
        <div className="w-12 h-12 rounded-full border-2 border-cyber-primary border-t-transparent animate-spin" />
        <p className="font-mono text-xs text-cyber-primary uppercase tracking-[0.3em]">Synching with AI Core...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex flex-col min-h-full max-w-[1600px] mx-auto p-2">
      <StatusHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-10">
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <LabGalleryWidget labs={data.labs} />
          </section>

          <section className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <AlertConsoleWidget alerts={data.alerts} />
          </section>

          {/* Module Overview (Asset Integration) */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-cyber-primary" /> Integrated Combat Modules
            </h2>
            <Card className="bg-cyber-surface/30 border-dashed border-cyber-surface-elevated">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 p-4">
                {[
                  { icon: aiCoreIcon, label: 'AI Core' },
                  { icon: threatIntelIcon, label: 'Intelligence' },
                  { icon: pentestLabIcon, label: 'Neural Forge' },
                  { icon: networkMapperIcon, label: 'Topology' },
                  { icon: forensicsIcon, label: 'Forensics' },
                  { icon: policyEngineIcon, label: 'Policy' },
                  { icon: secureBrowserIcon, label: 'Safe Link' },
                ].map((mod, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 group cursor-pointer">
                    <div 
                      className="w-10 h-10 bg-cyber-primary group-hover:bg-white transition-all duration-300 shadow-glow-primary group-hover:shadow-glow-white"
                      style={{
                        maskImage: `url(${mod.icon})`,
                        maskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        maskSize: 'contain',
                        WebkitMaskImage: `url(${mod.icon})`,
                      }}
                    />
                    <span className="text-[10px] font-mono text-gray-500 group-hover:text-white transition-colors uppercase tracking-tighter text-center">
                      {mod.label}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-10">
          <section className="animate-in fade-in slide-in-from-right-4 duration-500">
            <AISuggestionWidget suggestions={data.suggestions} />
          </section>

          <section className="animate-in fade-in slide-in-from-right-6 duration-700">
            <EvidenceSummaryWidget cases={data.evidence} />
          </section>

          {/* Upcoming Approvals Placeholder */}
          <section className="animate-in fade-in slide-in-from-right-8 duration-1000">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2 mb-4">
              Access Control Queue
            </h2>
            <div className="p-8 border border-dashed border-cyber-surface-elevated rounded-lg flex flex-col items-center justify-center text-center space-y-2 group cursor-pointer hover:border-cyber-primary/50 transition-colors">
              <div className="text-gray-600 group-hover:text-cyber-primary transition-colors">
                No pending policy overrides
              </div>
              <p className="text-[10px] font-mono text-gray-700">All student actions currently within bounds</p>
            </div>
          </section>
        </div>

      </div>
      
      {/* Global Footer Ticker */}
      <footer className="mt-auto pt-10 pb-4">
         <div className="bg-cyber-surface/50 border-t border-cyber-surface-elevated p-2 rounded-t-lg">
            <div className="flex items-center gap-4 text-[9px] font-mono whitespace-nowrap overflow-hidden">
               <span className="text-cyber-primary font-bold">[SYS/LOG]</span>
               <div className="flex gap-8 animate-marquee">
                  <span className="text-gray-500">IDENTITY_SVC: HEARTBEAT_ACK</span>
                  <span className="text-gray-500">LAB_SVC: POLLING_HYPERVISOR_STATUS_0x291</span>
                  <span className="text-gray-500">POLICY_SVC: ENFORCEMENT_ACTIVE_DETERMINISTIC</span>
                  <span className="text-gray-500">GW_SVC: REQUEST_TRACE_b7f65156b6051570</span>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}
