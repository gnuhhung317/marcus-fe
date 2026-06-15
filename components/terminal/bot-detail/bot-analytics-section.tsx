'use client';

import { SplitPerformanceChart } from '@/components/shared/split-performance-chart';
import { Card } from '@/components/ui/card';
import { BotAnalyticsData, BotMetricBlock } from '@/lib/contracts/types';

interface BotAnalyticsSectionProps {
  analytics?: BotAnalyticsData | null;
  className?: string;
}

const metricRows = [
  { label: 'Annual return', key: 'annualReturn', tone: 'return' },
  { label: 'Max drawdown', key: 'maxDrawdown', tone: 'negative' },
  { label: 'Sharpe ratio', key: 'sharpe', tone: 'neutral' },
  { label: 'Sortino ratio', key: 'sortino', tone: 'neutral' },
  { label: 'Calmar ratio', key: 'calmar', tone: 'neutral' },
  { label: 'Profit factor', key: 'profitFactor', tone: 'neutral' },
  { label: 'Win rate', key: 'winRate', tone: 'neutral' },
  { label: 'Sample days', key: 'sampleSizeDays', tone: 'muted' },
  { label: 'Closed trades', key: 'sampleSizeTrades', tone: 'muted' },
] as const;

type MetricTone = (typeof metricRows)[number]['tone'];

function formatBlockTitle(title: BotMetricBlock['title']) {
  return title === 'Out-of-sample' ? 'Live / Dry Run' : title;
}

function getValueTone(tone: MetricTone, value: string) {
  if (!value || value === 'N/A') {
    return 'text-muted';
  }

  if (tone === 'return') {
    return value.startsWith('-') ? 'text-negative' : 'text-positive';
  }

  if (tone === 'negative') {
    return 'text-negative';
  }

  if (tone === 'muted') {
    return 'text-muted';
  }

  return 'text-main';
}

function formatMetricValue(value: string | number) {
  return typeof value === 'number' ? String(value) : value;
}

export function BotAnalyticsSection({ analytics, className = '' }: BotAnalyticsSectionProps) {
  const hasChartData = (analytics?.performanceSeries.length ?? 0) >= 2;

  if (!analytics || !hasChartData) {
    return (
      <Card className={`p-5 ${className}`}>
        <div className="flex flex-col gap-2 rounded-xl border border-dashed border-border/40 bg-surface/40 p-6 text-center">
          <p className="text-sm font-semibold text-main">No live/OOS performance yet</p>
          <p className="text-xs text-muted">
            Analytics will appear after the bot has enough historical and live/dry run runtime data.
          </p>
        </div>
      </Card>
    );
  }

  const warning = analytics.metricBlocks.find((block) => block.warning)?.warning ?? null;

  return (
    <section className={`space-y-5 ${className}`}>
      <div className="overflow-hidden rounded-2xl border border-border/40 bg-surface/30 shadow-[var(--shadow-soft)]">
        <div className="grid grid-cols-[minmax(170px,1.05fr)_repeat(3,minmax(0,1fr))] border-b border-border/40 bg-surface/40">
          <div className="px-4 py-3 text-[10px] uppercase tracking-[0.16em] text-muted">Metric</div>
          {analytics.metricBlocks.map((block) => (
            <div key={block.title} className="border-l border-border/40 px-4 py-3">
              <p className="text-sm font-semibold text-main">{formatBlockTitle(block.title)}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted">
                {block.sampleSizeDays} days | {block.sampleSizeTrades} trades
              </p>
              {block.warning ? (
                <div className="mt-2 inline-flex rounded-full border border-warning/20 bg-warning/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-warning">
                  {block.warning}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {metricRows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[minmax(170px,1.05fr)_repeat(3,minmax(0,1fr))] border-b border-border/40 last:border-b-0"
          >
            <div className="px-4 py-3 text-sm text-main">{row.label}</div>
            {analytics.metricBlocks.map((block) => {
              const value = formatMetricValue(block[row.key]);
              return (
                <div
                  key={`${block.title}-${row.label}`}
                  className={`border-l border-border/40 px-4 py-3 text-right font-mono text-sm ${getValueTone(row.tone, value)}`}
                >
                  {value}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {warning ? (
        <div className="rounded-xl border border-warning/20 bg-warning/5 px-4 py-3 text-sm text-warning">
          {warning}
        </div>
      ) : null}

      <SplitPerformanceChart data={analytics.performanceSeries} splitTimestamp={analytics.splitTimestamp} />
    </section>
  );
}
