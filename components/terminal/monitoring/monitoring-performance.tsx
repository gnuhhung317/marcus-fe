'use client';

import { startTransition, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ErrorStateCard, LoadingStateCard } from '@/components/shared/api-state';
import { EquityChart } from '@/components/shared/equity-chart';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useMonitoringDashboardQuery, useMonitoringOverviewQuery, useRefreshMonitoringData } from '@/lib/hooks/use-monitoring-data';
import { cn } from '@/lib/utils';
import { TrendingUp, Wallet } from 'lucide-react';
import { buildSemanticChartPalette } from '@/lib/configs/chart-theme';

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

function formatDateTime(value: string | null) {
  if (!value) {
    return '';
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

export function MonitoringPerformance() {
  const t = useTranslations('Monitoring.performance');
  const [range, setRange] = useState('7D');
  const { data: dashboard, error: dashboardError } = useMonitoringOverviewQuery();
  const { data: performanceSeries, error: performanceError } = useMonitoringDashboardQuery(range);
  const { refresh } = useRefreshMonitoringData();
  const series = useMemo(() => performanceSeries ?? [], [performanceSeries]);
  const allocationPalette = useMemo(() => buildSemanticChartPalette(), []);

  const error = dashboardError ?? performanceError;

  if (error) {
    return (
      <ErrorStateCard
        title={t('equityCurve')}
        message={error instanceof Error ? error.message : t('updated')}
        onAction={refresh}
        actionLabel="Retry"
      />
    );
  }

  if (!dashboard || !performanceSeries) {
    return <LoadingStateCard title={t('equityCurve')} message={t('updated')} />;
  }

  const hasSeries = series.length > 0;

  const currentEquity = hasSeries ? series[series.length - 1]?.value ?? 0 : 0;
  const initialEquity = hasSeries ? series[0]?.value ?? 0 : 0;
  const changeEquity = currentEquity - initialEquity;
  const changePercent = initialEquity !== 0 ? (changeEquity / initialEquity) * 100 : 0;
  const changePercentStr = `${changeEquity >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`;
  const peakEquity = hasSeries ? Math.max(...series.map((point) => point.value)) : 0;
  const drawdown = currentEquity - peakEquity;
  const updatedText = dashboard.lastUpdated ? formatDateTime(dashboard.lastUpdated) : t('neverSynced');

  return (
    <div className="flex flex-col gap-6">
      <Card variant="glass-strong" className="p-5" data-testid="monitoring-equity-card">
        <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-muted">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-main">{t('equityCurve')}</h2>
            </div>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="flex items-center rounded-lg border border-border bg-surface p-0.5">
              {(['1D', '7D', '30D', 'ALL'] as const).map((nextRange) => (
                <button
                  key={nextRange}
                  onClick={() => startTransition(() => setRange(nextRange))}
                  className={cn(
                    'rounded-md border px-2.5 py-1 text-[11px] font-medium transition-all duration-150',
                    range === nextRange
                      ? 'border-positive/20 bg-primary/10 text-positive shadow-sm'
                      : 'border-transparent text-muted hover:text-main'
                  )}
                >
                  {nextRange === '7D' ? '1W' : nextRange === '30D' ? '1M' : nextRange}
                </button>
              ))}
            </div>
            <Badge variant="outline" className="whitespace-nowrap text-[11px]">
              {t('updated')} {updatedText}
            </Badge>
          </div>
        </div>

        {hasSeries && (
          <div className="mt-4 grid grid-cols-2 divide-y divide-border/40 overflow-hidden rounded-xl border border-border/40 bg-surface/30 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
            <div className="p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted">{t('currentBalance')}</div>
              <div className="mt-1 font-mono text-base font-bold text-main">{formatCurrency(currentEquity)}</div>
            </div>

            <div className="p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted">{t('totalChange')}</div>
              <div className={cn('mt-1 font-mono text-base font-bold', changeEquity >= 0 ? 'text-positive' : 'text-negative')}>
                {formatSignedCurrency(changeEquity)}
                <span className="ml-1 text-[11px] font-normal opacity-85">({changePercentStr})</span>
              </div>
            </div>

            <div className="p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted">{t('peakBalance')}</div>
              <div className="mt-1 font-mono text-base font-bold text-main">{formatCurrency(peakEquity)}</div>
            </div>

            <div className="p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted">{t('drawdown')}</div>
              <div className={cn('mt-1 font-mono text-base font-bold', drawdown < 0 ? 'text-negative' : 'text-positive')}>
                {drawdown === 0 ? '$0.00' : formatCurrency(drawdown)}
              </div>
            </div>
          </div>
        )}

        <div className="mt-5">
          <EquityChart data={series} height={300} timeframe={range as '1D' | '7D' | '30D' | 'ALL'} />
        </div>
      </Card>

      <Card variant="glass-strong" className="p-5" data-testid="monitoring-exchange-allocation-card">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-muted">
              <Wallet className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-main">{t('exchangeAllocation')}</h2>
            </div>
          </div>
        </div>

        <div className="mt-5 grid overflow-hidden rounded-xl border border-border/40 bg-surface/30 md:grid-cols-3 md:divide-x md:divide-y-0 divide-y divide-border/40">
          {dashboard.allocations.map((slice, index) => (
            <div key={slice.name} className="space-y-2 px-3 py-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">{slice.name}</span>
                <span className="font-mono font-semibold text-main">{slice.percent.toFixed(1)}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-border/30">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${slice.percent > 0 ? Math.max(2, slice.percent) : 0}%`,
                    backgroundColor: allocationPalette[index % allocationPalette.length],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
