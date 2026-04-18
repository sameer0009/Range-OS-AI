import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NotificationSeverity = 'CRITICAL' | 'HIGH' | 'SUCCESS' | 'INFO' | 'LOW';

export interface PlatformNotification {
  id: string;
  type: string; // SERVICE_FAILURE | POLICY_APPROVAL | LAB_STATE_CHANGE | ALERT_TRIGGERED | REPORT_COMPLETED | UPDATE_AVAILABLE
  severity: NotificationSeverity;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  service?: string;
}

export type ServiceStatus = 'HEALTHY' | 'DEGRADED' | 'OFFLINE' | 'UNREACHABLE';

export interface ServiceHealth {
  id: string;
  name: string;
  status: ServiceStatus;
  latency_ms: number;
  last_checked: string;
  error_detail?: string;
}

interface NotificationState {
  notifications: PlatformNotification[];
  serviceHealth: ServiceHealth[];
  isNotificationCenterOpen: boolean;
  unreadCount: number;

  addNotification: (n: Omit<PlatformNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAllRead: () => void;
  dismissNotification: (id: string) => void;
  clearAll: () => void;
  toggleNotificationCenter: (open?: boolean) => void;
  updateServiceHealth: (services: ServiceHealth[]) => void;
  pollHealth: () => Promise<void>;
}

const REGISTERED_SERVICES: { id: string; name: string; port: number }[] = [
  { id: 'api-gateway',          name: 'API Gateway',          port: 8000 },
  { id: 'lab-service',          name: 'Lab Core',             port: 8001 },
  { id: 'orchestration-service',name: 'Orchestration',        port: 8002 },
  { id: 'forensics-service',    name: 'Forensics',            port: 8003 },
  { id: 'reporting-service',    name: 'Reporting',            port: 8004 },
  { id: 'ai-service',           name: 'AI Core',              port: 8005 },
  { id: 'policy-service',       name: 'Policy',               port: 8006 },
  { id: 'identity-service',     name: 'Identity',             port: 8007 },
];

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [
        {
          id: 'boot-001',
          type: 'SERVICE_FAILURE',
          severity: 'INFO',
          title: 'Platform Boot Sequence Complete',
          message: 'All core services initialized. RangeOS AI is operational.',
          timestamp: new Date().toISOString(),
          read: false,
        },
      ],
      serviceHealth: REGISTERED_SERVICES.map(s => ({
        id: s.id, name: s.name, status: 'HEALTHY',
        latency_ms: Math.floor(Math.random() * 30) + 5,
        last_checked: new Date().toISOString(),
      })),
      isNotificationCenterOpen: false,
      unreadCount: 1,

      addNotification: (n) => {
        // Anti-spam: deduplicate same type+service within 60s
        const existing = get().notifications;
        const recentDupe = existing.find(e =>
          e.type === n.type && e.service === n.service &&
          Date.now() - new Date(e.timestamp).getTime() < 60_000
        );
        if (recentDupe) return;

        const notification: PlatformNotification = {
          ...n, id: crypto.randomUUID(), timestamp: new Date().toISOString(), read: false,
        };

        set(state => {
          // FIFO cap at 50 notifications
          const updated = [notification, ...state.notifications].slice(0, 50);
          return { notifications: updated, unreadCount: state.unreadCount + 1 };
        });
      },

      markAllRead: () => set(state => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0,
      })),

      dismissNotification: (id) => set(state => ({
        notifications: state.notifications.filter(n => n.id !== id),
        unreadCount: Math.max(0, state.unreadCount - 1),
      })),

      clearAll: () => set({ notifications: [], unreadCount: 0 }),

      toggleNotificationCenter: (open) => set(state => ({
        isNotificationCenterOpen: open !== undefined ? open : !state.isNotificationCenterOpen,
      })),

      updateServiceHealth: (services) => set({ serviceHealth: services }),

      pollHealth: async () => {
        // Simulated health poll — in production, fetch each service's /health endpoint
        const updated = REGISTERED_SERVICES.map(s => {
          const roll = Math.random();
          const status: ServiceStatus = roll > 0.05 ? 'HEALTHY' : roll > 0.02 ? 'DEGRADED' : 'OFFLINE';
          return {
            id: s.id, name: s.name, status,
            latency_ms: Math.floor(Math.random() * 50) + 5,
            last_checked: new Date().toISOString(),
            error_detail: status !== 'HEALTHY' ? `Probe timeout on :${s.port}/health` : undefined,
          };
        });

        // Emit notifications for newly degraded/offline services
        updated.forEach(svc => {
          const prev = get().serviceHealth.find(h => h.id === svc.id);
          if (prev?.status === 'HEALTHY' && svc.status === 'OFFLINE') {
            get().addNotification({
              type: 'SERVICE_FAILURE', severity: 'CRITICAL', service: svc.id,
              title: `${svc.name} Offline`,
              message: `${svc.name} is not responding. ${svc.error_detail ?? ''}`,
            });
          } else if (prev?.status === 'HEALTHY' && svc.status === 'DEGRADED') {
            get().addNotification({
              type: 'SERVICE_FAILURE', severity: 'HIGH', service: svc.id,
              title: `${svc.name} Degraded`,
              message: `${svc.name} is responding slowly (${svc.latency_ms}ms).`,
            });
          }
        });

        set({ serviceHealth: updated });
      },
    }),
    {
      name: 'rangeos-notifications',
      partialize: (state) => ({ notifications: state.notifications, unreadCount: state.unreadCount }),
    }
  )
);
