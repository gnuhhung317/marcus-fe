'use client';

import { PortfolioOverview } from '@/lib/contracts/types';

export function PortfolioOverviewStats({ overview }: { overview: PortfolioOverview }) {
  const formatNumber = (num: number, decimals = 0) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: decimals }).format(num);
  };

  const winRatePercent = (overview.aggregateWinRate24h * 100).toFixed(1);
  const winRateColor = overview.aggregateWinRate24h > 0.6 ? 'text-emerald-400' : 'text-amber-400';

  const statItems = [
    {
      label: 'Active Bots',
      value: overview.activeBotsCount,
      detail: `${overview.activeBotsCount} bots running`,
    },
    {
      label: 'Total Equity',
      value: `$${formatNumber(overview.totalEquity, 2)}`,
      detail: `Base capital + unrealized P&L`,
    },
    {
      label: 'Win Rate (24h)',
      value: `${winRatePercent}%`,
      detail: `${overview.aggregateWinRate24h > 0.6 ? 'Excellent' : 'Monitor'} performance`,
      colorClass: winRateColor,
    },
    {
      label: 'At-Risk Subscriptions',
      value: overview.atRiskSubscriptionCount,
      detail: `${overview.atRiskSubscriptionCount} require urgent review`,
      colorClass: overview.atRiskSubscriptionCount > 0 ? 'text-rose-400 font-semibold' : 'text-emerald-400',
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-300 font-display uppercase tracking-wider">Portfolio Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="bg-white/[0.02] border border-[rgba(255,255,255,0.06)] rounded-2xl p-5 hover:bg-white/[0.04] hover:border-[rgba(255,255,255,0.12)] transition-all duration-300 shadow-sm backdrop-blur-md flex flex-col justify-between min-h-[110px]"
          >
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{item.label}</p>
              <p className={`text-2xl font-bold mt-2 font-mono tracking-tight ${item.colorClass || 'text-white'}`}>{item.value}</p>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
