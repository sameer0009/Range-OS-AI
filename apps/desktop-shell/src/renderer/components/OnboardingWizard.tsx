import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, AlertTriangle, XCircle, ChevronRight, ChevronLeft,
  Shield, Server, User, Palette, FlaskConical, Zap, Loader2
} from 'lucide-react';
import { useOnboardingStore, STEP_ORDER, SystemCheck, CheckStatus } from '../store/OnboardingStore';
import { useSettingsStore, THEMES, ThemeId } from '../store/SettingsStore';
import { useNotificationStore } from '../store/NotificationStore';
import { useNavigate } from 'react-router-dom';

// ── Constants ─────────────────────────────────────────────────────────────
const STEP_META = {
  'welcome':        { icon: Zap,           label: 'Welcome',         color: 'text-cyber-primary' },
  'system-check':   { icon: Server,        label: 'System Check',    color: 'text-cyan-400' },
  'admin-setup':    { icon: User,          label: 'Admin Setup',     color: 'text-violet-400' },
  'service-init':   { icon: Server,        label: 'Services',        color: 'text-emerald-400' },
  'policy-profile': { icon: Shield,        label: 'Policy Profile',  color: 'text-orange-400' },
  'sample-lab':     { icon: FlaskConical,  label: 'Sample Lab',      color: 'text-yellow-400' },
  'theme-preview':  { icon: Palette,       label: 'Theme',           color: 'text-pink-400' },
  'ready':          { icon: CheckCircle2,  label: 'Ready',           color: 'text-emerald-400' },
};

const POLICY_PROFILES = [
  { id: 'classroom', label: 'Classroom',   desc: 'Permissive lab creation, AI Tutor mode enabled, beginner-friendly defaults.' },
  { id: 'research',  label: 'Research',    desc: 'Relaxed isolation, full ATT&CK coverage, long-running session support.' },
  { id: 'red-team',  label: 'Red Team',    desc: 'Aggressive scan policies enabled, Red Workspace defaults active.' },
  { id: 'blue-team', label: 'Blue Team',   desc: 'Strict policy evaluation, Blue Workspace auto-starts, alert escalation on.' },
];

// ── Status Icon ───────────────────────────────────────────────────────────
function StatusIcon({ status }: { status: CheckStatus }) {
  if (status === 'ok')      return <CheckCircle2 size={16} className="text-emerald-400" />;
  if (status === 'warn')    return <AlertTriangle size={16} className="text-yellow-400" />;
  if (status === 'fail')    return <XCircle size={16} className="text-red-400" />;
  return <Loader2 size={16} className="text-gray-600 animate-spin" />;
}

// ── Step: Welcome ─────────────────────────────────────────────────────────
function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-8">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }}>
        <div className="relative">
          <div className="absolute -inset-8 bg-cyber-primary/20 rounded-full blur-2xl animate-pulse" />
          <div className="w-32 h-32 rounded-2xl bg-cyber-primary/10 border border-cyber-primary/30 flex items-center justify-center relative z-10 shadow-glow-primary">
            <Zap size={64} className="text-cyber-primary" />
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
        <h1 className="text-4xl font-mono font-black text-white uppercase tracking-tighter mb-3">
          Welcome to <span className="text-cyber-primary">RangeOS AI</span>
        </h1>
        <p className="text-gray-400 font-mono text-sm max-w-md leading-relaxed">
          The Tactical Cybersecurity Operations Platform. This wizard will configure your environment in under 5 minutes.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="grid grid-cols-3 gap-4 text-center">
        {['Secure', 'Intelligent', 'Tactical'].map(tag => (
          <div key={tag} className="px-4 py-2 rounded-lg border border-cyber-primary/20 bg-cyber-primary/5">
            <span className="text-[11px] font-mono font-bold text-cyber-primary uppercase tracking-widest">{tag}</span>
          </div>
        ))}
      </motion.div>

      <button onClick={onNext} className="flex items-center gap-2 px-8 py-3 rounded-xl bg-cyber-primary text-black font-mono font-bold uppercase text-sm hover:bg-white transition-colors shadow-glow-primary">
        Begin Setup <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ── Step: System Check ─────────────────────────────────────────────────────
