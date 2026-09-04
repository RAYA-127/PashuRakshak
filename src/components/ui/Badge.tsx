import type { RiskLevel, CaseStatus } from '@/services/mockData';

const riskConfig: Record<RiskLevel, { label: string; classes: string; dot: string }> = {
  LOW: { label: 'Low Risk', classes: 'bg-safe-100 text-safe-700 border-safe-200', dot: 'bg-safe-500' },
  MEDIUM: { label: 'Medium Risk', classes: 'bg-warn-100 text-warn-700 border-warn-200', dot: 'bg-warn-500' },
  HIGH: { label: 'High Risk', classes: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
  CRITICAL: { label: 'Critical Alert', classes: 'bg-danger-100 text-danger-700 border-danger-200', dot: 'bg-danger-500' },
};

const statusConfig: Record<CaseStatus, { label: string; classes: string }> = {
  PENDING_VET_REVIEW: { label: 'Pending Review', classes: 'bg-warn-100 text-warn-700' },
  CONFIRMED: { label: 'Confirmed', classes: 'bg-danger-100 text-danger-700' },
  DISMISSED: { label: 'Dismissed', classes: 'bg-ink-100 text-ink-500' },
  FIELD_VISIT: { label: 'Field Visit', classes: 'bg-blue-100 text-blue-700' },
  RESOLVED: { label: 'Resolved', classes: 'bg-safe-100 text-safe-700' },
};

export function RiskBadge({ level, size = 'sm' }: { level: RiskLevel; size?: 'sm' | 'md' }) {
  const cfg = riskConfig[level];
  const pad = size === 'md' ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${cfg.classes} ${pad}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export function StatusBadge({ status }: { status: CaseStatus }) {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}

export function riskColor(level: RiskLevel): string {
  switch (level) {
    case 'LOW': return '#10b981';
    case 'MEDIUM': return '#f59e0b';
    case 'HIGH': return '#f97316';
    case 'CRITICAL': return '#ef4444';
  }
}
