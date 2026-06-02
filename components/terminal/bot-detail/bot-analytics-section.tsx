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
      <section className={`glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)] ${className}`}>
        <div className="flex flex-col gap-2 rounded-xl border border-dashed border-[rgba(148,163,184,0.22)] bg-[rgba(15,23,42,0.5)] p-6 text-center">
          <p className="text-sm font-semibold text-white">No live/OOS performance yet</p>
          <p className="text-xs text-muted">
            Analytics will appear after the bot has enough historical and out-of-sample runtime data.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={`space-y-5 ${className}`}>
      <div className="grid gap-4 lg:grid-cols-3">
        {analytics.metricBlocks.map((block) => (
          <article key={block.title} className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
            <h3 className="text-lg font-semibold text-white">{block.title}</h3>
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-[rgba(132,162,191,0.22)] bg-white/[0.04] px-3 py-3">
                <span className="text-sm text-white">Estimated annual return</span>
                <span className="font-semibold text-positive">{block.annualReturn}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-[rgba(132,162,191,0.22)] bg-white/[0.04] px-3 py-3">
                <span className="text-sm text-white">Maximum drawdown</span>
                <span className="font-semibold text-negative">{block.maxDrawdown}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-[rgba(132,162,191,0.22)] bg-white/[0.04] px-3 py-3">
                <span className="text-sm text-white">Sharpe ratio</span>
                <span className="font-semibold text-white">{block.sharpe}</span>
              </div>
            </div>
            {block.title === 'Out-of-sample' && block.warning ? (
              <p className="mt-4 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-200" title={block.warning}>
                {block.warning}
              </p>
            ) : null}
          </article>
        ))}
      </div>

      <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-2xl font-semibold text-white">Performance Chart</h3>
            <p className="mt-1 text-xs text-muted">Normalized bot-level return with historical and out-of-sample phases.</p>
          </div>
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
            Bot Analytics
          </span>
        </div>
        <div className="mt-6">
          <PerformanceChart data={analytics.performanceSeries} splitTimestamp={analytics.splitTimestamp} />
        </div>
      </article>
    </section>
  );
}
