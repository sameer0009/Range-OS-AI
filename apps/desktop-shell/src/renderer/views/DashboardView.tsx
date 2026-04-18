import { useEffect, useState } from 'react';
import { StatusHeader } from '../components/widgets/StatusHeader';
import { LabGalleryWidget } from '../components/widgets/LabGalleryWidget';
import { AlertConsoleWidget } from '../components/widgets/AlertConsoleWidget';
import { AISuggestionWidget } from '../components/widgets/AISuggestionWidget';
import { EvidenceSummaryWidget } from '../components/widgets/EvidenceSummaryWidget';
import { getDashboardData, DashboardData } from '../api/mockData';
import { Card } from '@rangeos/ui';

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

          {/* Asset Integration Card preserved but styled into the bento */}
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2 mb-4">
               <span className="w-2 h-2 rounded-full bg-cyber-primary" /> Integrated Combat Modules
            </h2>
            <Card className="p-0 overflow-hidden bg-cyber-surface/30 border-dashed border-cyber-surface-elevated">
              <div className="flex flex-col md:flex-row items-center gap-8 p-6">
                <img 
                  src="../renderer/assets/module-grid.png" 
                  alt="System Modules" 
                  className="w-full max-w-sm h-auto opacity-70 hover:opacity-100 transition-opacity rounded-lg"
                />
                <div className="space-y-4 flex-1">
                  <h3 className="text-lg font-mono font-bold text-white uppercase">Neural Link Status</h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-mono">
                    All range controllers are operating within predicted efficiency parameters. AI core is successfully intercepting 99.4% of synthetic red-team evasion attempts.
                  </p>
                </div>
              </div>
            </Card>
          </section>
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
