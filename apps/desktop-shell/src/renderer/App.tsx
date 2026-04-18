import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainShell from './layouts/MainShell';
import SplashScreen from './views/SplashScreen';
import DashboardView from './views/DashboardView';
import LoginScreen from './views/LoginScreen';
import LabBuilderView from './views/LabBuilderView';
import TopologyView from './views/TopologyView';
import AIAssistantView from './views/AIAssistantView';
import ForensicsView from './views/ForensicsView';


// Placeholders for views
const PlaceholderView = ({ title }: { title: string }) => (
  <div className="flex h-full w-full items-center justify-center">
    <div className="text-center p-8 glass-panel cyber-border rounded-lg max-w-lg">
      <h2 className="text-3xl font-mono text-cyber-primary mb-4">{title}</h2>
      <p className="text-gray-400">This module is under construction.</p>
    </div>
  </div>
);

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        
        <Route path="/shell" element={<MainShell />}>

          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardView />} />
          <Route path="lab-builder" element={<LabBuilderView />} />
          <Route path="topology" element={<TopologyView />} />
          <Route path="red-workspace" element={<PlaceholderView title="Offensive Security (Red Team)" />} />
          <Route path="blue-workspace" element={<PlaceholderView title="Defensive Security (Blue Team)" />} />
          <Route path="forensics" element={<ForensicsView />} />
          <Route path="ai-assistant" element={<AIAssistantView />} />
          <Route path="reports" element={<PlaceholderView title="Reports Center" />} />
          <Route path="policies" element={<PlaceholderView title="Policy Console" />} />
          <Route path="settings" element={<PlaceholderView title="Platform Settings" />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
