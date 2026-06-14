import { DeveloperSignalItem } from '@/lib/contracts/types';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface SignalStreamTableProps {
  signals: DeveloperSignalItem[];
  onSelect: (signal: DeveloperSignalItem) => void;
}

function formatTimestamp(value?: string | null) {
  if (!value) return '—';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

function statusTone(status?: string | null): BadgeProps['variant'] {
  if (!status) return 'outline';
  if (['ACKNOWLEDGED', 'DELIVERED', 'SUCCESS'].includes(status)) return 'success';
  if (['FAILED', 'ERROR'].includes(status)) return 'error';
  return 'outline';
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
      <Card className="rounded-xl border-dashed border-border bg-surface p-6 text-center text-xs text-muted font-sans">
        No signals received for this bot yet.
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-border bg-surface font-mono">
      <table className="min-w-full border-collapse text-left text-[11px] leading-relaxed">
        <thead className="border-b border-border bg-surface-strong uppercase text-[9px] font-bold tracking-wider text-muted font-sans">
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
              className="cursor-pointer transition-colors hover:bg-surface-strong"
              onClick={() => onSelect(signal)}
            >
              <td className="px-4 py-3 text-muted font-sans">
                {formatTimestamp(signal.generatedTimestamp)}
              </td>
              <td className="px-4 py-3 font-bold text-main uppercase">
                {signal.action ?? '—'}
              </td>
              <td className="px-4 py-3 text-main">
                {signal.symbol ?? '—'}
              </td>
              <td className="px-4 py-3 text-right font-mono text-main">
                {formatPrice(signal.price)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-main">
                {formatSize(signal.size)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-muted">
                {formatPrice(signal.sl)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-muted">
                {formatPrice(signal.tp)}
              </td>
              <td className="px-4 py-3 text-right">
                <Badge variant={statusTone(signal.status)} className="rounded-lg px-2.5 py-1 text-[9px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {signal.status ?? 'UNKNOWN'}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
