'use client';

import { useEffect, useState } from 'react';
import { PortfolioOverview } from '@/lib/contracts/types';

function statusClasses(status: 'offline' | 'live' | 'stale' | 'aging') {
  if (status === 'live') return 'bg-positive-soft text-positive';
  if (status === 'stale') return 'bg-warning-soft text-warning';
  if (status === 'aging') return 'bg-surface text-fg-muted';
  return 'bg-negative-soft text-negative';
}

export function PortfolioOverviewStats({ overview }: { overview: PortfolioOverview }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatNumber = (num: number, decimals = 0) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: decimals }).format(num);
  };

  const formatCurrency = (num: number) => {
    const sign = num >= 0 ? '+' : '-';
    return `${sign}$${formatNumber(Math.abs(num), 2)}`;
  };

  const winRatePercent = (overview.aggregateWinRate24h * 100).toFixed(1);
  const winRateColor = overview.aggregateWinRate24h >= 0.6 ? 'text-positive' : 'text-warning';
  const atRiskColor = overview.atRiskSubscriptionCount > 0 ? 'text-negative' : 'text-positive';
  const hasStaleAccounts = (overview.staleAccountsCount ?? 0) > 0;
  const freshnessState = overview.dataFreshness ?? (hasStaleAccounts ? 'PARTIAL' : 'FRESH');

  let statusLabel = 'Offline';
  let statusState: 'offline' | 'live' | 'stale' | 'aging' = 'offline';
  let pulseColor = 'bg-negative';
  let lastUpdatedText = 'Never synced';

  if (mounted && overview.lastUpdated) {
    const lastUpdatedDate = new Date(overview.lastUpdated);
    const diffMs = Date.now() - lastUpdatedDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    lastUpdatedText = lastUpdatedDate.toLocaleTimeString();

    if (diffMins < 5) {
      statusLabel = 'Live';
      statusState = 'live';
      pulseColor = 'bg-positive';
    } else if (diffMins < 60) {
      statusLabel = `Synced ${diffMins}m ago`;
      statusState = 'stale';
      pulseColor = 'bg-warning';
    } else {
      const hours = Math.floor(diffMins / 60);
      statusLabel = hours < 24 ? `Synced ${hours}h ago` : `Synced ${Math.floor(hours / 24)}d ago`;
      statusState = 'aging';
      pulseColor = 'bg-muted';
    }
  }

  const statItems = [
    {
      label: 'Total equity',
      value: `$${formatNumber(overview.totalEquity, 2)}`,
      detail: 'Base capital + floating profit',
      colorClass: 'text-white',
    },
    {
      label: 'Open PnL',
      value: formatCurrency(overview.aggregateOpenPnL),
      detail: 'Unrealized portfolio delta',
      colorClass: overview.aggregateOpenPnL >= 0 ? 'text-positive' : 'text-negative',
    },
    {
      label: 'Win rate (24h)',
      value: `${winRatePercent}%`,
      detail: overview.aggregateWinRate24h >= 0.6 ? 'Healthy signal quality' : 'Needs monitoring',
      colorClass: winRateColor,
    },
    {
      label: 'At-risk subscriptions',
      value: overview.atRiskSubscriptionCount,
      detail: overview.atRiskSubscriptionCount > 0 ? 'Needs review now' : 'No urgent alerts',
      colorClass: atRiskColor,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Portfolio overview</h2>
          <p className="mt-1 text-sm text-muted">Triage risk first, then scan capital and quality signals.</p>
        </div>
        {mounted && (
          <div className={`flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-mono ${statusClasses(statusState)}`}>
            <span className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${pulseColor}`}></span>
              <span className={`relative inline-flex h-2 w-2 rounded-full ${pulseColor}`}></span>
            </span>
            <span>{statusLabel}</span>
          </div>
        )}
      </div>

      <div className="grid items-stretch grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="panel h-full min-h-[118px] p-4"
          >
            <div className="flex h-full flex-col">
              <div className="flex-1 space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{item.label}</p>
                <p className={`font-mono text-2xl font-semibold tracking-tight ${item.colorClass || 'text-white'}`}>{item.value}</p>
              </div>
              <p className="text-xs text-muted">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-muted">
        <span className="rounded-full border border-border bg-surface px-3 py-1">
          Active bots: <span className="font-semibold text-white">{overview.activeBotsCount}</span>
        </span>
        <span className="rounded-full border border-border bg-surface px-3 py-1">
          Synced at: <span className="font-semibold text-white">{lastUpdatedText}</span>
        </span>
        <span className={`rounded-full border px-3 py-1 ${freshnessState === 'FRESH' ? 'border-positive/20 bg-positive/8 text-positive' : freshnessState === 'PARTIAL' ? 'border-warning/20 bg-warning/8 text-warning' : 'border-negative/20 bg-negative/8 text-negative'}`}>
          Data: <span className="font-semibold text-white">{freshnessState}</span>
        </span>
        {hasStaleAccounts && (
          <span className="rounded-full border border-warning/20 bg-warning/8 px-3 py-1 text-warning">
            {overview.staleAccountsCount} stale account{overview.staleAccountsCount === 1 ? '' : 's'}
          </span>
        )}
      </div>
    </div>
  );
}
