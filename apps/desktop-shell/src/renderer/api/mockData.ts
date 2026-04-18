export interface LabInstance {
  id: string;
  name: string;
  template: string;
  status: 'running' | 'deploying' | 'failed' | 'paused';
  nodes: number;
  uptime: string;
}

export interface SecurityAlert {
  id: string;
  level: 'critical' | 'warn' | 'info';
  source: string;
  message: string;
  timestamp: string;
}

export interface EvidenceCase {
  id: string;
  name: string;
  artifacts: number;
  status: 'sealed' | 'active';
  isVerified: boolean;
}

export interface AISuggestion {
  id: string;
  title: string;
  description: string;
  type: 'security' | 'efficiency' | 'network';
}

export const mockDashboardData = {
  labs: [
    { id: 'L-701', name: 'AD-EXPLOIT-01', template: 'Active Directory Range', status: 'running', nodes: 8, uptime: '14h 22m' },
    { id: 'L-702', name: 'MALWARE-ANALYSIS-B', template: 'Isolated Sandbox', status: 'deploying', nodes: 2, uptime: '0m' },
    { id: 'L-703', name: 'SOC-TRAINING-PRO', template: 'Enterprise Blue Team', status: 'paused', nodes: 24, uptime: '3d 2h' },
  ] as LabInstance[],
  
  alerts: [
    { id: 'A-01', level: 'critical', source: 'IDS-SNORT', message: 'Potential DCShadow attack detected on SRV-01', timestamp: '2m ago' },
    { id: 'A-02', level: 'warn', source: 'POLICY-SVC', message: 'Unauthorized outbound SSH attempt from Lab-701', timestamp: '15m ago' },
    { id: 'A-03', level: 'info', source: 'SYS-AUDIT', message: 'Lab backup cycle completed successfully', timestamp: '1h ago' },
  ] as SecurityAlert[],

  evidence: [
    { id: 'C-2026-001', name: 'FINANCE-BREACH-MAY', artifacts: 142, status: 'sealed', isVerified: true },
    { id: 'C-2026-003', name: 'MALWARE-BEACON-X', artifacts: 12, status: 'active', isVerified: false },
  ] as EvidenceCase[],

  suggestions: [
    { id: 'S-01', title: 'Network Optimization', description: 'Enable jumbo frames on Lab-703 to reduce latency during massive data exfiltration tests.', type: 'efficiency' },
    { id: 'S-02', title: 'Suspicious Subnet', description: 'Lab-701 has established a persistence bridge to an unlisted IP. Recommend immediate snapshots.', type: 'security' },
  ] as AISuggestion[]
};

export const getDashboardData = async () => {
  // Simulate network latency for premium feel
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockDashboardData;
};
