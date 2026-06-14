import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyStateCard } from '@/components/shared/api-state';
import type { DashboardPageData } from '@/lib/contracts/types';
import { cn } from '@/lib/utils';
import { History, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MonitoringTradesProps {
  dashboard: DashboardPageData;
  className?: string;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);
}

function formatTimeOnly(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toTimeString().split(' ')[0];
}

function formatDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString();
}

export function MonitoringTrades({ dashboard, className }: MonitoringTradesProps) {
  return (
    <Card variant="glass-strong" className={cn("flex flex-col border border-border bg-canvas/30 p-5 h-full", className)}>
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-muted">
            <History className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-main">Recent Executions</h2>
            <p className="text-xs text-muted">Recent fills and exits recorded by the executor.</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-white/5 border-border text-[11px] text-muted">
          {dashboard.botTrades.length} fills
        </Badge>
      </div>

      <div className="mt-4 flex-1 overflow-hidden rounded-lg border border-white/5 bg-black/20">
        {dashboard.botTrades.length === 0 ? (
          <div className="p-8">
            <EmptyStateCard 
              title="No fills recorded" 
              message="Strategy execution events will register here once positions are initialized." 
            />
          </div>
        ) : (
          <div className="h-[520px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-neutral-950/90 backdrop-blur-md text-[10px] text-muted/60 uppercase tracking-wider border-b border-white/5 z-10">
                <tr>
                  <th className="px-3 py-2.5">Instrument</th>
                  <th className="px-3 py-2.5">Side</th>
                  <th className="px-3 py-2.5 text-right">Size</th>
                  <th className="px-3 py-2.5 text-right">Price</th>
                  <th className="px-3 py-2.5 text-right">PnL</th>
                  <th className="px-3 py-2.5 text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.botTrades.map((trade, i) => {
                  const isBuy = trade.side.toUpperCase() === 'BUY';
                  const isProfit = trade.pnl >= 0;
                  
                  return (
                    <tr 
                      key={`${trade.timestamp}-${trade.pair}-${i}`} 
                      className="border-b border-white/[0.02] text-muted hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-3 py-3 font-semibold text-main">
                        {trade.pair}
                      </td>
                      <td className="px-3 py-3">
                        <span className={cn(
                          "inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded",
                          isBuy 
                            ? "bg-positive/10 text-positive border border-positive/20" 
                            : "bg-negative/10 text-negative border border-negative/20"
                        )}>
                          {isBuy ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {trade.side.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-main/90">
                        {trade.size?.toFixed(4) ?? '--'}
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-muted/80">
                        {trade.exitPrice ? formatCurrency(trade.exitPrice) : trade.entryPrice ? formatCurrency(trade.entryPrice) : '--'}
                      </td>
                      <td className={cn(
                        "px-3 py-3 text-right font-mono font-semibold", 
                        isProfit ? 'text-positive' : 'text-negative'
                      )}>
                        {trade.pnl !== 0 ? (
                          <span className="inline-flex items-center gap-0.5 justify-end">
                            {isProfit ? '+' : ''}
                            {formatCurrency(trade.pnl)}
                          </span>
                        ) : (
                          <span className="text-muted/40">--</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-muted/40 text-[10px]">
                        <div>{formatTimeOnly(trade.timestamp)}</div>
                        <div className="text-[9px] text-muted/30">{formatDate(trade.timestamp)}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
}
