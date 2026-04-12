interface LifecycleBadgeProps {
  status: string;
  mode?: 'PAPER' | 'LIVE';
}

function statusTone(status: string) {
  const normalized = status.toUpperCase();

  if (normalized === 'RUNNING' || normalized === 'ACTIVE' || normalized === 'SUBSCRIBED' || normalized === 'SUCCESS') {
    return 'border-[rgba(16,185,129,0.35)] bg-[rgba(6,78,59,0.36)] text-[rgba(209,250,229,0.95)]';
  }

  if (normalized === 'PAUSED' || normalized === 'PENDING' || normalized === 'QUEUED') {
    return 'border-[rgba(245,158,11,0.35)] bg-[rgba(120,53,15,0.35)] text-[rgba(254,240,138,0.98)]';
  }

  if (normalized === 'FAILED' || normalized === 'REJECTED' || normalized === 'ERROR' || normalized === 'STOPPED') {
    return 'border-[rgba(244,63,94,0.38)] bg-[rgba(127,29,29,0.36)] text-[rgba(254,226,226,0.98)]';
  }

  return 'border-[rgba(148,163,184,0.28)] bg-[rgba(15,23,42,0.62)] text-white';
}

export function LifecycleBadge({ status, mode }: LifecycleBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${statusTone(status)}`}>
      {mode ? `${mode} · ` : ''}
      {status}
    </span>
  );
}