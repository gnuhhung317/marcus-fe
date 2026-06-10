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
      <section className={`glass-strong rounded-2xl border border-[var(--panel-border)] p-5 shadow-[var(--shadow-soft)] ${className}`}>
        <div className="flex flex-col gap-2 rounded-xl border border-dashed border-[var(--panel-border)] bg-surface p-6 text-center">
          <p className="text-sm font-semibold text-fg">No live/OOS performance yet</p>
          <p className="text-xs text-fg-muted">
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
          <article key={block.title} className="glass-strong h-full rounded-2xl border border-[var(--panel-border)] p-5 shadow-[var(--shadow-soft)]">
            <div className="flex h-full flex-col">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-fg">{block.title}</h3>
                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between rounded-lg border border-[var(--panel-border)] bg-surface px-3 py-3">
                    <span className="text-sm text-fg-muted">Annual return</span>
                    <span className="font-semibold text-positive">{block.annualReturn}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-[var(--panel-border)] bg-surface px-3 py-3">
                    <span className="text-sm text-fg-muted">Drawdown</span>
                    <span className="font-semibold text-negative">{block.maxDrawdown}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-[var(--panel-border)] bg-surface px-3 py-3">
                    <span className="text-sm text-fg-muted">Sharpe</span>
                    <span className="font-semibold text-fg">{block.sharpe}</span>
                  </div>
                </div>
              </div>

              {block.title === 'Out-of-sample' && block.warning ? (
                <p className="mt-4 rounded-lg border border-[var(--panel-border)] bg-warning-soft px-3 py-2 text-xs text-warning" title={block.warning}>
                  {block.warning}
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      <article className="glass-strong rounded-2xl border border-[var(--panel-border)] p-5 shadow-[var(--shadow-soft)]">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-2xl font-semibold text-fg">Performance chart</h3>
            <p className="mt-1 text-xs text-fg-muted">Normalized bot-level return with historical and out-of-sample phases.</p>
          </div>
          <span className="rounded-full border border-[var(--panel-border)] bg-positive-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-positive">
            Bot analytics
          </span>
        </div>
        <div className="mt-6">
          <PerformanceChart data={analytics.performanceSeries} splitTimestamp={analytics.splitTimestamp} />
        </div>
      </article>
    </section>
  );
}
