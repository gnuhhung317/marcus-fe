'use client';

import { SplitPerformanceChart } from '@/components/shared/split-performance-chart';
import { BotAnalyticsData } from '@/lib/contracts/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BotAnalyticsSectionProps {
  analytics?: BotAnalyticsData | null;
  className?: string;
}

export function BotAnalyticsSection({ analytics, className = '' }: BotAnalyticsSectionProps) {
  const hasChartData = (analytics?.performanceSeries.length ?? 0) >= 2;

  if (!analytics || !hasChartData) {
    return (
      <Card className={`p-5 bg-surface border-border shadow-soft ${className}`}>
        <div className="flex flex-col gap-2 rounded-xl border border-dashed border-border bg-surface p-6 text-center">
          <p className="text-sm font-semibold text-main">No live/OOS performance yet</p>
          <p className="text-xs text-muted">
            Analytics will appear after the bot has enough historical and live/dry run runtime data.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <section className={`space-y-5 ${className}`}>
      <div className="grid items-stretch gap-4 lg:grid-cols-3">
        {analytics.metricBlocks.map((block) => {
          const displayTitle = block.title === 'Out-of-sample' ? 'Live / Dry Run' : block.title;
          return (
            <Card key={block.title} className="p-5 bg-surface border-border shadow-soft flex flex-col justify-between">
              <div className="flex-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted font-sans">{displayTitle}</h3>
                <div className="mt-5 space-y-3 font-mono">
                  {[
                    { label: 'Annual return', value: block.sampleSizeDays || block.sampleSizeTrades ? block.annualReturn : 'N/A', tone: block.annualReturn.startsWith('-') ? 'text-negative' : 'text-positive' },
                    { label: 'Drawdown', value: block.sampleSizeDays || block.sampleSizeTrades ? block.maxDrawdown : 'N/A', tone: 'text-negative' },
                    { label: 'Sharpe ratio', value: block.sampleSizeDays || block.sampleSizeTrades ? block.sharpe : 'N/A', tone: 'text-main' },
                    { label: 'Sortino ratio', value: block.sampleSizeDays || block.sampleSizeTrades ? block.sortino : 'N/A', tone: 'text-main' },
                    { label: 'Calmar ratio', value: block.sampleSizeDays || block.sampleSizeTrades ? block.calmar : 'N/A', tone: 'text-main' },
                    { label: 'Profit factor', value: block.sampleSizeDays || block.sampleSizeTrades ? block.profitFactor : 'N/A', tone: 'text-main' },
                    { label: 'Win rate', value: block.sampleSizeTrades ? block.winRate : 'N/A', tone: 'text-main' },
                    { label: 'Sample days', value: String(block.sampleSizeDays), tone: 'text-muted' },
                    { label: 'Closed trades', value: String(block.sampleSizeTrades), tone: 'text-muted' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between rounded-lg border border-border bg-surface-strong px-3 py-2.5">
                      <span className="text-xs text-muted font-sans">{item.label}</span>
                      <span className={`text-sm font-bold ${item.tone}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {block.title === 'Out-of-sample' && block.warning ? (
                <div className="mt-4 rounded-lg border border-warning/20 bg-warning/5 px-3 py-2.5 text-xs text-warning" title={block.warning}>
                  {block.warning}
                </div>
              ) : null}
            </Card>
          );
        })}
      </div>

      <Card className="p-5 bg-surface border-border shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted font-sans">Performance Charts</h3>
          </div>
          <Badge variant="success">
            Bot Performance
          </Badge>
        </div>
        <div className="mt-6 border-t border-border/40 pt-6">
          <SplitPerformanceChart data={analytics.performanceSeries} splitTimestamp={analytics.splitTimestamp} />
        </div>
      </Card>
    </section>
  );
}
