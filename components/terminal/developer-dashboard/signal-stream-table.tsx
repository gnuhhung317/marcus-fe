import { DeveloperSignalItem } from '@/lib/contracts/types';

interface SignalStreamTableProps {
  signals: DeveloperSignalItem[];
  onSelect: (signal: DeveloperSignalItem) => void;
}

function formatTimestamp(value?: string | null) {
  if (!value) return '—';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

function statusTone(status?: string | null) {
  if (!status) return 'border-[var(--panel-border)] bg-surface text-fg-muted';
  if (['ACKNOWLEDGED', 'DELIVERED', 'SUCCESS'].includes(status)) {
    return 'border-[var(--primary-soft)] bg-[var(--primary-soft)] text-positive';
  }
  if (['FAILED', 'ERROR'].includes(status)) {
    return 'border-[var(--negative-soft)] bg-[var(--negative-soft)] text-negative';
  }
  return 'border-[var(--panel-border)] bg-surface text-fg';
}

export function SignalStreamTable({ signals, onSelect }: SignalStreamTableProps) {
  if (!signals.length) {
    return (
      <div className="glass-strong rounded-2xl border border-[var(--panel-border)] p-6 text-center text-sm text-fg-muted">
        No signals received for this bot yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--panel-border)] bg-surface">
      <table className="min-w-full border-collapse text-left text-xs">
        <thead className="border-b border-[var(--panel-border)] bg-surface-strong uppercase tracking-[0.14em] text-fg-muted">
          <tr>
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">Action</th>
            <th className="px-4 py-3">Symbol</th>
            <th className="px-4 py-3 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--panel-border)]">
          {signals.map((signal) => (
            <tr
              key={signal.signalId}
              className="cursor-pointer transition-colors hover:bg-[var(--panel-border)]/20"
              onClick={() => onSelect(signal)}
            >
              <td className="px-4 py-3 text-fg-muted">
                {formatTimestamp(signal.generatedTimestamp)}
              </td>
              <td className="px-4 py-3 font-mono text-fg">
                {signal.action ?? '—'}
              </td>
              <td className="px-4 py-3 text-fg">
                {signal.symbol ?? '—'}
              </td>
              <td className="px-4 py-3 text-right">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${statusTone(signal.status)}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {signal.status ?? 'UNKNOWN'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
