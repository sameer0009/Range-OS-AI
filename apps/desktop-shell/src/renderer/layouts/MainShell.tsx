import { Outlet } from 'react-router-dom';
import TopStatusBar from './TopStatusBar';
import Sidebar from './Sidebar';
import { CommandPalette } from '../components/CommandPalette';
import { RangeOSThemeProvider } from '@rangeos/ui-core';

export default function MainShell() {
  return (
    <RangeOSThemeProvider>
      <div className="flex flex-col h-screen w-screen bg-[#020617] text-gray-100 overflow-hidden font-sans">
        <CommandPalette />
        
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
              <div className="flex gap-4">
                 <div className="text-[10px] uppercase font-mono text-emerald-500 animate-pulse">GATEWAY_CONN: OPTIMAL</div>
              </div>
            </div>

            <div className="flex-1 relative overflow-y-auto p-6 scroll-smooth bg-gradient-to-br from-[#020617] to-[#0f172a]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </RangeOSThemeProvider>
  );
}
