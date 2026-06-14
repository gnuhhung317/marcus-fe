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
  if (!status) return 'border-border bg-surface text-slate-400';
  if (['ACKNOWLEDGED', 'DELIVERED', 'SUCCESS'].includes(status)) {
    return 'border-positive/20 bg-positive/10 text-positive';
  }
  if (['FAILED', 'ERROR'].includes(status)) {
    return 'border-negative/20 bg-negative/10 text-negative';
  }
  return 'border-border bg-surface text-white';
}

function formatPrice(value?: number | null) {
  if (value === undefined || value === null) return '—';
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  });
}

function formatSize(value?: number | null) {
  if (value === undefined || value === null) return '—';
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  });
}

export function SignalStreamTable({ signals, onSelect }: SignalStreamTableProps) {
  if (!signals.length) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface p-6 text-center text-xs text-slate-400 font-sans">
        No signals received for this bot yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface font-mono">
      <table className="min-w-full border-collapse text-left text-[11px] leading-relaxed">
        <thead className="border-b border-border bg-surface-strong uppercase text-[9px] font-bold tracking-wider text-slate-500 font-sans">
          <tr>
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">Action</th>
            <th className="px-4 py-3">Symbol</th>
            <th className="px-4 py-3 text-right">Price</th>
            <th className="px-4 py-3 text-right">Size</th>
            <th className="px-4 py-3 text-right">SL</th>
            <th className="px-4 py-3 text-right">TP</th>
            <th className="px-4 py-3 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {signals.map((signal) => (
            <tr
              key={signal.signalId}
              className="cursor-pointer transition-colors hover:bg-white/5"
              onClick={() => onSelect(signal)}
            >
              <td className="px-4 py-3 text-slate-400 font-sans">
                {formatTimestamp(signal.generatedTimestamp)}
              </td>
              <td className="px-4 py-3 font-bold text-white uppercase">
                {signal.action ?? '—'}
              </td>
              <td className="px-4 py-3 text-white">
                {signal.symbol ?? '—'}
              </td>
              <td className="px-4 py-3 text-right text-white font-mono">
                {formatPrice(signal.price)}
              </td>
              <td className="px-4 py-3 text-right text-white font-mono">
                {formatSize(signal.size)}
              </td>
              <td className="px-4 py-3 text-right text-slate-400 font-mono">
                {formatPrice(signal.sl)}
              </td>
              <td className="px-4 py-3 text-right text-slate-400 font-mono">
                {formatPrice(signal.tp)}
              </td>
              <td className="px-4 py-3 text-right">
                <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${statusTone(signal.status)}`}>
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
