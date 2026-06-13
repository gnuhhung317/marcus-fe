import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyStateCard } from '@/components/shared/api-state';
import type { DeveloperConsolePageData } from '@/lib/contracts/types';

interface MonitoringLogsProps {
  ops: DeveloperConsolePageData;
}

function formatDateTime(value: string) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

export function MonitoringLogs({ ops }: MonitoringLogsProps) {
  const primarySignals = ops.signalStream.slice(0, 5);

  return (
    <section className="grid gap-6 xl:grid-cols-2">
      <Card variant="glass-strong" className="p-5">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-xl font-semibold text-main">Execution Logs</h2>
            <p className="mt-1 text-sm text-muted">Last runtime events from the system observability stream.</p>
          </div>
          <Badge variant="outline" className="bg-white/5">{ops.executionLogs.length} entries</Badge>
        </div>
        {ops.executionLogs.length === 0 ? (
          <div className="mt-4">
            <EmptyStateCard title="No execution logs" message="Runtime events will appear here when the system emits observability data." />
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {ops.executionLogs.map((log) => (
              <li key={`${log.timestamp}-${log.source}`} className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-muted">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-main">[{log.level}] {log.source}</span>
                  <span className="text-[11px] uppercase tracking-[0.16em] text-muted/50">{formatDateTime(log.timestamp)}</span>
                </div>
                <p className="mt-1.5 leading-relaxed">{log.message}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card variant="glass-strong" className="p-5">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-xl font-semibold text-main">Live Signal Stream</h2>
            <p className="mt-1 text-sm text-muted">Recent signals moving through the routing layer.</p>
          </div>
          <Badge variant="success" className="bg-positive/8">{ops.signalStream.length} signals</Badge>
        </div>
        {primarySignals.length === 0 ? (
          <div className="mt-4">
            <EmptyStateCard title="No recent signals" message="Signal activity will appear here when bots emit events." />
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/[0.03] text-xs uppercase tracking-[0.14em] text-muted/60">
                <tr>
                  <th className="px-3 py-2.5">Symbol</th>
                  <th className="px-3 py-2.5">Bot</th>
                  <th className="px-3 py-2.5">Action</th>
                  <th className="px-3 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {primarySignals.map((signal) => (
                  <tr key={signal.signalId} className="border-t border-border text-muted">
                    <td className="px-3 py-2.5 text-main">{signal.symbol}</td>
                    <td className="px-3 py-2.5">{signal.botId}</td>
                    <td className="px-3 py-2.5 text-main">{signal.action}</td>
                    <td className="px-3 py-2.5">{signal.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </section>
  );
}
