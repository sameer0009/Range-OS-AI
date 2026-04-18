import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import TopStatusBar from './TopStatusBar';
import Sidebar from './Sidebar';
import { CommandPalette } from '../components/CommandPalette';
import { NotificationCenter } from '../components/NotificationCenter';
import { ToastContainer } from '../components/ToastContainer';
import { RangeOSThemeProvider } from '@rangeos/ui-core';
import { useNotificationStore } from '../store/NotificationStore';

// ── Service status dot helper ─────────────────────────────────────────────
const STATUS_COLOR: Record<string, string> = {
  HEALTHY:     'bg-emerald-500',
  DEGRADED:    'bg-yellow-500',
  OFFLINE:     'bg-red-500 animate-pulse',
  UNREACHABLE: 'bg-gray-600',
};

export default function MainShell() {
  const { serviceHealth, pollHealth } = useNotificationStore();

  // Start 15s polling loop on mount
  useEffect(() => {
    pollHealth();
    const interval = setInterval(pollHealth, 15_000);
    return () => clearInterval(interval);
  }, [pollHealth]);

  return (
    <RangeOSThemeProvider>
      <div className="flex flex-col h-screen w-screen bg-[#020617] text-gray-100 overflow-hidden font-sans">
        <CommandPalette />
        <ToastContainer />

        {/* OS Top Bar (Draggable) */}
        <div className="z-50">
          <TopStatusBar />
        </div>
        
        {/* Shell Body */}
        <div className="flex flex-1 overflow-hidden relative">
          <Sidebar />
          
          {/* Main Content Canvas */}
          <main className="flex-1 relative overflow-hidden flex flex-col">
            {/* Mission HUD Bar (Sub-Header) */}
            <div className="h-8 border-b border-white/5 bg-white/2px flex items-center px-4 justify-between">
              <div className="text-[10px] uppercase font-mono tracking-widest text-white/40">
                ACTIVE_MISSION: <span className="text-blue-400">RO_TACTICAL_AUTO_01</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-[10px] uppercase font-mono text-emerald-500 animate-pulse">GATEWAY_CONN: OPTIMAL</div>
                <NotificationCenter />
              </div>
            </div>

            <div className="flex-1 relative overflow-y-auto p-6 scroll-smooth bg-gradient-to-br from-[#020617] to-[#0f172a]">
              <Outlet />
            </div>

            {/* Footer Health Bar */}
            <div className="h-6 border-t border-white/5 bg-black/30 flex items-center px-4 gap-4">
              <span className="text-[9px] font-mono text-gray-700 uppercase tracking-widest mr-2">SERVICE MESH</span>
              {serviceHealth.map(svc => (
                <div key={svc.id} className="flex items-center gap-1.5 group relative">
                  <div className={`w-1.5 h-1.5 rounded-full ${STATUS_COLOR[svc.status] ?? 'bg-gray-600'}`} />
                  <span className={`text-[9px] font-mono uppercase ${svc.status === 'HEALTHY' ? 'text-gray-600' : svc.status === 'DEGRADED' ? 'text-yellow-600' : 'text-red-600'}`}>
                    {svc.name}
                  </span>
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-5 left-0 z-50 hidden group-hover:flex bg-[#0a0f1e] border border-white/10 rounded px-2 py-1 text-[9px] font-mono whitespace-nowrap text-gray-300 shadow-xl">
                    {svc.status} · {svc.latency_ms}ms
                    {svc.error_detail && <> · {svc.error_detail}</>}
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </RangeOSThemeProvider>
  );
}
