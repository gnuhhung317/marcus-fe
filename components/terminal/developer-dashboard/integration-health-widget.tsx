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
    return 'border-positive/20 bg-positive/10 text-positive';
  }

  if (status === 'DEGRADED' || status === 'WARN') {
    return 'border-warning/20 bg-warning/10 text-warning';
  }

  return 'border-negative/20 bg-negative/10 text-negative';
}

export function IntegrationHealthWidget({ health }: IntegrationHealthWidgetProps) {
  if (!health) {
    return (
      <section className="rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-soft)]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted font-sans">Integration Health</h4>
        <p className="mt-2 text-xs text-muted font-sans">No health telemetry from backend yet.</p>
      </section>
    );
  }

  const tone = statusTone(health.overallStatus);

  return (
    <section className="rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted font-sans">Integration Health</h4>
          <p className="mt-1 text-[10px] text-muted font-mono">Last checked {formatTimestamp(health.lastCheckedAt)}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider font-mono ${tone}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {health.overallStatus}
        </span>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border/40 bg-surface/30 sm:grid sm:grid-cols-2">
        <div className="px-4 py-3">
          <p className="text-[9px] font-bold uppercase tracking-wider text-muted font-sans">Last signal</p>
          <p className="mt-1 text-xs font-bold text-main font-mono">{formatTimestamp(health.lastSignalAt)}</p>
        </div>
        <div className="border-t border-border/40 px-4 py-3 sm:border-l sm:border-t-0">
          <p className="text-[9px] font-bold uppercase tracking-wider text-muted font-sans">Message</p>
          <p className="mt-1 text-xs font-bold text-main font-sans">{health.message ?? '—'}</p>
        </div>
      </div>
    </section>
  );
}
