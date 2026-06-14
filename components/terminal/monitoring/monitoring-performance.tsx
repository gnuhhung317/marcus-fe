import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EquityChart } from '@/components/shared/equity-chart';
import type { DashboardPageData } from '@/lib/contracts/types';
import { cn } from '@/lib/utils';
import { TrendingUp, Wallet, ArrowUpRight } from 'lucide-react';

interface MonitoringPerformanceProps {
  dashboard: DashboardPageData & { performanceSeries: { timestamp: string; value: number }[] };
  lastUpdated: string;
  range: string;
  onRangeChange: (range: string) => void;
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

export function MonitoringPerformance({ dashboard, lastUpdated, range, onRangeChange }: MonitoringPerformanceProps) {
  const openPnL = dashboard.botTrades.reduce((sum, trade) => sum + trade.pnl, 0);

  const series = dashboard.performanceSeries;
  const hasSeries = series && series.length > 0;
  
  const currentEquity = hasSeries ? (series[series.length - 1]?.value ?? 0) : 0;
  const initialEquity = hasSeries ? (series[0]?.value ?? 0) : 0;
  const changeEquity = currentEquity - initialEquity;
  const changePercent = initialEquity !== 0 ? (changeEquity / initialEquity) * 100 : 0;
  const changePercentStr = `${changeEquity >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`;
  
  const peakEquity = hasSeries ? Math.max(...series.map((p) => p.value)) : 0;
  const drawdown = currentEquity - peakEquity;

  return (
    <div className="flex flex-col gap-6">
      {/* Equity Curve Card */}
      <Card variant="glass-strong" className="border border-border bg-canvas/30 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-muted">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-main">Equity Curve</h2>
              <p className="text-xs text-muted">Real-time performance metrics from the portfolio engine.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Time Window Selector */}
            <div className="flex items-center rounded-lg bg-black/20 p-0.5 border border-white/5">
              {(['1D', '7D', '30D', 'ALL'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => onRangeChange(r)}
                  className={cn(
                    "px-2.5 py-1 text-[11px] font-medium rounded-md transition-all duration-150 border",
                    range === r
                      ? "bg-positive/10 text-positive border-positive/20 shadow-sm"
                      : "text-muted hover:text-main border-transparent"
                  )}
                >
                  {r === '7D' ? '1W' : r === '30D' ? '1M' : r}
                </button>
              ))}
            </div>
            <Badge variant="outline" className="bg-white/5 border-border text-[11px] text-muted whitespace-nowrap">
              Updated: {formatDateTime(lastUpdated)}
            </Badge>
          </div>
        </div>

        {/* Stats Strip */}
        {hasSeries && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-white/5 bg-black/10 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted">Current Balance</div>
              <div className="mt-1 font-mono text-base font-bold text-main">
                {formatCurrency(currentEquity)}
              </div>
            </div>
            
            <div className="rounded-lg border border-white/5 bg-black/10 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted">Total Change</div>
              <div className={cn(
                "mt-1 font-mono text-base font-bold",
                changeEquity >= 0 ? "text-positive" : "text-negative"
              )}>
                {formatSignedCurrency(changeEquity)}
                <span className="ml-1 text-[11px] font-normal opacity-85">({changePercentStr})</span>
              </div>
            </div>
            
            <div className="rounded-lg border border-white/5 bg-black/10 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted">Peak Balance</div>
              <div className="mt-1 font-mono text-base font-bold text-main">
                {formatCurrency(peakEquity)}
              </div>
            </div>
            
            <div className="rounded-lg border border-white/5 bg-black/10 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted">Drawdown</div>
              <div className={cn(
                "mt-1 font-mono text-base font-bold",
                drawdown < 0 ? "text-negative" : "text-positive"
              )}>
                {drawdown === 0 ? '$0.00' : formatCurrency(drawdown)}
              </div>
            </div>
          </div>
        )}

        <div className="mt-5">
          <EquityChart data={dashboard.performanceSeries} height={300} />
        </div>
      </Card>

      {/* Exchange Allocation Card */}
      <Card variant="glass-strong" className="border border-border bg-canvas/30 p-5">
        <div className="border-b border-border pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-muted">
              <Wallet className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-main">Exchange Allocation</h2>
              <p className="text-xs text-muted">Capital distribution and live open exposure.</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted">
            Open PnL: 
            <span className={cn(
              "font-mono font-bold inline-flex items-center gap-0.5", 
              openPnL < 0 ? "text-negative" : "text-positive"
            )}>
              {openPnL >= 0 ? '+' : ''}
              {formatCurrency(openPnL)}
            </span>
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {dashboard.allocations.map((slice) => (
            <div key={slice.name} className="space-y-2 rounded-lg border border-white/5 bg-black/10 p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">{slice.name}</span>
                <span className="font-semibold text-positive font-mono">{slice.value.toFixed(1)}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,var(--semantic-positive),rgba(0,190,115,0.45))]"
                  style={{ width: `${Math.max(2, slice.value)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
