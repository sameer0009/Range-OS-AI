import { create } from 'zustand';

interface ForensicCase {
  id: string;
  title: string;
  status: string;
  investigator: string;
}

interface EvidenceItem {
  id: string;
  name: string;
  type: string;
  sourceNode: string;
  size: string;
  is_verified: boolean;
}

interface ForensicsState {
  cases: ForensicCase[];
  activeCase: ForensicCase | null;
  evidence: EvidenceItem[];
  setActiveCase: (caseObj: ForensicCase | null) => void;
  setEvidence: (items: EvidenceItem[]) => void;
  updateEvidenceStatus: (id: string, is_verified: boolean) => void;
  fetchCases: () => Promise<void>;
}

export const useForensicsStore = create<ForensicsState>((set) => ({
  cases: [],
  activeCase: {
    id: 'CAS-2026-0042',
    title: 'Lateral Movement - Subnet B',
    status: 'ACTIVE',
    investigator: 'ROOT_ADMIN'
  },
  evidence: [
    { id: '1', name: 'srv-dc-mem.raw', type: 'Memory', sourceNode: 'SRV-DC', size: '16GB', is_verified: true },
    { id: '2', name: 'edge-router.pcap', type: 'Network', sourceNode: 'ROUTER-01', size: '512MB', is_verified: true },
    { id: '3', name: 'wk-finance-04.vhdx', type: 'Disk', sourceNode: 'WK-FIN-04', size: '120GB', is_verified: false },
  ],
  setActiveCase: (caseObj) => set({ activeCase: caseObj }),
  setEvidence: (items) => set({ evidence: items }),
  updateEvidenceStatus: (id, is_verified) => set((state) => ({
    evidence: state.evidence.map(e => e.id === id ? { ...e, is_verified } : e)
  })),
  fetchCases: async () => {
    // Integration logic would happen here
    // const response = await fetch('/v1/cases');
  }
}));