function SystemCheckStep({ onNext }: { onNext: () => void }) {
  const { systemChecks, updateCheck } = useOnboardingStore();

  useEffect(() => {
    // Simulate hardware checks sequentially
    const MOCK_RESULTS: Record<string, { status: CheckStatus; detail: string }> = {
      kvm:     { status: 'ok',   detail: 'Intel VT-x enabled' },
      ram:     { status: 'ok',   detail: '16 GB detected' },
      disk:    { status: 'ok',   detail: '240 GB free' },
      libvirt: { status: 'ok',   detail: 'Socket present at /var/run/libvirt' },
      network: { status: 'ok',   detail: 'eth0 active' },
    };
    let delay = 600;
    Object.entries(MOCK_RESULTS).forEach(([id, result]) => {
      setTimeout(() => updateCheck(id, result.status, result.detail), delay);
      delay += 400;
    });
  }, []);

  const allDone = systemChecks.every(c => c.status !== 'pending');
  const hasFail = systemChecks.some(c => c.status === 'fail');

  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h2 className="text-xl font-mono font-bold text-white uppercase tracking-tight mb-1">System Validation</h2>
        <p className="text-[11px] font-mono text-gray-500">Checking hardware and kernel prerequisites for the RangeOS tactical stack.</p>
      </div>

      <div className="flex-1 space-y-3">
        {systemChecks.map((check) => (
          <div key={check.id} className="flex items-center gap-4 p-3 rounded-lg border border-white/5 bg-white/[0.02]">
            <StatusIcon status={check.status} />
            <div className="flex-1">
              <p className="text-sm font-mono font-bold text-white">{check.label}</p>
              {check.detail && <p className="text-[10px] font-mono text-gray-500">{check.detail}</p>}
            </div>
          </div>
        ))}
      </div>

      {allDone && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {hasFail && (
            <div className="p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 mb-4">
              <p className="text-[11px] font-mono text-yellow-400">
                ⚠ One or more checks failed. Lab Builder will operate in Simulation Mode.
              </p>
            </div>
          )}
          <button onClick={onNext} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-cyber-primary text-black font-mono font-bold uppercase text-sm hover:bg-white transition-colors">
            Continue <ChevronRight size={16} />
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ── Step: Admin Setup ──────────────────────────────────────────────────────
function AdminSetupStep({ onNext }: { onNext: () => void }) {
  const { setAdminAccount } = useOnboardingStore();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (form.username.length < 3) return 'Username must be at least 3 characters.';
    if (!form.email.includes('@')) return 'Valid email address required.';
    if (form.password.length < 12) return 'Password must be at least 12 characters.';
    if (form.password !== form.confirm) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    // POST /v1/identity/admin-bootstrap
    await new Promise(r => setTimeout(r, 800));
    setAdminAccount({ username: form.username, email: form.email });
    setLoading(false);
    onNext();
  };

  const inputClass = "w-full bg-cyber-surface border border-white/10 rounded-lg px-3 py-2.5 text-sm font-mono text-white placeholder:text-gray-600 focus:outline-none focus:border-cyber-primary/50";

  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h2 className="text-xl font-mono font-bold text-white uppercase tracking-tight mb-1">Create Admin Account</h2>
        <p className="text-[11px] font-mono text-gray-500">This will be the primary operator account for RangeOS AI.</p>
      </div>

      <div className="flex-1 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-mono text-gray-500 uppercase mb-1 block">Username</label>
            <input className={inputClass} placeholder="range-operator" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
          </div>
          <div>
            <label className="text-[10px] font-mono text-gray-500 uppercase mb-1 block">Email</label>
            <input className={inputClass} placeholder="ops@rangeos.ai" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
        </div>
        <div>
          <label className="text-[10px] font-mono text-gray-500 uppercase mb-1 block">Password (≥ 12 chars)</label>
          <input className={inputClass} type="password" placeholder="••••••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
        </div>
        <div>
          <label className="text-[10px] font-mono text-gray-500 uppercase mb-1 block">Confirm Password</label>
          <input className={inputClass} type="password" placeholder="••••••••••••" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} />
        </div>
        {error && <p className="text-[11px] font-mono text-red-400 flex items-center gap-2"><XCircle size={12} />{error}</p>}
      </div>

      <button onClick={handleSubmit} disabled={loading} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-cyber-primary text-black font-mono font-bold uppercase text-sm hover:bg-white transition-colors disabled:opacity-50">
        {loading ? <Loader2 size={16} className="animate-spin" /> : <><CheckCircle2 size={16} /> Create Account</>}
      </button>
    </div>
  );
}

