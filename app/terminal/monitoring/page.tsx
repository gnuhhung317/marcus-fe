'use client';

import { useEffect, useMemo, useState } from 'react';
import { ErrorStateCard, LoadingStateCard } from '@/components/shared/api-state';
import { KpiCard } from '@/components/shared/kpi-card';
import { PerformanceChart } from '@/components/shared/performance-chart';
import { getDashboardPageData, getDeveloperConsolePageData } from '@/lib/contracts/client';
import type { DashboardPageData, DeveloperConsolePageData } from '@/lib/contracts/types';

type MonitoringSnapshot = {
  dashboard: DashboardPageData & { performanceSeries: { timestamp: string; value: number }[] };
  ops: DeveloperConsolePageData;
};

const PAGE_TITLE = 'Monitoring Dashboard';

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

function formatDateTime(value: string) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

function useMonitoringData() {
  const [data, setData] = useState<MonitoringSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (refresh = false) => {
    refresh ? setIsRefreshing(true) : setIsLoading(true);
    setError(null);

    try {
      const [dashboard, ops] = await Promise.all([getDashboardPageData(), getDeveloperConsolePageData()]);
      setData({ dashboard, ops });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load monitoring data.');
    } finally {
      refresh ? setIsRefreshing(false) : setIsLoading(false);
    }
  };

  useEffect(() => {
    void load(false);
  }, []);

  return { data, isLoading, isRefreshing, error, refresh: () => void load(true) };
}

