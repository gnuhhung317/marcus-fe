import { PaperSignal } from '@/lib/contracts/types';
import { LifecycleBadge } from '@/components/shared/lifecycle-badge';
import { EmptyStateCard } from '@/components/shared/api-state';

interface SignalTerminalTableProps {
  signals: PaperSignal[];
}

export function SignalTerminalTable({ signals }: SignalTerminalTableProps) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-border">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="bg-border/8 text-xs uppercase tracking-[0.12em] text-muted">
          <tr>
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">Pair</th>
            <th className="px-4 py-3">Side</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Confidence</th>
          </tr>
        </thead>
        <tbody>
          {signals.length ? signals.map((signal) => (
            <tr key={signal.signalId} className="border-t border-border/18 transition-colors hover:bg-border/8">
              <td className="px-4 py-3.5 text-muted">
                {Number.isNaN(Date.parse(signal.generatedAt))
                  ? signal.generatedAt
                  : new Date(signal.generatedAt).toLocaleTimeString()}
              </td>
              <td className="px-4 py-3.5 text-white">{signal.assetPair}</td>
              <td className="px-4 py-3.5 text-white">{signal.side}</td>
              <td className="px-4 py-3.5 text-muted"><LifecycleBadge status={signal.status} /></td>
              <td className="px-4 py-3.5 text-right text-white">{(signal.confidence * 100).toFixed(1)}%</td>
            </tr>
          )) : (
            <tr className="border-t border-border/18">
              <td colSpan={5} className="px-4 py-4">
                <EmptyStateCard title="No incoming paper signals" message="No signals were returned for the selected session window." />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
