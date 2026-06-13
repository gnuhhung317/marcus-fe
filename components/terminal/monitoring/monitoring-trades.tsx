import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyStateCard } from '@/components/shared/api-state';
import type { DashboardPageData } from '@/lib/contracts/types';
import { cn } from '@/lib/utils';

interface MonitoringTradesProps {
  dashboard: DashboardPageData;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDateTime(value: string) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

export function MonitoringTrades({ dashboard }: MonitoringTradesProps) {
  return (
    <Card variant="glass-strong" className="p-5">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-semibold text-main">Trade Detail</h2>
          <p className="mt-1 text-sm text-muted">Recent fills and exits to support monitoring and follow-up.</p>
        </div>
        <Badge variant="outline" className="bg-white/5">{dashboard.botTrades.length} trades</Badge>
      </div>
      <div className="mt-4 overflow-x-auto rounded-xl border border-border">
        {dashboard.botTrades.length === 0 ? (
          <EmptyStateCard title="No trade data" message="Recent fills and exits will appear here once the bot starts trading." />
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/[0.03] text-xs uppercase tracking-[0.14em] text-muted/60">
              <tr>
                <th className="px-3 py-2.5">Instrument</th>
                <th className="px-3 py-2.5">Side</th>
                <th className="px-3 py-2.5">Size</th>
                <th className="px-3 py-2.5">Entry</th>
                <th className="px-3 py-2.5">Exit</th>
                <th className="px-3 py-2.5">PnL</th>
                <th className="px-3 py-2.5">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.botTrades.map((trade, i) => (
                <tr key={`${trade.timestamp}-${trade.pair}-${i}`} className="border-t border-border text-muted hover:bg-white/[0.03]">
                  <td className="px-3 py-2.5 text-main">{trade.pair}</td>
                  <td className="px-3 py-2.5">{trade.side}</td>
                  <td className="px-3 py-2.5">{trade.size?.toFixed(4) ?? '--'}</td>
                  <td className="px-3 py-2.5">{trade.entryPrice ? formatCurrency(trade.entryPrice) : '--'}</td>
                  <td className="px-3 py-2.5">{trade.exitPrice ? formatCurrency(trade.exitPrice) : '--'}</td>
                  <td className={cn("px-3 py-2.5 font-semibold", trade.pnl >= 0 ? 'text-positive' : 'text-negative')}>
                    {trade.pnl >= 0 ? '+' : '-'}{formatCurrency(Math.abs(trade.pnl))}
                  </td>
                  <td className="px-3 py-2.5">{formatDateTime(trade.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  );
}
