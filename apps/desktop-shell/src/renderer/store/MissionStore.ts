import { create } from 'zustand';

interface MissionState {
  activeLabId: string | null;
  activeCaseId: string | null;
  activeReportId: string | null;
  missionContext: 'IDLE' | 'LAB_BUILD' | 'OPS' | 'FORENSICS' | 'REPORTING';
  
  setActiveLab: (id: string | null) => void;
  setActiveCase: (id: string | null) => void;
  setMissionContext: (context: MissionState['missionContext']) => void;
}

export const useMissionStore = create<MissionState>((set) => ({
  activeLabId: null,
  activeCaseId: null,
  activeReportId: null,
  missionContext: 'IDLE',

  setActiveLab: (id) => set({ activeLabId: id, missionContext: id ? 'OPS' : 'IDLE' }),
  setActiveCase: (id) => set({ activeCaseId: id, missionContext: id ? 'FORENSICS' : 'IDLE' }),
  setMissionContext: (context) => set({ missionContext: context }),
}));
