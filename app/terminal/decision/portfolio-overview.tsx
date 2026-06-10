'use client';

import { useEffect, useState } from 'react';
import { PortfolioOverview } from '@/lib/contracts/types';

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

  let statusLabel = 'Offline';
  let statusColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  let pulseColor = 'bg-rose-500';
  let lastUpdatedText = 'Never synced';

  if (mounted && overview.lastUpdated) {
    const lastUpdatedDate = new Date(overview.lastUpdated);
    const diffMs = Date.now() - lastUpdatedDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    lastUpdatedText = lastUpdatedDate.toLocaleTimeString();

    if (diffMins < 5) {
      statusLabel = 'Live';
      statusColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      pulseColor = 'bg-emerald-500';
    } else if (diffMins < 60) {
      statusLabel = `Synced ${diffMins}m ago`;
      statusColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      pulseColor = 'bg-amber-500';
    } else {
      const hours = Math.floor(diffMins / 60);
      if (hours < 24) {
        statusLabel = `Synced ${hours}h ago`;
      } else {
        statusLabel = `Synced ${Math.floor(hours / 24)}d ago`;
      }
      statusColor = 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      pulseColor = 'bg-slate-500';
    }
  }

  const statItems = [
    {
      label: 'At-Risk Subscriptions',
      value: overview.atRiskSubscriptionCount,
      detail: overview.atRiskSubscriptionCount > 0 ? 'Needs review now' : 'No urgent alerts',
      colorClass: atRiskColor,
    },
    {
      label: 'Open PnL',
      value: formatCurrency(overview.aggregateOpenPnL),
      detail: 'Unrealized portfolio delta',
      colorClass: overview.aggregateOpenPnL >= 0 ? 'text-positive' : 'text-negative',
    },
    {
      label: 'Total Equity',
      value: `$${formatNumber(overview.totalEquity, 2)}`,
      detail: 'Base capital + floating profit',
      colorClass: 'text-white',
    },
    {
      label: 'Win Rate (24h)',
      value: `${winRatePercent}%`,
      detail: overview.aggregateWinRate24h >= 0.6 ? 'Healthy signal quality' : 'Needs monitoring',
      colorClass: winRateColor,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Portfolio Overview</h2>
          <p className="mt-1 text-sm text-muted">Triage risk first, then scan capital and quality signals.</p>
        </div>
        {mounted && (
          <div className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-mono ${statusColor}`}>
            <span className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${pulseColor}`}></span>
              <span className={`relative inline-flex h-2 w-2 rounded-full ${pulseColor}`}></span>
            </span>
            <span>{statusLabel}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="glass flex min-h-[118px] flex-col justify-between rounded-xl p-4 shadow-[var(--shadow-soft)] transition-colors duration-200 hover:border-[rgba(255,255,255,0.14)]"
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{item.label}</p>
              <p className={`mt-2 font-mono text-2xl font-semibold tracking-tight ${item.colorClass || 'text-white'}`}>{item.value}</p>
            </div>
            <p className="mt-2 text-xs text-muted">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-muted">
        <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">
          Active bots: <span className="font-semibold text-white">{overview.activeBotsCount}</span>
        </span>
        <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">
          Synced at: <span className="font-semibold text-white">{lastUpdatedText}</span>
        </span>
      </div>
    </div>
  );
}
