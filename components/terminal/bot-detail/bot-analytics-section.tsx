'use client';

import { useTranslations } from 'next-intl';
import { SplitPerformanceChart } from '@/components/shared/split-performance-chart';
import { Card } from '@/components/ui/card';
import { BotAnalyticsData, BotMetricBlock } from '@/lib/contracts/types';

interface BotAnalyticsSectionProps {
  analytics?: BotAnalyticsData | null;
  className?: string;
  summarySourceLabel?: string | null;
}

const metricRows = [
  { labelKey: 'annualReturn', key: 'annualReturn', tone: 'return' },
  { labelKey: 'maxDrawdown', key: 'maxDrawdown', tone: 'negative' },
  { labelKey: 'sharpeRatio', key: 'sharpe', tone: 'neutral' },
  { labelKey: 'sortinoRatio', key: 'sortino', tone: 'neutral' },
  { labelKey: 'calmarRatio', key: 'calmar', tone: 'neutral' },
  { labelKey: 'profitFactor', key: 'profitFactor', tone: 'neutral' },
  { labelKey: 'winRate', key: 'winRate', tone: 'neutral' },
  { labelKey: 'sampleDays', key: 'sampleSizeDays', tone: 'muted' },
  { labelKey: 'closedTrades', key: 'sampleSizeTrades', tone: 'muted' },
] as const;

type MetricTone = (typeof metricRows)[number]['tone'];

function formatBlockTitle(title: BotMetricBlock['title'], t: ReturnType<typeof useTranslations>) {
  if (title === 'Total Data') return t('blockTitles.totalData');
  if (title === 'Historical') return t('blockTitles.historical');
  if (title === 'Out-of-sample') return t('blockTitles.outOfSample');
  return title;
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

export function BotAnalyticsSection({ analytics, className = '', summarySourceLabel = null }: BotAnalyticsSectionProps) {
  const t = useTranslations('BotAnalytics');
  const hasChartData = (analytics?.performanceSeries.length ?? 0) >= 2;

  if (!analytics || !hasChartData) {
      return (
      <Card className={`p-5 ${className}`}>
        <div className="flex flex-col gap-2 rounded-xl border border-dashed border-border/40 bg-surface/40 p-6 text-center">
          <p className="text-sm font-semibold text-main">{t('empty.title')}</p>
          <p className="text-xs text-muted">{t('empty.message')}</p>
        </div>
      </Card>
    );
  }

  const warning = analytics.metricBlocks.find((block) => block.warning)?.warning ?? null;

  return (
    <section className={`space-y-5 ${className}`}>
      {summarySourceLabel ? (
        <div className="rounded-xl border border-primary/15 bg-primary-soft/40 px-4 py-3 text-sm text-muted">
          {t('summarySource', { source: summarySourceLabel })}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-border/40 bg-surface/30 shadow-[var(--shadow-soft)]">
        <div className="grid grid-cols-[minmax(170px,1.05fr)_repeat(3,minmax(0,1fr))] border-b border-border/40 bg-surface/40">
          <div className="px-4 py-3 text-[10px] uppercase tracking-[0.16em] text-muted">{t('metric')}</div>
          {analytics.metricBlocks.map((block) => (
            <div key={block.title} className="border-l border-border/40 px-4 py-3">
              <p className="text-sm font-semibold text-main">{formatBlockTitle(block.title, t)}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted">
                {t('sample', { days: block.sampleSizeDays, trades: block.sampleSizeTrades })}
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
            key={row.key}
            className="grid grid-cols-[minmax(170px,1.05fr)_repeat(3,minmax(0,1fr))] border-b border-border/40 last:border-b-0"
          >
            <div className="px-4 py-3 text-sm text-main">{t(`metrics.${row.labelKey}`)}</div>
            {analytics.metricBlocks.map((block) => {
              const value = formatMetricValue(block[row.key]);
              return (
                <div
                  key={`${block.title}-${row.key}`}
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
