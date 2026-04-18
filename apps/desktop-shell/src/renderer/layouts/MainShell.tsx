import { Outlet } from 'react-router-dom';
import TopStatusBar from './TopStatusBar';
import Sidebar from './Sidebar';

export default function MainShell() {
  return (
    <div className="flex flex-col h-screen w-screen bg-cyber-background text-gray-100 overflow-hidden">
      {/* OS Top Bar (Draggable) */}
      <TopStatusBar />
      
      {/* Shell Body */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        
        {/* Main Content Canvas */}
        <main className="flex-1 relative overflow-hidden bg-cyber-background">
          <div className="absolute inset-0 overflow-y-auto p-6 scroll-smooth">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
