import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Fingerprint, Cpu, Lock } from 'lucide-react';
import { Button, Input } from '@rangeos/ui';

export default function LoginScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock authentication delay
    setTimeout(() => {
      setLoading(false);
      navigate('/shell');
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-cyber-background items-center justify-center p-6 select-none relative overflow-hidden">
      
      {/* High-Fidelity Background Grid Asset */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img 
          src="../renderer/assets/hero-bg.png" 
          className="w-full h-full object-cover opacity-60 scale-105 animate-pulse-slow font-mono"
          alt="System Grid"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cyber-background/80 via-transparent to-cyber-background/90" />
      </div>

      {/* Top Left Branding */}
      <div className="absolute top-8 left-8 flex items-center gap-3 z-20">
        <img 
          src="../renderer/assets/logo-text.png" 
          alt="RANGE OS AI" 
          className="h-8 w-auto opacity-90 transition-opacity hover:opacity-100"
        />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-[400px] glass-panel border-cyber-surface-elevated p-8 rounded-lg relative z-10 animate-in fade-in zoom-in duration-500">
        
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-cyber-primary/10 border border-cyber-primary/20 mb-4">
            <Lock size={32} className="text-cyber-primary" />
          </div>
          <h2 className="text-xl font-mono text-white uppercase tracking-widest">Authentication Required</h2>
          <p className="text-xs font-mono text-gray-500 mt-2 uppercase tracking-tight">System Node: <span className="text-cyber-secondary">RIU-RANGE-01</span></p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input 
            label="Operator ID" 
            placeholder="e.g. ADMIN_01" 
            value={credentials.username}
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            required
            autoFocus
          />
          <Input 
            label="Access Token" 
            type="password" 
            placeholder="••••••••" 
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            required
          />

          <div className="flex items-center justify-between py-2">
            <button type="button" className="text-[10px] font-mono text-gray-500 hover:text-cyber-primary flex items-center gap-1.5 transition-colors uppercase">
              <Fingerprint size={14} /> Biometric Bypass
            </button>
            <button type="button" className="text-[10px] font-mono text-gray-500 hover:text-cyber-primary transition-colors uppercase">
              Recovery Key
            </button>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full py-3"
            disabled={loading}
          >
            {loading ? 'Validating...' : 'Initialize Session'}
          </Button>
        </form>

        {/* Status indicator */}
        <div className="mt-8 flex justify-center gap-6">
          <div className="flex items-center gap-2 opacity-40">
            <div className="w-1.5 h-1.5 rounded-full bg-cyber-success shadow-glow-success"></div>
            <span className="text-[10px] font-mono text-gray-400 uppercase">Secure</span>
          </div>
          <div className="flex items-center gap-2 opacity-40">
            <div className="w-1.5 h-1.5 rounded-full bg-cyber-secondary shadow-glow-primary animate-pulse"></div>
            <span className="text-[10px] font-mono text-gray-400 uppercase">Encrypted</span>
          </div>
        </div>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-8 text-center text-[10px] font-mono text-gray-600 uppercase tracking-[.3em]">
        © 2026 RANGE_OS FOUNDATION | CLASSIFIED ENVIRONMENT
      </div>

      {/* Decorative corner accents */}
      <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-cyber-primary/10 rounded-tr-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-cyber-primary/10 rounded-bl-3xl pointer-events-none"></div>
    </div>
  );
}
