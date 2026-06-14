'use client';

import { PerformanceChart } from '@/components/shared/performance-chart';
import { BotAnalyticsData } from '@/lib/contracts/types';

interface BotAnalyticsSectionProps {
  analytics?: BotAnalyticsData | null;
  className?: string;
}

export function BotAnalyticsSection({ analytics, className = '' }: BotAnalyticsSectionProps) {
  const hasChartData = (analytics?.performanceSeries.length ?? 0) >= 2;

  if (!analytics || !hasChartData) {
    return (
      <section className={`rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-soft)] ${className}`}>
        <div className="flex flex-col gap-2 rounded-xl border border-dashed border-border bg-surface p-6 text-center">
          <p className="text-sm font-semibold text-white">No live/OOS performance yet</p>
          <p className="text-xs text-slate-400">
            Analytics will appear after the bot has enough historical and out-of-sample runtime data.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={`space-y-5 ${className}`}>
      <div className="grid items-stretch gap-4 lg:grid-cols-3">
        {analytics.metricBlocks.map((block) => (
          <article key={block.title} className="rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-soft)] flex flex-col justify-between">
            <div className="flex-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">{block.title}</h3>
              <div className="mt-5 space-y-3 font-mono">
                <div className="flex items-center justify-between rounded-lg border border-border bg-surface-strong px-3 py-2.5">
                  <span className="text-xs text-slate-400 font-sans">Annual return</span>
                  <span className="text-sm font-bold text-positive">{block.annualReturn}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border bg-surface-strong px-3 py-2.5">
                  <span className="text-xs text-slate-400 font-sans">Drawdown</span>
                  <span className="text-sm font-bold text-negative">{block.maxDrawdown}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border bg-surface-strong px-3 py-2.5">
                  <span className="text-xs text-slate-400 font-sans">Sharpe ratio</span>
                  <span className="text-sm font-bold text-white">{block.sharpe}</span>
                </div>
              </div>
            </div>

            {block.title === 'Out-of-sample' && block.warning ? (
              <p className="mt-4 rounded-lg border border-warning/20 bg-warning/5 px-3 py-2.5 text-xs text-warning" title={block.warning}>
                {block.warning}
              </p>
            ) : null}
          </article>
        ))}
      </div>

      <article className="rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-soft)]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Performance Chart</h3>
            <p className="mt-1 text-xs text-slate-400 font-sans">Normalized bot-level return with historical and out-of-sample phases.</p>
          </div>
          <span className="rounded-lg border border-positive/20 bg-positive/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-positive font-mono">
            Bot Performance
          </span>
        </div>
        <div className="mt-6 border-t border-border/40 pt-6">
          <PerformanceChart data={analytics.performanceSeries} splitTimestamp={analytics.splitTimestamp} />
        </div>
      </article>
    </section>
  );
}
