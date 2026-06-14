'use client';

import { useEffect, useState } from 'react';
import { PortfolioOverview } from '@/lib/contracts/types';
import { MetricStrip } from '@/components/shared/metric-strip';
import { StatusDot } from '@/components/shared/status-dot';

interface PortfolioMetricsProps {
  overview: PortfolioOverview;
}

export function PortfolioMetrics({ overview }: PortfolioMetricsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  let statusLabel = 'Offline';
  let statusValue: 'live' | 'active' | 'warning' | 'critical' | 'danger' | 'offline' | 'inactive' = 'offline';
  let shouldPulse = false;
  let lastUpdatedText = 'Never synced';

  if (mounted && overview.lastUpdated) {
    const lastUpdatedDate = new Date(overview.lastUpdated);
    const diffMs = Date.now() - lastUpdatedDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    lastUpdatedText = lastUpdatedDate.toLocaleTimeString();

    if (diffMins < 5) {
      statusLabel = 'Live';
      statusValue = 'live';
      shouldPulse = true;
    } else if (diffMins < 60) {
      statusLabel = `Synced ${diffMins}m ago`;
      statusValue = 'warning';
      shouldPulse = true;
    } else {
      const hours = Math.floor(diffMins / 60);
      statusLabel = hours < 24 ? `Synced ${hours}h ago` : `Synced ${Math.floor(hours / 24)}d ago`;
      statusValue = 'offline';
      shouldPulse = false;
    }
  }

  const pnlPercentStr = overview.totalEquity > 0
    ? `${(overview.aggregateOpenPnL / overview.totalEquity * 100).toFixed(2)}%`
    : '0.00%';

  const metrics = [
    {
      label: 'Total equity',
      value: `$${formatNumber(overview.totalEquity, 2)}`,
      subtext: 'Base capital + float PnL',
    },
    {
      label: 'Open PnL',
      value: `${overview.aggregateOpenPnL >= 0 ? '+' : ''}$${formatNumber(overview.aggregateOpenPnL, 2)}`,
      subtext: 'Portfolio unrealized delta',
      trend: openPnLTrend,
      delta: pnlPercentStr,
    },
    {
      label: 'Win rate (24h)',
      value: winRatePercent,
      subtext: overview.aggregateWinRate24h >= 0.6 ? 'Healthy signal quality' : 'Below target',
      trend: winRateTrend,
      delta: overview.aggregateWinRate24h >= 0.6 ? 'OK' : 'WARN',
    },
    {
      label: 'At-risk subscriptions',
      value: atRiskCount.toString(),
      subtext: atRiskCount > 0 ? 'Urgent attention required' : 'Optimal risk levels',
      trend: atRiskTrend,
      delta: atRiskCount > 0 ? 'ALERT' : 'STABLE',
    },
  ];

  const freshnessState = overview.dataFreshness ?? 'STALE';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
          Portfolio Telemetry
        </h2>
        {mounted && (
          <div className="flex items-center gap-2 rounded border border-white/5 bg-white/[0.02] px-2.5 py-1 text-xs font-mono">
            <StatusDot status={statusValue} pulse={shouldPulse} size="sm" />
            <span className="text-muted">{statusLabel}</span>
          </div>
        )}
      </div>

      <MetricStrip items={metrics} />

      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded border border-white/5 bg-white/[0.02] px-2.5 py-1 font-mono text-muted">
          Active fleet: <span className="font-semibold text-white">{overview.activeBotsCount}</span>
        </span>
        <span className="rounded border border-white/5 bg-white/[0.02] px-2.5 py-1 font-mono text-muted">
          Last sync: <span className="font-semibold text-white">{lastUpdatedText}</span>
        </span>
        <span className={`rounded border px-2.5 py-1 font-mono ${
          freshnessState === 'FRESH'
            ? 'border-positive/20 bg-positive/5 text-positive'
            : freshnessState === 'PARTIAL'
            ? 'border-warning/20 bg-warning/5 text-warning'
            : 'border-negative/20 bg-negative/5 text-negative'
        }`}>
          Data state: <span className="font-semibold">{freshnessState}</span>
        </span>
        {overview.staleAccountsCount !== undefined && overview.staleAccountsCount > 0 && (
          <span className="rounded border border-warning/20 bg-warning/5 px-2.5 py-1 font-mono text-warning">
            Stale accounts: <span className="font-semibold text-white">{overview.staleAccountsCount}</span>
          </span>
        )}
      </div>
    </div>
  );
}