// ── Step: Service Init ─────────────────────────────────────────────────────
function ServiceInitStep({ onNext }: { onNext: () => void }) {
  const { serviceHealth, pollHealth } = useNotificationStore();
  const { setServiceInitDone } = useOnboardingStore();
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setStarted(true);
      for (let i = 0; i < 4; i++) {
        await pollHealth();
        await new Promise(r => setTimeout(r, 1500));
      }
      setServiceInitDone(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const allHealthy = serviceHealth.every(s => s.status === 'HEALTHY');

  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h2 className="text-xl font-mono font-bold text-white uppercase tracking-tight mb-1">Initializing Services</h2>
        <p className="text-[11px] font-mono text-gray-500">Starting the RangeOS AI microservice mesh and validating connectivity.</p>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-2">
        {serviceHealth.map(svc => (
          <div key={svc.id} className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/[0.02]">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
              svc.status === 'HEALTHY' ? 'bg-emerald-500' :
              svc.status === 'DEGRADED' ? 'bg-yellow-500' :
              svc.status === 'OFFLINE' ? 'bg-red-500' :
              'bg-gray-600 animate-pulse'
            }`} />
            <div>
              <p className="text-[11px] font-mono font-bold text-white">{svc.name}</p>
              <p className={`text-[9px] font-mono ${svc.status === 'HEALTHY' ? 'text-emerald-600' : 'text-gray-600'}`}>{svc.status}{svc.status === 'HEALTHY' ? ` · ${svc.latency_ms}ms` : ''}</p>
            </div>
          </div>
        ))}
      </div>

      {allHealthy && (
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={onNext}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 text-black font-mono font-bold uppercase text-sm hover:bg-white transition-colors"
        >
          <CheckCircle2 size={16} /> All Systems Nominal — Continue
        </motion.button>
      )}
    </div>
  );
}

// ── Step: Policy Profile ──────────────────────────────────────────────────
function PolicyProfileStep({ onNext }: { onNext: () => void }) {
  const { selectedPolicy, setSelectedPolicy } = useOnboardingStore();

  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h2 className="text-xl font-mono font-bold text-white uppercase tracking-tight mb-1">Select Policy Profile</h2>
        <p className="text-[11px] font-mono text-gray-500">Choose the operational context that best describes your environment. This can be changed later in Settings.</p>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-3">
        {POLICY_PROFILES.map(profile => (
          <button key={profile.id} onClick={() => setSelectedPolicy(profile.id)}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedPolicy === profile.id ? 'border-cyber-primary bg-cyber-primary/10 shadow-glow-primary/20' : 'border-white/10 bg-white/[0.02] hover:border-white/20'
            }`}
          >
            <p className={`text-[11px] font-mono font-bold uppercase tracking-widest mb-2 ${selectedPolicy === profile.id ? 'text-cyber-primary' : 'text-gray-400'}`}>{profile.label}</p>
            <p className="text-[10px] font-mono text-gray-500 leading-relaxed">{profile.desc}</p>
          </button>
        ))}
      </div>

      <button onClick={onNext} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-cyber-primary text-black font-mono font-bold uppercase text-sm hover:bg-white transition-colors">
        Apply Profile <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ── Step: Sample Lab ──────────────────────────────────────────────────────
