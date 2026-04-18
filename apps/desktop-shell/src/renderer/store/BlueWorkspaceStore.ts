import { create } from 'zustand';

interface Alert {
  id: string;
  timestamp: string;
  severity: 'CRITICAL' | 'HIGH' | 'LOW';
  title: string;
  technique: string;
  nodeId: string;
  status: 'OPEN' | 'TRIAGED';
}

interface BlueWorkspaceState {
  activeAlert: Alert | null;
  alerts: Alert[];
  globalSeverity: number;
  setActiveAlert: (alert: Alert | null) => void;
  resolveAlert: (id: string) => void;
  updateSeverity: (val: number) => void;
}

export const useBlueWorkspaceStore = create<BlueWorkspaceState>((set) => ({
  activeAlert: null,
  alerts: [
    { 
      id: 'ALT-42', 
      timestamp: '22:18:01', 
      severity: 'CRITICAL', 
      title: 'Unauthorized PowerShell Execution', 
      technique: 'T1059.001', 
      nodeId: 'UBUNTU-JUICE',
      status: 'OPEN'
    },
    { 
      id: 'ALT-45', 
      timestamp: '22:20:15', 
      severity: 'HIGH', 
      title: 'LDAP Brute Force Attempt', 
      technique: 'T1110', 
      nodeId: 'DC-CORE',
      status: 'OPEN'
    }
  ],
  globalSeverity: 68,
  setActiveAlert: (alert) => set({ activeAlert: alert }),
  resolveAlert: (id) => set((state) => ({
    alerts: state.alerts.map(a => a.id === id ? { ...a, status: 'TRIAGED' } : a)
  })),
  updateSeverity: (val) => set({ globalSeverity: val })
}));
