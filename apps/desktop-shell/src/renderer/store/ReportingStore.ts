import { create } from 'zustand';

interface ReportManifest {
  id: string;
  title: string;
  type: string;
  status: string;
  author: string;
  version: string;
  date: string;
}

interface ReportingState {
  reports: ReportManifest[];
  selectedReportId: string | null;
  isSaving: boolean;
  setReports: (items: ReportManifest[]) => void;
  selectReport: (id: string | null) => void;
  setSaving: (val: boolean) => void;
  finalizeReport: (id: string) => void;
  fetchReports: () => Promise<void>;
}

export const useReportingStore = create<ReportingState>((set) => ({
  reports: [
    {
      id: 'REP-001',
      title: "Post-Incident Analysis: Subnet B Breach",
      type: "INCIDENT",
      status: "FINALIZED",
      author: "ROOT_ADMIN",
      version: "1.2.0",
      date: "2026-04-18"
    },
    {
      id: 'REP-002',
      title: "Quarterly Pentest: Finance Segment",
      type: "PENTEST",
      status: "DRAFT",
      author: "SEC_ENG_01",
      version: "0.8.4",
      date: "2026-04-15"
    }
  ],
  selectedReportId: 'REP-001',
  isSaving: false,
  setReports: (items) => set({ reports: items }),
  selectReport: (id) => set({ selectedReportId: id }),
  setSaving: (val) => set({ isSaving: val }),
  finalizeReport: (id) => set((state) => ({
    reports: state.reports.map(r => r.id === id ? { ...r, status: 'FINALIZED' } : r)
  })),
  fetchReports: async () => {
    // Integration logic for v1/reports
  }
}));
