import { create } from 'zustand';

interface Objective {
    id: string;
    title: string;
    completed: boolean;
}

interface Finding {
    id: string;
    title: string;
    timestamp: string;
}

interface RedWorkspaceState {
    missionId: string | null;
    activeNodeId: string | null;
    objectives: Objective[];
    findings: Finding[];
    intelStream: string[];
    isPolicyViolated: boolean;
    setMission: (id: string) => void;
    addFinding: (title: string) => void;
    toggleObjective: (id: string) => void;
    pushIntel: (msg: string) => void;
}

export const useRedWorkspaceStore = create<RedWorkspaceState>((set) => ({
    missionId: null,
    activeNodeId: null,
    objectives: [
        { id: '1', title: 'Network Reconnaissance', completed: false },
        { id: '2', title: 'Credential Extraction', completed: false },
        { id: '3', title: 'Database Exfiltration', completed: false },
    ],
    findings: [],
    intelStream: [
        '[SYSTEM] Red Workspace Initialized',
        '[INTEL] Established secure tunnel to Kali-Red-01',
    ],
    isPolicyViolated: false,
    setMission: (id) => set({ missionId: id }),
    addFinding: (title) => set((state) => ({ 
        findings: [...state.findings, { id: Math.random().toString(), title, timestamp: new Date().toLocaleTimeString() }] 
    })),
    toggleObjective: (id) => set((state) => ({
        objectives: state.objectives.map(obj => obj.id === id ? { ...obj, completed: !obj.completed } : obj)
    })),
    pushIntel: (msg) => set((state) => ({
        intelStream: [msg, ...state.intelStream].slice(0, 50)
    })),
}));
