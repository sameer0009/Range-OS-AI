import React, { useState } from 'react';
import {
  Palette, Monitor, FlaskConical, Server, RefreshCw,
  EyeOff, Keyboard, CheckCircle2, RotateCcw, Wifi, WifiOff, ChevronRight
} from 'lucide-react';
import { useSettingsStore, THEMES, ThemeId } from '../store/SettingsStore';

// ── Section Nav Config ────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'appearance',   label: 'Appearance',        icon: Palette },
  { id: 'workspace',    label: 'Workspace',          icon: Monitor },
  { id: 'lab-defaults', label: 'Lab Defaults',       icon: FlaskConical },
  { id: 'endpoints',    label: 'Service Endpoints',  icon: Server },
  { id: 'updates',      label: 'Update Manager',     icon: RefreshCw },
  { id: 'privacy',      label: 'Logging & Privacy',  icon: EyeOff },
  { id: 'shortcuts',    label: 'Keyboard Shortcuts',  icon: Keyboard },
];

const SHORTCUTS = [
  { keys: ['Ctrl', 'K'],   action: 'Open Command Palette' },
  { keys: ['Ctrl', 'T'],   action: 'New Tab' },
  { keys: ['Ctrl', 'W'],   action: 'Close Active Tab' },
  { keys: ['Ctrl', '\\'],  action: 'Toggle Sidebar' },
  { keys: ['Ctrl', 'B'],   action: 'Go to Blue Workspace' },
  { keys: ['Ctrl', 'R'],   action: 'Go to Red Workspace' },
  { keys: ['Ctrl', 'F'],   action: 'Go to Forensics Vault' },
  { keys: ['Esc'],          action: 'Close Modal / Palette' },
  { keys: ['Ctrl', ','],   action: 'Open Settings' },
];

// ── Shared UI Primitives ──────────────────────────────────────────────────
function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-8 py-4 border-b border-white/5 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-mono font-bold text-white uppercase tracking-wide">{label}</p>
        {description && <p className="text-[10px] font-mono text-gray-500 mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-cyber-primary' : 'bg-white/10'}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${checked ? 'left-5.5' : 'left-0.5'}`} />
    </button>
  );
}

function SectionHeader({ id, label, onReset }: { id: string; label: string; onReset: () => void }) {
  const { savedFlash } = useSettingsStore();
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-[0.2em]">{label}</h2>
      <div className="flex items-center gap-3">
        {savedFlash === id && (
          <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 animate-in fade-in">
            <CheckCircle2 size={10} /> Saved
          </span>
        )}
        <button
          onClick={() => { if (confirm(`Reset ${label} to defaults?`)) onReset(); }}
          className="flex items-center gap-1 text-[10px] font-mono text-gray-600 hover:text-gray-400 transition-colors"
        >
          <RotateCcw size={10} /> Reset
        </button>
      </div>
    </div>
  );
}

