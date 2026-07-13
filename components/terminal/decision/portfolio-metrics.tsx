'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { PortfolioOverview } from '@/lib/contracts/types';
import { MetricStrip } from '@/components/shared/metric-strip';
import { StatusDot } from '@/components/shared/status-dot';
import { Badge } from '@/components/ui/badge';
import { formatRatioPercent } from '@/lib/utils';

interface PortfolioMetricsProps {
  overview: PortfolioOverview;
}

export function PortfolioMetrics({ overview }: PortfolioMetricsProps) {
  const t = useTranslations('Decision.portfolioMetrics');

  const formatNumber = (num: number, decimals = 0) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: decimals }).format(num);
  };

  const openPnLTrend: 'up' | 'down' | 'neutral' = overview.aggregateOpenPnL >= 0 ? 'up' : 'down';

  const atRiskCount = overview.atRiskSubscriptionCount;
  const atRiskTrend: 'up' | 'down' | 'neutral' = atRiskCount > 0 ? 'down' : 'up';
  const freshCount = overview.freshAccountsCount ?? 0;
  const staleCount = overview.staleAccountsCount ?? 0;
  const totalSyncAccounts = freshCount + staleCount;
  const syncCoverage = totalSyncAccounts > 0 ? freshCount / totalSyncAccounts : 0;
  const syncCoverageTrend: 'up' | 'down' | 'neutral' = totalSyncAccounts === 0 ? 'neutral' : syncCoverage >= 0.75 ? 'up' : 'down';
  const syncCoverageText = totalSyncAccounts > 0 ? formatRatioPercent(syncCoverage, 1) : t('syncCoverage.none');

  const pnlPercentStr = overview.totalEquity > 0
    ? `${(overview.aggregateOpenPnL / overview.totalEquity * 100).toFixed(2)}%`
    : '0.00%';

  const metrics = [
    {
      label: t('totalEquity.label'),
      value: `$${formatNumber(overview.totalEquity, 2)}`,
      subtext: t('totalEquity.subtext'),
    },
    {
      label: t('openPnl.label'),
      value: `${overview.aggregateOpenPnL >= 0 ? '+' : ''}$${formatNumber(overview.aggregateOpenPnL, 2)}`,
      subtext: t('openPnl.subtext'),
      trend: openPnLTrend,
      delta: pnlPercentStr,
    },
    {
      label: t('syncCoverage.label'),
      value: syncCoverageText,
      subtext: t('syncCoverage.subtext', { fresh: freshCount, total: totalSyncAccounts }),
      trend: syncCoverageTrend,
      delta: totalSyncAccounts > 0 ? `${freshCount}/${totalSyncAccounts}` : t('warn'),
    },
    {
      label: t('atRisk.label'),
      value: atRiskCount.toString(),
      subtext: atRiskCount > 0 ? t('atRisk.urgent') : t('atRisk.optimal'),
      trend: atRiskTrend,
      delta: atRiskCount > 0 ? t('alert') : t('stable'),
    },
  ];

  const freshnessState = overview.dataFreshness ?? 'STALE';
  const lastUpdatedText = useMemo(() => {
    if (!overview.lastUpdated) {
      return t('neverSynced');
    }

    const parsed = new Date(overview.lastUpdated);
    return Number.isNaN(parsed.getTime()) ? overview.lastUpdated : parsed.toISOString().slice(11, 19);
  }, [overview.lastUpdated, t]);

  const syncStatus = useMemo(() => {
    if (!overview.lastUpdated) {
      return {
        label: t('neverSynced'),
        value: 'offline' as const,
        pulse: false,
      };
    }

    if (freshnessState === 'FRESH') {
      return {
        label: t('live'),
        value: 'live' as const,
        pulse: true,
      };
    }

    if (freshnessState === 'PARTIAL') {
      return {
        label: t('warn'),
        value: 'warning' as const,
        pulse: true,
      };
    }

    return {
      label: t('offline'),
      value: 'offline' as const,
      pulse: false,
    };
  }, [freshnessState, overview.lastUpdated, t]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
          {t('title')}
        </h2>
        <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-mono">
          <StatusDot status={syncStatus.value} pulse={syncStatus.pulse} size="sm" />
          <span className="text-muted">{syncStatus.label}</span>
        </div>
      </div>

      <MetricStrip items={metrics} />

      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-muted">
          {t('activeFleet')}: <span className="font-semibold text-main">{overview.activeBotsCount}</span>
        </span>
        <span className="rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-muted">
          {t('lastSync')}: <span className="font-semibold text-main">{lastUpdatedText}</span>
        </span>
        <Badge variant={
          freshnessState === 'FRESH'
            ? 'success'
            : freshnessState === 'PARTIAL'
            ? 'warning'
            : 'error'
        }>
          {t('dataState')}: <span className="font-semibold">{freshnessState}</span>
        </Badge>
        {overview.staleAccountsCount !== undefined && overview.staleAccountsCount > 0 && (
          <span className="rounded-full border border-warning/20 bg-warning-soft px-2.5 py-1 font-mono text-warning">
            {t('staleAccounts')}: <span className="font-semibold text-main">{overview.staleAccountsCount}</span>
          </span>
        )}
      </div>
    </div>
  );
}
