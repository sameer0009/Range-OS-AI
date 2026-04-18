import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── Theme Definitions ──────────────────────────────────────────────────────
export type ThemeId = 'obsidian' | 'tactical-green' | 'crimson-ops';

export const THEMES: Record<ThemeId, { label: string; primary: string; secondary: string; accent: string; surface: string }> = {
  'obsidian': {
    label: 'Obsidian (Default)',
    primary:   '#3b82f6', // blue-500
    secondary: '#8b5cf6', // violet-500
    accent:    '#06b6d4', // cyan-500
    surface:   '#0f172a',
  },
  'tactical-green': {
    label: 'Tactical Green',
    primary:   '#22c55e', // green-500
    secondary: '#10b981', // emerald-500
    accent:    '#84cc16', // lime-500
    surface:   '#0a1a0a',
  },
  'crimson-ops': {
    label: 'Crimson Ops',
    primary:   '#ef4444', // red-500
    secondary: '#f97316', // orange-500
    accent:    '#ec4899', // pink-500
    surface:   '#1a0a0a',
  },
};

// ── Settings Schema ────────────────────────────────────────────────────────
export interface AppearanceSettings {
  theme: ThemeId;
  fontScale: 'sm' | 'md' | 'lg';
  sidebarDensity: 'compact' | 'comfortable';
  animationsEnabled: boolean;
}

export interface WorkspaceSettings {
  defaultView: string;
  maxTabs: number;
  redWorkspaceDefaultMode: 'stealth' | 'active';
  blueWorkspaceDefaultMode: 'monitor' | 'triage';
}

export interface LabDefaultsSettings {
  defaultVNetRange: string;
  defaultOsTemplate: string;
  maxVMs: number;
  autoSnapshotOnDeploy: boolean;
}

export interface EndpointSettings {
  apiGateway:    string;
  labService:    string;
  forensics:     string;
  reporting:     string;
  aiService:     string;
  policy:        string;
  identity:      string;
  orchestration: string;
}

export interface UpdateSettings {
  channel: 'stable' | 'nightly';
  autoInstall: boolean;
  maintenanceWindowStart: string; // HH:MM UTC
  maintenanceWindowEnd:   string;
}

export interface PrivacySettings {
  telemetryEnabled: boolean;
  interactionLogRetentionDays: number;
  aiSessionAnonymized: boolean;
}

export interface RangeOSSettings {
  appearance:  AppearanceSettings;
  workspace:   WorkspaceSettings;
  labDefaults: LabDefaultsSettings;
  endpoints:   EndpointSettings;
  updates:     UpdateSettings;
  privacy:     PrivacySettings;
}

// ── Default Values ─────────────────────────────────────────────────────────
const DEFAULTS: RangeOSSettings = {
  appearance: {
    theme: 'obsidian',
    fontScale: 'md',
    sidebarDensity: 'comfortable',
    animationsEnabled: true,
  },
  workspace: {
    defaultView: '/shell/dashboard',
    maxTabs: 8,
    redWorkspaceDefaultMode: 'active',
    blueWorkspaceDefaultMode: 'monitor',
  },
  labDefaults: {
    defaultVNetRange: '192.168.100.0/24',
    defaultOsTemplate: 'ubuntu-noble',
    maxVMs: 6,
    autoSnapshotOnDeploy: true,
  },
  endpoints: {
    apiGateway:    'http://localhost:8000',
    labService:    'http://localhost:8001',
    forensics:     'http://localhost:8003',
    reporting:     'http://localhost:8004',
    aiService:     'http://localhost:8005',
    policy:        'http://localhost:8006',
    identity:      'http://localhost:8007',
    orchestration: 'http://localhost:8002',
  },
  updates: {
    channel: 'stable',
    autoInstall: false,
    maintenanceWindowStart: '03:00',
    maintenanceWindowEnd: '05:00',
  },
  privacy: {
    telemetryEnabled: true,
    interactionLogRetentionDays: 30,
    aiSessionAnonymized: false,
  },
};

