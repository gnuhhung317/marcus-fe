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
    return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
  }
  if (status === 'DEGRADED' || status === 'WARN') {
    return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
  }
  return 'bg-rose-500/10 text-rose-300 border-rose-500/20';
}

export function IntegrationHealthWidget({ health }: IntegrationHealthWidgetProps) {
  if (!health) {
    return (
      <div className="rounded-xl border border-white/5 bg-[var(--panel)] p-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Integration Health</h4>
        <p className="mt-2 text-sm text-slate-500">No health telemetry from backend yet.</p>
      </div>
    );
  }

  const tone = statusTone(health.overallStatus);

  return (
    <div className="rounded-xl border border-white/5 bg-[var(--panel)] p-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Integration Health</h4>
          <p className="mt-1 text-xs text-slate-500">Last checked {formatTimestamp(health.lastCheckedAt)}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${tone}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {health.overallStatus}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-white/5 bg-slate-950/40 p-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Last Signal</p>
          <p className="mt-1 text-sm text-white">{formatTimestamp(health.lastSignalAt)}</p>
        </div>
        <div className="rounded-lg border border-white/5 bg-slate-950/40 p-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Message</p>
          <p className="mt-1 text-sm text-slate-300">{health.message ?? '—'}</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-wider text-slate-500">Dependencies</p>
        <div className="space-y-2">
          {health.dependencies.length === 0 ? (
            <div className="rounded-lg border border-white/5 bg-slate-950/40 p-3 text-xs text-slate-500">
              No dependency telemetry from backend.
            </div>
          ) : (
            health.dependencies.map((dep) => (
              <div key={`${dep.name}-${dep.status}`} className="flex items-center justify-between rounded-lg border border-white/5 bg-slate-950/40 px-3 py-2 text-xs">
                <span className="text-slate-300">{dep.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500">{dep.latencyMs}ms</span>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusTone(dep.status)}`}>
                    {dep.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
