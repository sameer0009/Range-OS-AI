import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, Zap } from 'lucide-react';
import { useNotificationStore, PlatformNotification, NotificationSeverity } from '../store/NotificationStore';

const severityConfig: Record<NotificationSeverity, { icon: React.ReactNode; border: string; glow: string }> = {
  CRITICAL:{ icon: <AlertCircle size={16} />,  border: 'border-red-500/60',    glow: 'shadow-red-500/20' },
  HIGH:    { icon: <AlertTriangle size={16} />, border: 'border-orange-500/60', glow: 'shadow-orange-500/20' },
  SUCCESS: { icon: <CheckCircle2 size={16} />,  border: 'border-emerald-500/60',glow: 'shadow-emerald-500/20' },
  INFO:    { icon: <Info size={16} />,           border: 'border-blue-500/60',   glow: 'shadow-blue-500/20' },
  LOW:     { icon: <Zap size={16} />,            border: 'border-white/20',      glow: '' },
};

function Toast({ n }: { n: PlatformNotification }) {
  const { dismissNotification } = useNotificationStore();
  const cfg = severityConfig[n.severity];

  // Auto-dismiss after 5 seconds for non-CRITICAL toasts
  useEffect(() => {
    if (n.severity === 'CRITICAL') return;
    const t = setTimeout(() => dismissNotification(n.id), 5000);
    return () => clearTimeout(t);
  }, [n.id, n.severity, dismissNotification]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={`w-80 bg-[#0a0f1e]/95 backdrop-blur-xl border ${cfg.border} rounded-xl p-3 shadow-xl ${cfg.glow} flex items-start gap-3 cursor-pointer`}
      onClick={() => dismissNotification(n.id)}
    >
      <div className="flex-shrink-0 mt-0.5">{cfg.icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-mono font-bold text-white uppercase tracking-wide">{n.title}</p>
        <p className="text-[10px] font-mono text-gray-400 mt-0.5 leading-relaxed">{n.message}</p>
      </div>
      {n.severity === 'CRITICAL' && (
        <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse mt-1.5" />
      )}
    </motion.div>
  );
}

// Only show toasts for HIGH and CRITICAL that are unread and fresh (<10s old)
export function ToastContainer() {
  const { notifications } = useNotificationStore();

  const toasts = notifications.filter(n =>
    (n.severity === 'CRITICAL' || n.severity === 'HIGH') &&
    !n.read &&
    Date.now() - new Date(n.timestamp).getTime() < 10_000
  );

  return (
    <div className="fixed top-14 right-4 z-[95] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map(n => (
          <div key={n.id} className="pointer-events-auto">
            <Toast n={n} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
