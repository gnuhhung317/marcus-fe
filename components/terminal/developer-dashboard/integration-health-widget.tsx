import { BotIntegrationHealth } from '@/lib/contracts/types';

interface IntegrationHealthWidgetProps {
  health: BotIntegrationHealth | null;
}

function formatTimestamp(value?: string | null) {
  if (!value) return '—';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

function statusTone(status: string) {
  if (status === 'UP' || status === 'OK' || status === 'HEALTHY') {
    return 'border-[var(--primary-soft)] bg-[var(--primary-soft)] text-positive';
  }

  if (status === 'DEGRADED' || status === 'WARN') {
    return 'border-[var(--warning-soft)] bg-[var(--warning-soft)] text-warning';
  }

  return 'border-[var(--negative-soft)] bg-[var(--negative-soft)] text-negative';
}

export function IntegrationHealthWidget({ health }: IntegrationHealthWidgetProps) {
  if (!health) {
    return (
      <section className="glass-strong h-full rounded-2xl border border-[var(--panel-border)] p-5 shadow-[var(--shadow-soft)]">
        <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-fg-muted">Integration health</h4>
        <p className="mt-2 text-sm text-fg-muted">No health telemetry from backend yet.</p>
      </section>
    );
  }

  const tone = statusTone(health.overallStatus);

  return (
    <section className="glass-strong h-full rounded-2xl border border-[var(--panel-border)] p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-fg-muted">Integration health</h4>
          <p className="mt-1 text-xs text-fg-muted">Last checked {formatTimestamp(health.lastCheckedAt)}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${tone}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {health.overallStatus}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--panel-border)] bg-surface p-3">
          <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">Last signal</p>
          <p className="mt-1 text-sm text-fg">{formatTimestamp(health.lastSignalAt)}</p>
        </div>
        <div className="rounded-xl border border-[var(--panel-border)] bg-surface p-3">
          <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">Message</p>
          <p className="mt-1 text-sm text-fg">{health.message ?? '—'}</p>
        </div>
      </div>
    </section>
  );
}
