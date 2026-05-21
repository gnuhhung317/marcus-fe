interface LifecycleBadgeProps {
  status: string;
  mode?: 'PAPER' | 'LIVE';
}

function statusTone(status: string) {
  const normalized = status.toUpperCase();

  if (normalized === 'RUNNING' || normalized === 'ACTIVE' || normalized === 'SUBSCRIBED' || normalized === 'SUCCESS') {
    return 'border-[var(--panel-border)] bg-[var(--primary-soft)] text-positive';
  }

  if (normalized === 'PAUSED' || normalized === 'PENDING' || normalized === 'QUEUED') {
    return 'border-[var(--panel-border)] bg-[var(--warning-soft)] text-warning';
  }

  if (normalized === 'FAILED' || normalized === 'REJECTED' || normalized === 'ERROR' || normalized === 'STOPPED') {
    return 'border-[var(--panel-border)] bg-[var(--negative-soft)] text-negative';
  }

  return 'border-[var(--panel-border)] bg-[var(--panel)] text-white';
}

export function LifecycleBadge({ status, mode }: LifecycleBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${statusTone(status)}`}>
      {mode ? `${mode} · ` : ''}
      {status}
    </span>
  );
}