// ── Section Panels ────────────────────────────────────────────────────────
function AppearancePanel() {
  const { settings, updateAppearance, resetSection } = useSettingsStore();
  const { appearance } = settings;

  return (
    <div>
      <SectionHeader id="appearance" label="Appearance" onReset={() => resetSection('appearance')} />
      
      {/* Theme Selector */}
      <div className="mb-6">
        <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">Platform Theme</p>
        <div className="grid grid-cols-3 gap-3">
          {(Object.entries(THEMES) as [ThemeId, typeof THEMES[ThemeId]][]).map(([id, t]) => (
            <button
              key={id}
              onClick={() => updateAppearance({ theme: id })}
              className={`p-3 rounded-xl border text-left transition-all ${
                appearance.theme === id
                  ? 'border-cyber-primary bg-cyber-primary/10 shadow-glow-primary/20'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              {/* Mini preview swatch */}
              <div className="flex gap-1 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ background: t.primary }} />
                <div className="w-3 h-3 rounded-full" style={{ background: t.secondary }} />
                <div className="w-3 h-3 rounded-full" style={{ background: t.accent }} />
              </div>
              <p className="text-[10px] font-mono font-bold text-white uppercase">{t.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-0">
        <SettingRow label="Font Scale" description="Global interface text size.">
          <select
            value={appearance.fontScale}
            onChange={e => updateAppearance({ fontScale: e.target.value as any })}
            className="bg-cyber-surface border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-white"
          >
            <option value="sm">Small</option>
            <option value="md">Medium (Default)</option>
            <option value="lg">Large</option>
          </select>
        </SettingRow>

        <SettingRow label="Sidebar Density" description="Spacing between navigation items.">
          <select
            value={appearance.sidebarDensity}
            onChange={e => updateAppearance({ sidebarDensity: e.target.value as any })}
            className="bg-cyber-surface border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-white"
          >
            <option value="compact">Compact</option>
            <option value="comfortable">Comfortable</option>
          </select>
        </SettingRow>

        <SettingRow label="Animations" description="Disable for reduced motion environments.">
          <Toggle checked={appearance.animationsEnabled} onChange={v => updateAppearance({ animationsEnabled: v })} />
        </SettingRow>
      </div>
    </div>
  );
}

function WorkspacePanel() {
  const { settings, updateWorkspace, resetSection } = useSettingsStore();
  const { workspace } = settings;
  return (
    <div>
      <SectionHeader id="workspace" label="Workspace" onReset={() => resetSection('workspace')} />
      <div className="space-y-0">
        <SettingRow label="Default View" description="View loaded on shell launch.">
          <select
            value={workspace.defaultView}
            onChange={e => updateWorkspace({ defaultView: e.target.value })}
            className="bg-cyber-surface border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-white"
          >
            <option value="/shell/dashboard">Dashboard</option>
            <option value="/shell/blue-workspace">Blue Workspace</option>
            <option value="/shell/red-workspace">Red Workspace</option>
            <option value="/shell/forensics">Forensics</option>
          </select>
        </SettingRow>

        <SettingRow label="Max Open Tabs" description="Hard limit on concurrent workspace tabs.">
          <input
            type="number" min={1} max={16}
            value={workspace.maxTabs}
            onChange={e => updateWorkspace({ maxTabs: parseInt(e.target.value) })}
            className="w-16 bg-cyber-surface border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-white text-center"
          />
        </SettingRow>

        <SettingRow label="Red Workspace Default" description="Initial mode when Red Workspace opens.">
          <select
            value={workspace.redWorkspaceDefaultMode}
            onChange={e => updateWorkspace({ redWorkspaceDefaultMode: e.target.value as any })}
            className="bg-cyber-surface border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-white"
          >
            <option value="active">Active</option>
            <option value="stealth">Stealth</option>
          </select>
        </SettingRow>

        <SettingRow label="Blue Workspace Default" description="Initial mode when Blue Workspace opens.">
          <select
            value={workspace.blueWorkspaceDefaultMode}
            onChange={e => updateWorkspace({ blueWorkspaceDefaultMode: e.target.value as any })}
            className="bg-cyber-surface border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-white"
          >
            <option value="monitor">Monitor</option>
            <option value="triage">Triage</option>
          </select>
        </SettingRow>
      </div>
    </div>
  );
}

function LabDefaultsPanel() {
  const { settings, updateLabDefaults, resetSection } = useSettingsStore();
  const { labDefaults } = settings;
  return (
    <div>
      <SectionHeader id="lab-defaults" label="Lab Defaults" onReset={() => resetSection('labDefaults')} />
      <div className="space-y-0">
        <SettingRow label="Default VNet Range" description="CIDR range for new lab networks.">
          <input
            type="text"
            value={labDefaults.defaultVNetRange}
            onChange={e => updateLabDefaults({ defaultVNetRange: e.target.value })}
            className="w-48 bg-cyber-surface border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-white"
          />
        </SettingRow>

        <SettingRow label="Default OS Template" description="Base image for new VMs.">
          <select
            value={labDefaults.defaultOsTemplate}
            onChange={e => updateLabDefaults({ defaultOsTemplate: e.target.value })}
            className="bg-cyber-surface border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-white"
          >
            <option value="ubuntu-noble">Ubuntu Noble 24.04</option>
            <option value="kali-linux">Kali Linux 2024</option>
            <option value="windows-server-2022">Windows Server 2022</option>
            <option value="debian-12">Debian 12 Bookworm</option>
          </select>
        </SettingRow>

        <SettingRow label="Max VMs per Lab" description="Hard limit on simultaneous virtual machines.">
          <input
            type="number" min={1} max={32}
            value={labDefaults.maxVMs}
            onChange={e => updateLabDefaults({ maxVMs: parseInt(e.target.value) })}
            className="w-16 bg-cyber-surface border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-white text-center"
          />
        </SettingRow>

        <SettingRow label="Auto-Snapshot on Deploy" description="Capture BTRFS snapshot before lab deployment.">
          <Toggle checked={labDefaults.autoSnapshotOnDeploy} onChange={v => updateLabDefaults({ autoSnapshotOnDeploy: v })} />
        </SettingRow>
      </div>
    </div>
  );
}

function EndpointsPanel() {
  const { settings, updateEndpoints, resetSection, testEndpoint } = useSettingsStore();
  const { endpoints } = settings;
  const [pinging, setPinging] = useState<Record<string, 'HEALTHY' | 'OFFLINE' | 'TESTING'>>({});

  const test = async (key: string, url: string) => {
    setPinging(p => ({ ...p, [key]: 'TESTING' }));
    const result = await testEndpoint(url);
    setPinging(p => ({ ...p, [key]: result }));
    setTimeout(() => setPinging(p => { const n = { ...p }; delete n[key]; return n; }), 4000);
  };

  const EP_FIELDS: { key: keyof typeof endpoints; label: string }[] = [
    { key: 'apiGateway',    label: 'API Gateway' },
    { key: 'labService',    label: 'Lab Service' },
    { key: 'orchestration', label: 'Orchestration' },
    { key: 'forensics',     label: 'Forensics Service' },
    { key: 'reporting',     label: 'Reporting Service' },
    { key: 'aiService',     label: 'AI Service' },
    { key: 'policy',        label: 'Policy Service' },
    { key: 'identity',      label: 'Identity Service' },
  ];

  return (
    <div>
      <SectionHeader id="endpoints" label="Service Endpoints" onReset={() => resetSection('endpoints')} />
      <div className="space-y-3">
        {EP_FIELDS.map(({ key, label }) => {
          const pingState = pinging[key];
          return (
            <div key={key} className="flex items-center gap-3">
              <span className="w-32 text-[10px] font-mono text-gray-400 uppercase flex-shrink-0">{label}</span>
              <input
                type="text"
                value={(endpoints as any)[key]}
                onChange={e => updateEndpoints({ [key]: e.target.value } as any)}
                className="flex-1 bg-cyber-surface border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-white focus:border-cyber-primary/50 outline-none"
              />
              <button
                onClick={() => test(key, (endpoints as any)[key])}
                disabled={pingState === 'TESTING'}
                className="flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded border border-white/10 hover:border-cyber-primary/30 transition-colors"
              >
                {pingState === 'TESTING' ? (
                  <span className="text-gray-500">Testing...</span>
                ) : pingState === 'HEALTHY' ? (
                  <><Wifi size={10} className="text-emerald-400" /><span className="text-emerald-400">OK</span></>
                ) : pingState === 'OFFLINE' ? (
                  <><WifiOff size={10} className="text-red-400" /><span className="text-red-400">FAIL</span></>
                ) : (
                  <><Wifi size={10} className="text-gray-600" /><span className="text-gray-600">Test</span></>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UpdatesPanel() {
  const { settings, updateUpdates, resetSection } = useSettingsStore();
  const { updates } = settings;
  return (
    <div>
      <SectionHeader id="updates" label="Update Manager" onReset={() => resetSection('updates')} />
      <div className="space-y-0">
        <SettingRow label="Update Channel" description="Stable receives tested releases. Nightly may be unstable.">
          <select
            value={updates.channel}
            onChange={e => updateUpdates({ channel: e.target.value as any })}
            className="bg-cyber-surface border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-white"
          >
            <option value="stable">Stable</option>
            <option value="nightly">Nightly</option>
          </select>
        </SettingRow>

        <SettingRow label="Auto-Install Updates" description="Install updates automatically during maintenance window.">
          <Toggle checked={updates.autoInstall} onChange={v => updateUpdates({ autoInstall: v })} />
        </SettingRow>

        <SettingRow label="Maintenance Window" description="UTC time range when auto-updates are permitted.">
          <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
            <input type="time" value={updates.maintenanceWindowStart}
              onChange={e => updateUpdates({ maintenanceWindowStart: e.target.value })}
              className="bg-cyber-surface border border-white/10 rounded px-2 py-1 text-white"
            />
            <span>→</span>
            <input type="time" value={updates.maintenanceWindowEnd}
              onChange={e => updateUpdates({ maintenanceWindowEnd: e.target.value })}
              className="bg-cyber-surface border border-white/10 rounded px-2 py-1 text-white"
            />
            <span>UTC</span>
          </div>
        </SettingRow>
      </div>
    </div>
  );
}

function PrivacyPanel() {
  const { settings, updatePrivacy, resetSection } = useSettingsStore();
  const { privacy } = settings;
  return (
    <div>
      <SectionHeader id="privacy" label="Logging & Privacy" onReset={() => resetSection('privacy')} />
      <div className="space-y-0">
        <SettingRow label="Platform Telemetry" description="Send anonymous usage data to improve RangeOS AI.">
          <Toggle checked={privacy.telemetryEnabled} onChange={v => updatePrivacy({ telemetryEnabled: v })} />
        </SettingRow>

        <SettingRow label="Interaction Log Retention" description="Days to retain local operator interaction logs.">
          <div className="flex items-center gap-2">
            <input type="number" min={1} max={365}
              value={privacy.interactionLogRetentionDays}
              onChange={e => updatePrivacy({ interactionLogRetentionDays: parseInt(e.target.value) })}
              className="w-16 bg-cyber-surface border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-white text-center"
            />
            <span className="text-[10px] font-mono text-gray-600">days</span>
          </div>
        </SettingRow>

        <SettingRow label="Anonymize AI Sessions" description="Strip operator identity from AI interaction logs.">
          <Toggle checked={privacy.aiSessionAnonymized} onChange={v => updatePrivacy({ aiSessionAnonymized: v })} />
        </SettingRow>
      </div>
    </div>
  );
}

function ShortcutsPanel() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-[0.2em]">Keyboard Shortcuts</h2>
        <span className="text-[9px] font-mono text-gray-700 uppercase">Read Only</span>
      </div>
      <div className="space-y-2">
        {SHORTCUTS.map((s, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
            <span className="text-sm font-mono text-gray-300">{s.action}</span>
            <div className="flex gap-1">
              {s.keys.map((k, ki) => (
                <React.Fragment key={k}>
                  <kbd className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-gray-300">{k}</kbd>
                  {ki < s.keys.length - 1 && <span className="text-gray-700 text-[10px] self-center">+</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const PANELS: Record<string, React.ComponentType> = {
  'appearance':   AppearancePanel,
  'workspace':    WorkspacePanel,
  'lab-defaults': LabDefaultsPanel,
  'endpoints':    EndpointsPanel,
  'updates':      UpdatesPanel,
  'privacy':      PrivacyPanel,
  'shortcuts':    ShortcutsPanel,
};

// ── Main Settings View ────────────────────────────────────────────────────
export default function SettingsView() {
  const { activeSection, setActiveSection } = useSettingsStore();
  const ActivePanel = PANELS[activeSection] ?? AppearancePanel;

  return (
    <div className="flex h-full max-w-[1400px] mx-auto gap-0 animate-in fade-in duration-500">
      {/* Left Rail Navigation */}
      <nav className="w-56 flex-shrink-0 border-r border-white/5 pr-2 space-y-0.5 py-2">
        <p className="text-[9px] font-mono text-gray-700 uppercase tracking-widest px-3 mb-3">Control Deck</p>
        {SECTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all group ${
              activeSection === id
                ? 'bg-cyber-primary/10 text-cyber-primary border border-cyber-primary/20'
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`}
          >
            <Icon size={14} className={activeSection === id ? 'text-cyber-primary' : 'text-gray-600 group-hover:text-gray-400'} />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wide">{label}</span>
            {activeSection === id && <ChevronRight size={12} className="ml-auto text-cyber-primary/50" />}
          </button>
        ))}
      </nav>

      {/* Right Panel */}
      <div className="flex-1 overflow-y-auto pl-8 py-2 pr-2 custom-scrollbar">
        <ActivePanel />
      </div>
    </div>
  );
}
