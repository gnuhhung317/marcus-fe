'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { PortfolioOverview } from '@/lib/contracts/types';
import { MetricStrip } from '@/components/shared/metric-strip';
import { StatusDot } from '@/components/shared/status-dot';
import { Badge } from '@/components/ui/badge';

interface PortfolioMetricsProps {
  overview: PortfolioOverview;
}

export function PortfolioMetrics({ overview }: PortfolioMetricsProps) {
  const t = useTranslations('Decision.portfolioMetrics');

  const formatNumber = (num: number, decimals = 0) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: decimals }).format(num);
  };

  const formatPercent = (num: number) => {
    return `${(num * 100).toFixed(1)}%`;
  };

  const winRatePercent = formatPercent(overview.aggregateWinRate24h);
  const winRateTrend: 'up' | 'down' | 'neutral' = overview.aggregateWinRate24h >= 0.6 ? 'up' : 'down';
  const openPnLTrend: 'up' | 'down' | 'neutral' = overview.aggregateOpenPnL >= 0 ? 'up' : 'down';

  const atRiskCount = overview.atRiskSubscriptionCount;
  const atRiskTrend: 'up' | 'down' | 'neutral' = atRiskCount > 0 ? 'down' : 'up';

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
      label: t('winRate.label'),
      value: winRatePercent,
      subtext: overview.aggregateWinRate24h >= 0.6 ? t('winRate.healthy') : t('winRate.below'),
      trend: winRateTrend,
      delta: overview.aggregateWinRate24h >= 0.6 ? t('ok') : t('warn'),
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