export default function MonitoringDashboardPage() {
  const { data, isLoading, isRefreshing, error, refresh } = useMonitoringData();

  const sparklineSeed = useMemo(() => {
    return data?.dashboard.performanceSeries.map((point) => point.value) ?? [];
  }, [data]);

  if (isLoading && !data) {
    return (
      <div className="space-y-6">
        <LoadingStateCard title="Loading monitoring view" message="Syncing portfolio telemetry, execution logs, and exchange allocation." />
        <div className="grid gap-4 lg:grid-cols-2">
          <LoadingStateCard title="Equity curve" message="Preparing historical series." />
          <LoadingStateCard title="Execution feed" message="Fetching the latest runtime events." />
        </div>
      </div>
    );
  }

  if (error && !data) {
    return <ErrorStateCard title="Monitoring unavailable" message={error} onAction={refresh} actionLabel="Retry" />;
  }

  if (!data) {
    return <LoadingStateCard title="Monitoring view" message="Preparing dashboard state." />;
  }

  const { dashboard, ops } = data;
  const lastUpdated = dashboard.performanceSeries.at(-1)?.timestamp ?? dashboard.terminalKpis[0]?.context ?? new Date().toISOString();
  const primarySignals = ops.signalStream.slice(0, 5);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-5 border-b border-[rgba(148,163,184,0.12)] pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted">
            <span className="rounded-full border border-[rgba(0,190,115,0.25)] bg-[rgba(0,190,115,0.08)] px-2.5 py-1 text-[var(--positive)]">
              Phase 2
            </span>
            <span>Monitoring</span>
            <span>Portfolio telemetry + execution observability</span>
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white lg:text-4xl">{PAGE_TITLE}</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Equity performance, exchange allocation, execution logs, and signal flow in a single operator-friendly view.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className={`rounded-xl border px-3 py-2 text-sm font-semibold ${ops.connectivity.overallStatus === 'UP' ? 'border-positive/20 bg-positive/10 text-positive' : 'border-amber-400/20 bg-amber-400/10 text-amber-300'}`}>
            {ops.connectivity.overallStatus}
          </div>
          <button
            type="button"
            onClick={refresh}
            disabled={isRefreshing}
            className="rounded-xl border border-[rgba(0,190,115,0.3)] bg-[rgba(0,190,115,0.08)] px-4 py-2.5 text-sm font-semibold text-[var(--positive)] transition-all hover:bg-[rgba(0,190,115,0.12)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </header>

      {error ? <ErrorStateCard title="Monitoring refresh failed" message={error} onAction={refresh} actionLabel="Try again" /> : null}

      <section className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {dashboard.terminalKpis.map((kpi, index) => (
            <KpiCard
              key={kpi.label}
              {...kpi}
              data={sparklineSeed.length ? sparklineSeed.map((value, seriesIndex) => value * (1 + index * 0.01) + seriesIndex) : undefined}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between gap-4 border-b border-[rgba(148,163,184,0.12)] pb-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Equity Curve</h2>
              <p className="mt-1 text-sm text-muted">Latest performance series from the portfolio engine.</p>
            </div>
            <div className="rounded-full border border-[rgba(0,190,115,0.18)] bg-[rgba(0,190,115,0.08)] px-3 py-1 text-xs font-semibold text-[var(--positive)]">
              {formatDateTime(lastUpdated)}
            </div>
          </div>
          <div className="mt-5">
            <PerformanceChart data={dashboard.performanceSeries} />
          </div>
        </article>

        <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
          <div className="border-b border-[rgba(148,163,184,0.12)] pb-4">
            <h2 className="text-xl font-semibold text-white">Exchange Allocation</h2>
            <p className="mt-1 text-sm text-muted">Current capital distribution across venues.</p>
          </div>
          <div className="mt-5 space-y-4">
            {dashboard.allocations.map((slice) => (
              <div key={slice.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white">{slice.name}</span>
                  <span className="font-semibold text-[var(--positive)]">{slice.value.toFixed(1)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,var(--positive),rgba(0,190,115,0.45))]"
                    style={{ width: `${Math.max(2, slice.value)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-[rgba(148,163,184,0.1)] bg-[rgba(8,13,22,0.5)] p-4 text-sm text-muted">
            Open PnL: <span className={dashboard.terminalKpis[1]?.value?.startsWith('-') ? 'text-negative font-semibold' : 'text-positive font-semibold'}>
              {formatSignedCurrency(dashboard.strategyTrades.reduce((sum, trade) => sum + trade.pnl, 0))}
            </span>
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between border-b border-[rgba(148,163,184,0.12)] pb-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Execution Logs</h2>
              <p className="mt-1 text-sm text-muted">Last runtime events from the system observability stream.</p>
            </div>
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-muted">{ops.executionLogs.length} entries</span>
          </div>
          <ul className="mt-4 space-y-2">
            {ops.executionLogs.map((log) => (
              <li key={`${log.timestamp}-${log.source}`} className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5 text-sm text-muted">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-white">[{log.level}] {log.source}</span>
                  <span className="text-[11px] uppercase tracking-[0.16em] text-muted/50">{formatDateTime(log.timestamp)}</span>
                </div>
                <p className="mt-1.5 leading-relaxed">{log.message}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between border-b border-[rgba(148,163,184,0.12)] pb-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Live Signal Stream</h2>
              <p className="mt-1 text-sm text-muted">Recent signals moving through the routing layer.</p>
            </div>
            <span className="rounded-full bg-[rgba(0,190,115,0.08)] px-3 py-1 text-xs font-semibold text-[var(--positive)]">{ops.signalStream.length} signals</span>
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-white/5">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/[0.03] text-xs uppercase tracking-[0.14em] text-muted/60">
                <tr>
                  <th className="px-3 py-2.5">Symbol</th>
                  <th className="px-3 py-2.5">Bot</th>
                  <th className="px-3 py-2.5">Action</th>
                  <th className="px-3 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {primarySignals.map((signal) => (
                  <tr key={signal.signalId} className="border-t border-white/5 text-muted">
                    <td className="px-3 py-2.5 text-white">{signal.symbol}</td>
                    <td className="px-3 py-2.5">{signal.botId}</td>
                    <td className="px-3 py-2.5 text-white">{signal.action}</td>
                    <td className="px-3 py-2.5">{signal.status}</td>
                  </tr>
                ))}
                {!primarySignals.length ? (
                  <tr>
                    <td className="px-3 py-8 text-center text-muted" colSpan={4}>
                      No recent signals available.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between border-b border-[rgba(148,163,184,0.12)] pb-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Trade Detail</h2>
            <p className="mt-1 text-sm text-muted">Recent fills and exits to support monitoring and follow-up.</p>
          </div>
          <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-muted">{dashboard.strategyTrades.length} trades</span>
        </div>
        <div className="mt-4 overflow-x-auto rounded-xl border border-white/5">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/[0.03] text-xs uppercase tracking-[0.14em] text-muted/60">
              <tr>
                <th className="px-3 py-2.5">Instrument</th>
                <th className="px-3 py-2.5">Side</th>
                <th className="px-3 py-2.5">Size</th>
                <th className="px-3 py-2.5">Entry</th>
                <th className="px-3 py-2.5">Exit</th>
                <th className="px-3 py-2.5">PnL</th>
                <th className="px-3 py-2.5">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.strategyTrades.map((trade) => (
                <tr key={`${trade.timestamp}-${trade.pair}`} className="border-t border-white/5 text-muted hover:bg-white/[0.03]">
                  <td className="px-3 py-2.5 text-white">{trade.pair}</td>
                  <td className="px-3 py-2.5">{trade.side}</td>
                  <td className="px-3 py-2.5">{trade.size?.toFixed(4) ?? '--'}</td>
                  <td className="px-3 py-2.5">{trade.entryPrice ? formatCurrency(trade.entryPrice) : '--'}</td>
                  <td className="px-3 py-2.5">{trade.exitPrice ? formatCurrency(trade.exitPrice) : '--'}</td>
                  <td className={`px-3 py-2.5 font-semibold ${trade.pnl >= 0 ? 'text-positive' : 'text-negative'}`}>
                    {trade.pnl >= 0 ? '+' : '-'}{formatCurrency(Math.abs(trade.pnl))}
                  </td>
                  <td className="px-3 py-2.5">{formatDateTime(trade.timestamp)}</td>
                </tr>
              ))}
              {!dashboard.strategyTrades.length ? (
                <tr>
                  <td className="px-3 py-8 text-center text-muted" colSpan={7}>
                    No trade data available.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
