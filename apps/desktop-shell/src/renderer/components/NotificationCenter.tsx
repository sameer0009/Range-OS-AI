import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, X, CheckCircle2, AlertTriangle, AlertCircle, Info, Zap, Trash2 } from 'lucide-react';
import { useNotificationStore, PlatformNotification, NotificationSeverity } from '../store/NotificationStore';

// ─── Severity styling helpers ──────────────────────────────────────────────
const severityConfig: Record<NotificationSeverity, { icon: React.ReactNode; color: string; bg: string }> = {
  CRITICAL:{ icon: <AlertCircle size={14} />, color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/30' },
  HIGH:    { icon: <AlertTriangle size={14}/>, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' },
  SUCCESS: { icon: <CheckCircle2 size={14} />, color: 'text-emerald-400',bg: 'bg-emerald-500/10 border-emerald-500/30' },
  INFO:    { icon: <Info size={14} />,          color: 'text-blue-400',  bg: 'bg-blue-500/10 border-blue-500/30' },
  LOW:     { icon: <Zap size={14} />,           color: 'text-gray-400',  bg: 'bg-white/5 border-white/10' },
};

// ─── Single notification item ───────────────────────────────────────────────
function NotificationItem({ n, onDismiss }: { n: PlatformNotification; onDismiss: () => void }) {
  const cfg = severityConfig[n.severity];
  const relativeTime = React.useMemo(() => {
    const diff = Date.now() - new Date(n.timestamp).getTime();
    if (diff < 60_000) return 'just now';
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    return `${Math.floor(diff / 3_600_000)}h ago`;
  }, [n.timestamp]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`relative p-3 rounded-lg border ${cfg.bg} ${!n.read ? 'shadow-sm' : 'opacity-60'}`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 flex-shrink-0 ${cfg.color}`}>{cfg.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span className={`text-[11px] font-mono font-bold uppercase ${cfg.color}`}>{n.title}</span>
            <span className="text-[9px] font-mono text-gray-600 flex-shrink-0">{relativeTime}</span>
          </div>
          <p className="text-[10px] text-gray-400 font-mono leading-relaxed">{n.message}</p>
        </div>
        <button onClick={onDismiss} className="flex-shrink-0 text-gray-700 hover:text-gray-400 transition-colors mt-0.5">
          <X size={12} />
        </button>
      </div>
      {!n.read && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-1/2 rounded-full bg-current opacity-60" />
      )}
    </motion.div>
  );
}

// ─── Notification Center Panel ──────────────────────────────────────────────
export function NotificationCenter() {
  const {
    notifications, unreadCount, isNotificationCenterOpen,
    toggleNotificationCenter, markAllRead, dismissNotification, clearAll,
  } = useNotificationStore();

  // Close on Escape
  useEffect(() => {
    const down = (e: KeyboardEvent) => { if (e.key === 'Escape') toggleNotificationCenter(false); };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [toggleNotificationCenter]);

  return (
    <>
      {/* ── Bell Trigger ── */}
      <button
        id="notification-center-toggle"
        onClick={() => { toggleNotificationCenter(); markAllRead(); }}
        className="relative flex items-center justify-center w-7 h-7 rounded-md hover:bg-white/5 transition-colors text-gray-500 hover:text-white"
      >
        <Bell size={14} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[9px] font-bold text-white font-mono">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* ── Panel ── */}
      <AnimatePresence>
        {isNotificationCenterOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80]"
              onClick={() => toggleNotificationCenter(false)}
            />
            {/* Slide-out Panel */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-[90] w-80 bg-[#0a0f1e]/95 backdrop-blur-xl border-l border-white/10 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Bell size={14} className="text-cyber-primary" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-widest">Notification Center</span>
                </div>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <button onClick={clearAll} className="text-[10px] font-mono text-gray-600 hover:text-gray-400 transition-colors flex items-center gap-1">
                      <Trash2 size={10} /> Clear All
                    </button>
                  )}
                  <button onClick={() => toggleNotificationCenter(false)} className="text-gray-600 hover:text-white transition-colors">
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Notification List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-12">
                    <CheckCircle2 size={32} className="text-gray-800" />
                    <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">All systems nominal</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {notifications.map(n => (
                      <NotificationItem key={n.id} n={n} onDismiss={() => dismissNotification(n.id)} />
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-[9px] font-mono text-gray-700 uppercase tracking-widest">{notifications.length} total events</span>
                <div className="text-[9px] font-mono text-emerald-600 animate-pulse">● LIVE MONITOR</div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