// ── Apply Theme to DOM ─────────────────────────────────────────────────────
function applyTheme(themeId: ThemeId) {
  const t = THEMES[themeId];
  const root = document.documentElement;
  root.setAttribute('data-theme', themeId);
  root.style.setProperty('--color-primary',   t.primary);
  root.style.setProperty('--color-secondary', t.secondary);
  root.style.setProperty('--color-accent',    t.accent);
  root.style.setProperty('--color-surface',   t.surface);
}

// ── Store ──────────────────────────────────────────────────────────────────
interface SettingsState {
  settings: RangeOSSettings;
  activeSection: string;
  savedFlash: string | null; // Section ID that recently saved — for transient "✓ Saved" flash
  setActiveSection: (s: string) => void;
  updateAppearance: (patch: Partial<AppearanceSettings>) => void;
  updateWorkspace: (patch: Partial<WorkspaceSettings>) => void;
  updateLabDefaults: (patch: Partial<LabDefaultsSettings>) => void;
  updateEndpoints: (patch: Partial<EndpointSettings>) => void;
  updateUpdates: (patch: Partial<UpdateSettings>) => void;
  updatePrivacy: (patch: Partial<PrivacySettings>) => void;
  resetSection: (section: keyof RangeOSSettings) => void;
  testEndpoint: (url: string) => Promise<'HEALTHY' | 'OFFLINE'>;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: DEFAULTS,
      activeSection: 'appearance',
      savedFlash: null,

      setActiveSection: (s) => set({ activeSection: s }),

      updateAppearance: (patch) => {
        const next = { ...get().settings.appearance, ...patch };
        if (patch.theme) applyTheme(patch.theme);
        set(state => ({ settings: { ...state.settings, appearance: next }, savedFlash: 'appearance' }));
        setTimeout(() => set({ savedFlash: null }), 1500);
      },

      updateWorkspace: (patch) => {
        set(state => ({
          settings: { ...state.settings, workspace: { ...state.settings.workspace, ...patch } },
          savedFlash: 'workspace',
        }));
        setTimeout(() => set({ savedFlash: null }), 1500);
      },

      updateLabDefaults: (patch) => {
        set(state => ({
          settings: { ...state.settings, labDefaults: { ...state.settings.labDefaults, ...patch } },
          savedFlash: 'lab-defaults',
        }));
        setTimeout(() => set({ savedFlash: null }), 1500);
      },

      updateEndpoints: (patch) => {
        set(state => ({
          settings: { ...state.settings, endpoints: { ...state.settings.endpoints, ...patch } },
          savedFlash: 'endpoints',
        }));
        setTimeout(() => set({ savedFlash: null }), 1500);
      },

      updateUpdates: (patch) => {
        set(state => ({
          settings: { ...state.settings, updates: { ...state.settings.updates, ...patch } },
          savedFlash: 'updates',
        }));
        setTimeout(() => set({ savedFlash: null }), 1500);
      },

      updatePrivacy: (patch) => {
        set(state => ({
          settings: { ...state.settings, privacy: { ...state.settings.privacy, ...patch } },
          savedFlash: 'privacy',
        }));
        setTimeout(() => set({ savedFlash: null }), 1500);
      },

      resetSection: (section) => {
        set(state => ({
          settings: { ...state.settings, [section]: DEFAULTS[section] },
          savedFlash: section,
        }));
        if (section === 'appearance') applyTheme(DEFAULTS.appearance.theme);
        setTimeout(() => set({ savedFlash: null }), 1500);
      },

      testEndpoint: async (url: string) => {
        try {
          const ctrl = new AbortController();
          const id = setTimeout(() => ctrl.abort(), 3000);
          await fetch(`${url}/health`, { signal: ctrl.signal });
          clearTimeout(id);
          return 'HEALTHY';
        } catch {
          return 'OFFLINE';
        }
      },
    }),
    {
      name: 'rangeos-settings',
      partialize: (state) => ({ settings: state.settings }),
      onRehydrateStorage: () => (state) => {
        // Re-apply persisted theme on boot
        if (state?.settings.appearance.theme) applyTheme(state.settings.appearance.theme);
      },
    }
  )
);
