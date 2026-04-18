import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainShell from './layouts/MainShell';
import SplashScreen from './views/SplashScreen';
import DashboardView from './views/DashboardView';
import LoginScreen from './views/LoginScreen';
import LabBuilderView from './views/LabBuilderView';
import TopologyView from './views/TopologyView';
import AIAssistantView from './views/AIAssistantView';
import ForensicsView from './views/ForensicsView';
import ReportsCenterView from './views/ReportsCenterView';
import RedWorkspaceView from './views/RedWorkspaceView';
import BlueWorkspaceView from './views/BlueWorkspaceView';
import SettingsView from './views/SettingsView';
import { OnboardingWizard } from './components/OnboardingWizard';
import { useOnboardingStore } from './store/OnboardingStore';


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
  const { firstBoot } = useOnboardingStore();
  const skipOnboarding = import.meta.env.VITE_SKIP_ONBOARDING === 'true';

  return (
    <HashRouter>
      {/* First-Boot Guard: renders wizard before any routing */}
      {firstBoot && !skipOnboarding && <OnboardingWizard />}
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        
        <Route path="/shell" element={<MainShell />}>

          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardView />} />
          <Route path="lab-builder" element={<LabBuilderView />} />
          <Route path="topology" element={<TopologyView />} />
          <Route path="red-workspace" element={<RedWorkspaceView />} />
          <Route path="blue-workspace" element={<BlueWorkspaceView />} />
          <Route path="forensics" element={<ForensicsView />} />
          <Route path="ai-assistant" element={<AIAssistantView />} />
          <Route path="reports" element={<ReportsCenterView />} />
          <Route path="policies" element={<PlaceholderView title="Policy Console" />} />
          <Route path="settings" element={<SettingsView />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
