import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PerformanceChart } from '@/components/shared/performance-chart';
import type { DashboardPageData } from '@/lib/contracts/types';
import { cn } from '@/lib/utils';

interface MonitoringPerformanceProps {
  dashboard: DashboardPageData & { performanceSeries: { timestamp: string; value: number }[] };
  lastUpdated: string;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);
}

function formatSignedCurrency(value: number) {
  const formatted = formatCurrency(Math.abs(value));
  return `${value >= 0 ? '+' : '-'}${formatted}`;
}

function formatDateTime(value: string) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

export function MonitoringPerformance({ dashboard, lastUpdated }: MonitoringPerformanceProps) {
  const openPnL = dashboard.botTrades.reduce((sum, trade) => sum + trade.pnl, 0);

  return (
    <section className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
      <Card variant="glass-strong" className="p-5">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h2 className="text-xl font-semibold text-main">Equity Curve</h2>
            <p className="mt-1 text-sm text-muted">Latest performance series from the portfolio engine.</p>
          </div>
          <Badge variant="success" className="bg-positive/8 text-[11px]">
            {formatDateTime(lastUpdated)}
          </Badge>
        </div>
        <div className="mt-5">
          <PerformanceChart data={dashboard.performanceSeries} />
        </div>
      </Card>

      <Card variant="glass-strong" className="p-5">
        <div className="border-b border-border pb-4">
          <h2 className="text-xl font-semibold text-main">Exchange Allocation</h2>
          <p className="mt-1 text-sm text-muted">Current capital distribution across venues.</p>
        </div>
        <div className="mt-5 space-y-4">
          {dashboard.allocations.map((slice) => (
            <div key={slice.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-main">{slice.name}</span>
                <span className="font-semibold text-positive">{slice.value.toFixed(1)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,var(--semantic-positive),rgba(0,190,115,0.45))]"
                  style={{ width: `${Math.max(2, slice.value)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <Card variant="default" className="mt-6 border-border/10 bg-canvas/50 p-4 text-sm text-muted">
          Open PnL: <span className={cn("font-semibold", openPnL < 0 ? "text-negative" : "text-positive")}>
            {formatSignedCurrency(openPnL)}
          </span>
        </Card>
      </Card>
    </section>
  );
}