function SampleLabStep({ onNext }: { onNext: () => void }) {
  const { setSampleLabInstalled } = useOnboardingStore();
  const [installing, setInstalling] = useState(false);
  const [done, setDone] = useState(false);

  const install = async () => {
    setInstalling(true);
    await new Promise(r => setTimeout(r, 2000));
    setSampleLabInstalled(true);
    setDone(true);
    setInstalling(false);
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h2 className="text-xl font-mono font-bold text-white uppercase tracking-tight mb-1">Sample Lab</h2>
        <p className="text-[11px] font-mono text-gray-500">Install the Beginner Web Pentest Lab to get started with a pre-configured attack scenario.</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <div className="p-6 rounded-xl border border-cyber-primary/20 bg-cyber-primary/5 w-full max-w-sm text-center">
          <FlaskConical size={48} className="text-cyber-primary mx-auto mb-4" />
          <h3 className="font-mono font-bold text-white uppercase mb-2">Beginner Web Pentest</h3>
          <p className="text-[10px] font-mono text-gray-500">DVWA + Kali Attacker + isolated VNet. Perfect for learning OWASP Top 10.</p>
        </div>

        {done ? (
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm">
            <CheckCircle2 size={16} /> Lab installed successfully
          </div>
        ) : (
          <button onClick={install} disabled={installing}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-cyber-primary/20 border border-cyber-primary/30 text-cyber-primary font-mono text-sm font-bold uppercase hover:bg-cyber-primary/30 transition-colors disabled:opacity-50"
          >
            {installing ? <><Loader2 size={14} className="animate-spin" /> Installing...</> : 'Install Sample Lab'}
          </button>
        )}
      </div>

      <button onClick={onNext} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-mono font-bold uppercase text-sm hover:bg-white/10 transition-colors">
        {done ? 'Continue' : 'Skip for Now'} <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ── Step: Theme Preview ──────────────────────────────────────────────────
function ThemePreviewStep({ onNext }: { onNext: () => void }) {
  const { selectedTheme, setSelectedTheme } = useOnboardingStore();
  const { updateAppearance } = useSettingsStore();

  const selectTheme = (t: ThemeId) => {
    setSelectedTheme(t);
    updateAppearance({ theme: t });
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h2 className="text-xl font-mono font-bold text-white uppercase tracking-tight mb-1">Choose Your Theme</h2>
        <p className="text-[11px] font-mono text-gray-500">Select the visual identity for the RangeOS AI shell. Changes are instant — no reload needed.</p>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-4">
        {(Object.entries(THEMES) as [ThemeId, typeof THEMES[ThemeId]][]).map(([id, t]) => (
          <button key={id} onClick={() => selectTheme(id)}
            className={`p-4 rounded-xl border text-left transition-all flex flex-col gap-3 ${
              selectedTheme === id ? 'border-4 shadow-xl' : 'border-white/10 bg-white/[0.02] hover:border-white/20'
            }`}
            style={selectedTheme === id ? { borderColor: t.primary, boxShadow: `0 0 20px ${t.primary}40` } : {}}
          >
            <div className="flex gap-2">
              <div className="w-5 h-5 rounded-full" style={{ background: t.primary }} />
              <div className="w-5 h-5 rounded-full" style={{ background: t.secondary }} />
              <div className="w-5 h-5 rounded-full" style={{ background: t.accent }} />
            </div>
            <div className="flex-1 rounded-md h-12" style={{ background: t.surface, border: `1px solid ${t.primary}30` }} />
            <p className="text-[10px] font-mono font-bold text-white uppercase">{t.label}</p>
          </button>
        ))}
      </div>

      <button onClick={onNext} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-cyber-primary text-black font-mono font-bold uppercase text-sm hover:bg-white transition-colors">
        Set Theme <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ── Step: Ready ───────────────────────────────────────────────────────────
function ReadyStep({ onComplete }: { onComplete: () => void }) {
  const { adminAccount, selectedPolicy } = useOnboardingStore();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-8">
      <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', duration: 0.8 }}>
        <div className="relative">
          <div className="absolute -inset-8 bg-emerald-500/20 rounded-full blur-2xl animate-pulse" />
          <div className="w-32 h-32 rounded-full bg-emerald-500/10 border-2 border-emerald-500/50 flex items-center justify-center relative z-10 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
            <CheckCircle2 size={64} className="text-emerald-400" />
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
        <h1 className="text-3xl font-mono font-black text-white uppercase tracking-tighter mb-3">Mission Ready</h1>
        <p className="text-gray-400 font-mono text-sm max-w-xs leading-relaxed">
          RangeOS AI is fully configured and operational.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="grid grid-cols-2 gap-3 w-full max-w-xs text-left">
        <div className="p-3 rounded-lg border border-white/5 bg-white/[0.02]">
          <p className="text-[9px] font-mono text-gray-600 uppercase mb-1">Operator</p>
          <p className="text-[11px] font-mono text-white font-bold">{adminAccount?.username ?? 'admin'}</p>
        </div>
        <div className="p-3 rounded-lg border border-white/5 bg-white/[0.02]">
          <p className="text-[9px] font-mono text-gray-600 uppercase mb-1">Policy Profile</p>
          <p className="text-[11px] font-mono text-cyber-primary font-bold uppercase">{selectedPolicy}</p>
        </div>
      </motion.div>

      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
        onClick={onComplete}
        className="flex items-center gap-3 px-10 py-4 rounded-xl bg-cyber-primary text-black font-mono font-black uppercase tracking-wide hover:bg-white transition-colors shadow-glow-primary text-base"
      >
        <Zap size={20} /> Enter Tactical HUD
      </motion.button>
    </div>
  );
}

// ── Progress Rail ─────────────────────────────────────────────────────────
function StepRail({ current }: { current: string }) {
  const idx = STEP_ORDER.indexOf(current as any);
  return (
    <div className="flex items-center gap-1 mb-8">
      {STEP_ORDER.map((step, i) => {
        const meta = STEP_META[step];
        const isActive = i === idx;
        const isDone = i < idx;
        return (
          <React.Fragment key={step}>
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all ${
              isActive ? 'bg-cyber-primary/10 border border-cyber-primary/30' :
              isDone ? 'opacity-40' : 'opacity-20'
            }`}>
              {isDone ? <CheckCircle2 size={10} className="text-emerald-400" /> : <meta.icon size={10} className={isActive ? meta.color : 'text-gray-600'} />}
              <span className={`text-[9px] font-mono uppercase hidden sm:block ${isActive ? 'text-white' : 'text-gray-600'}`}>{meta.label}</span>
            </div>
            {i < STEP_ORDER.length - 1 && <div className={`flex-1 h-px ${i < idx ? 'bg-emerald-800' : 'bg-white/5'}`} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── Main Wizard ───────────────────────────────────────────────────────────
export function OnboardingWizard() {
  const { currentStep, nextStep, completeOnboarding } = useOnboardingStore();
  const navigate = useNavigate();

  const handleComplete = () => {
    completeOnboarding();
    navigate('/shell/dashboard');
  };

  const stepContent: Record<string, React.ReactNode> = {
    'welcome':        <WelcomeStep onNext={nextStep} />,
    'system-check':   <SystemCheckStep onNext={nextStep} />,
    'admin-setup':    <AdminSetupStep onNext={nextStep} />,
    'service-init':   <ServiceInitStep onNext={nextStep} />,
    'policy-profile': <PolicyProfileStep onNext={nextStep} />,
    'sample-lab':     <SampleLabStep onNext={nextStep} />,
    'theme-preview':  <ThemePreviewStep onNext={nextStep} />,
    'ready':          <ReadyStep onComplete={handleComplete} />,
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#020617] flex items-center justify-center p-8">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyber-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        <StepRail current={currentStep} />

        <div className="bg-cyber-surface/50 border border-cyber-surface-elevated rounded-2xl backdrop-blur-xl overflow-hidden" style={{ minHeight: '420px' }}>
          <div className="p-8 h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="h-full"
              >
                {stepContent[currentStep]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-4 text-center text-[9px] font-mono text-gray-700 uppercase tracking-widest">
          RangeOS AI · Noble Forge · v0.2.31-Alpha
        </div>
      </div>
    </div>
  );
}
