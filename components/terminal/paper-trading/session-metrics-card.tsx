import { PaperSessionData } from '@/lib/contracts/types';

interface SessionMetricsCardProps {
  session: PaperSessionData;
  signalCount: number;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);
}

export function SessionMetricsCard({ session, signalCount }: SessionMetricsCardProps) {
  return (
    <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
      <h2 className="text-xl font-semibold text-white">Session Metrics</h2>
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between rounded-xl bg-surface px-3 py-2">
          <span className="text-muted">Virtual Balance</span>
          <span className="font-semibold text-white">{formatCurrency(session.virtualBalance)}</span>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-surface px-3 py-2">
          <span className="text-muted">Open PnL</span>
          <span className={`font-semibold ${session.openPnl >= 0 ? 'text-positive' : 'text-negative'}`}>
            {session.openPnl >= 0 ? '+' : ''}
            {formatCurrency(session.openPnl)}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-surface px-3 py-2">
          <span className="text-muted">Buying Power</span>
          <span className="font-semibold text-white">{formatCurrency(session.buyingPower)}</span>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-surface px-3 py-2">
          <span className="text-muted">Latest Signal Count</span>
          <span className="font-semibold text-white">{signalCount}</span>
        </div>
      </div>
    </article>
  );
}
