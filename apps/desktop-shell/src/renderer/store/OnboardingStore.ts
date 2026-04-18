import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OnboardingStep =
  | 'welcome'
  | 'system-check'
  | 'admin-setup'
  | 'service-init'
  | 'policy-profile'
  | 'sample-lab'
  | 'theme-preview'
  | 'ready';

export const STEP_ORDER: OnboardingStep[] = [
  'welcome', 'system-check', 'admin-setup', 'service-init',
  'policy-profile', 'sample-lab', 'theme-preview', 'ready',
];

export type CheckStatus = 'pending' | 'ok' | 'warn' | 'fail';

export interface SystemCheck {
  id: string;
  label: string;
  status: CheckStatus;
  detail?: string;
}

export interface OnboardingState {
  firstBoot: boolean;
  currentStep: OnboardingStep;
  systemChecks: SystemCheck[];
  adminAccount: { username: string; email: string } | null;
  selectedPolicy: string;
  selectedTheme: string;
  sampleLabInstalled: boolean;
  serviceInitDone: boolean;

  setFirstBoot: (v: boolean) => void;
  goToStep: (step: OnboardingStep) => void;
  nextStep: () => void;
  updateCheck: (id: string, status: CheckStatus, detail?: string) => void;
  setAdminAccount: (a: { username: string; email: string }) => void;
  setSelectedPolicy: (p: string) => void;
  setSelectedTheme: (t: string) => void;
  setSampleLabInstalled: (v: boolean) => void;
  setServiceInitDone: (v: boolean) => void;
  completeOnboarding: () => void;
}

const INITIAL_CHECKS: SystemCheck[] = [
  { id: 'kvm',     label: 'KVM Virtualization Support',   status: 'pending' },
  { id: 'ram',     label: 'System RAM ≥ 8 GB',            status: 'pending' },
  { id: 'disk',    label: 'Free Disk Space ≥ 40 GB',      status: 'pending' },
  { id: 'libvirt', label: 'Libvirt Socket Available',     status: 'pending' },
  { id: 'network', label: 'Network Interface Active',      status: 'pending' },
];

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      firstBoot: true,
      currentStep: 'welcome',
      systemChecks: INITIAL_CHECKS,
      adminAccount: null,
      selectedPolicy: 'classroom',
      selectedTheme: 'obsidian',
      sampleLabInstalled: false,
      serviceInitDone: false,

      setFirstBoot: (v) => set({ firstBoot: v }),
      goToStep: (step) => set({ currentStep: step }),

      nextStep: () => {
        const { currentStep } = get();
        const idx = STEP_ORDER.indexOf(currentStep);
        if (idx < STEP_ORDER.length - 1) set({ currentStep: STEP_ORDER[idx + 1] });
      },

      updateCheck: (id, status, detail) => set(state => ({
        systemChecks: state.systemChecks.map(c => c.id === id ? { ...c, status, detail } : c),
      })),

      setAdminAccount: (a) => set({ adminAccount: a }),
      setSelectedPolicy: (p) => set({ selectedPolicy: p }),
      setSelectedTheme: (t) => set({ selectedTheme: t }),
      setSampleLabInstalled: (v) => set({ sampleLabInstalled: v }),
      setServiceInitDone: (v) => set({ serviceInitDone: v }),

      completeOnboarding: () => set({ firstBoot: false }),
    }),
    {
      name: 'rangeos-onboarding',
      partialize: (state) => ({
        firstBoot: state.firstBoot,
        adminAccount: state.adminAccount,
        selectedPolicy: state.selectedPolicy,
        selectedTheme: state.selectedTheme,
      }),
    }
  )
);
