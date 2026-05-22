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
  if (!status) return 'bg-white/5 text-slate-400 border-white/5';
  if (['ACKNOWLEDGED', 'DELIVERED', 'SUCCESS'].includes(status)) {
    return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
  }
  if (['FAILED', 'ERROR'].includes(status)) {
    return 'bg-rose-500/10 text-rose-300 border-rose-500/20';
  }
  return 'bg-white/5 text-slate-300 border-white/5';
}

export function SignalStreamTable({ signals, onSelect }: SignalStreamTableProps) {
  if (!signals.length) {
    return (
      <div className="rounded-xl border border-white/5 bg-[var(--panel)] p-6 text-center text-sm text-slate-500">
        No signals received for this bot yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/5 bg-[var(--panel)]">
      <table className="min-w-full text-left text-xs border-collapse">
        <thead className="bg-[var(--panel-border)] border-b border-white/5 text-slate-400 font-semibold uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">Action</th>
            <th className="px-4 py-3">Symbol</th>
            <th className="px-4 py-3 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {signals.map((signal) => (
            <tr
              key={signal.signalId}
              className="hover:bg-white/[0.02] transition-colors cursor-pointer"
              onClick={() => onSelect(signal)}
            >
              <td className="px-4 py-3 text-slate-300">
                {formatTimestamp(signal.generatedTimestamp)}
              </td>
              <td className="px-4 py-3 text-white font-mono">
                {signal.action ?? '—'}
              </td>
              <td className="px-4 py-3 text-slate-300">
                {signal.symbol ?? '—'}
              </td>
              <td className="px-4 py-3 text-right">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${statusTone(signal.status)}`}>
                  <span className="w-1.2 h-1.2 rounded-full bg-current" />
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
