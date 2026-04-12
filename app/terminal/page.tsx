"use client";

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { KpiCard } from '../../components/shared/kpi-card';
import { ErrorStateCard, LoadingStateCard } from '../../components/shared/api-state';
import { getDashboardPageData } from '../../lib/contracts/client';
import { DashboardPageData } from '../../lib/contracts/types';

export default function TerminalDashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardPageData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const loadDashboardData = useCallback(async () => {
    setIsRefreshing(true);
    setErrorMessage(null);

    try {
      const response = await getDashboardPageData();
      setDashboardData(response);
      setLastSyncedAt(new Date());
    } catch {
      setErrorMessage('Failed to fetch dashboard overview.');
    } finally {
      setIsBootstrapping(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboardData();
  }, [loadDashboardData]);

  const terminalKpis = useMemo(() => dashboardData?.terminalKpis ?? [], [dashboardData]);
  const strategyTrades = useMemo(() => dashboardData?.strategyTrades ?? [], [dashboardData]);
  const allocations = useMemo(() => dashboardData?.allocations ?? [], [dashboardData]);

  const pnlKpi = useMemo(() => {
    return terminalKpis.find((kpi) => kpi.label === 'Today PnL')?.value ?? '$0.00';
  }, [terminalKpis]);

  const attentionCount = useMemo(() => {
    return strategyTrades.filter((trade) => trade.pnl < 0).length;
  }, [strategyTrades]);

  const totalAllocation = useMemo(() => {
    return allocations.reduce((acc, item) => acc + item.value, 0);
  }, [allocations]);

  const handleManualRefresh = async () => {
    await loadDashboardData();
  };

  return (
    <div className="space-y-7">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Terminal Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">Portfolio Control Center</h1>
          <p className="mt-2 text-sm text-muted">
            Today PnL <span className="font-semibold text-positive">{pnlKpi}</span>
            {attentionCount > 0 ? ` · ${attentionCount} strategy needs attention` : ' · No critical risk alerts'}
          </p>
          <p className="mt-1 text-xs text-muted">
            Last sync: {lastSyncedAt ? lastSyncedAt.toLocaleTimeString() : 'Not synced'} · Manual refresh mode
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="rounded-lg border border-[rgba(148,163,184,0.32)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[rgba(148,163,184,0.12)]"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
          <Link href="/terminal/marketplace" className="rounded-lg cta-primary px-4 py-2 text-sm font-semibold">
            Open Marketplace
          </Link>
        </div>
      </header>

      {errorMessage ? (
        <ErrorStateCard title="Dashboard sync error" message={errorMessage} onAction={() => void loadDashboardData()} />
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {isBootstrapping ? (
          <>
            <LoadingStateCard title="Loading KPI cards" message="Preparing current equity and performance deltas." />
            <LoadingStateCard title="Loading KPI cards" message="Preparing current equity and performance deltas." />
            <LoadingStateCard title="Loading KPI cards" message="Preparing current equity and performance deltas." />
            <LoadingStateCard title="Loading KPI cards" message="Preparing current equity and performance deltas." />
          </>
        ) : terminalKpis.length ? (
          terminalKpis.map((kpi) => (
            <KpiCard key={kpi.label} label={kpi.label} value={kpi.value} delta={kpi.delta} context={kpi.context} trend={kpi.trend} />
          ))
        ) : (
          <article className="glass-strong rounded-2xl p-5 text-sm text-muted">No KPI snapshot available for this account yet.</article>
        )}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.8fr_1fr]">
        <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-white">Active Bot Performance</h2>
              <p className="mt-1 text-sm text-muted">Manual refresh stream · showing latest execution snapshot.</p>
            </div>
            <span className="rounded-md bg-[rgba(148,163,184,0.12)] px-2 py-1 text-xs text-muted">{strategyTrades.length} trades</span>
          </div>

          <div className="mt-4 overflow-x-auto rounded-xl border border-[rgba(148,163,184,0.22)]">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-[rgba(148,163,184,0.08)] text-xs uppercase tracking-[0.12em] text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Asset Pair</th>
                  <th className="px-4 py-3 font-medium">Side</th>
                  <th className="px-4 py-3 font-medium">PnL</th>
                  <th className="px-4 py-3 font-medium">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {strategyTrades.length ? (
                  strategyTrades.map((trade) => (
                    <tr key={`${trade.timestamp}-${trade.pair}`} className="border-t border-[rgba(148,163,184,0.18)] transition-colors hover:bg-[rgba(148,163,184,0.08)]">
                      <td className="px-4 py-3.5 font-medium text-white">{trade.pair}</td>
                      <td className="px-4 py-3.5">
                        <span className={`rounded-full px-2 py-1 text-xs ${trade.side === 'LONG' ? 'bg-[rgba(34,197,94,0.15)] text-positive' : 'bg-[rgba(244,63,94,0.14)] text-negative'}`}>
                          {trade.side}
                        </span>
                      </td>
                      <td className={`px-4 py-3.5 font-semibold ${trade.pnl >= 0 ? 'text-positive' : 'text-negative'}`}>
                        {trade.pnl >= 0 ? '+' : ''}
                        ${trade.pnl.toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5 text-muted">
                        {Number.isNaN(Date.parse(trade.timestamp))
                          ? trade.timestamp
                          : new Date(trade.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-t border-[rgba(148,163,184,0.18)]">
                    <td className="px-4 py-4 text-sm text-muted" colSpan={4}>
                      No execution data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
          <h2 className="text-xl font-semibold text-white">Exchange Allocation</h2>
          <p className="mt-1 text-sm text-muted">Capital distribution by venue · Total {totalAllocation.toFixed(1)}%</p>
          <div className="mt-5 space-y-4">
            {allocations.length ? (
              allocations.map((item, index) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white">{item.name}</span>
                    <span className="font-medium text-muted">{item.value}%</span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[rgba(148,163,184,0.22)]">
                    <div
                      className={index === 0 ? 'h-full rounded-full bg-[var(--primary)]' : 'h-full rounded-full bg-[rgba(148,163,184,0.85)]'}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">No allocation slices available.</p>
            )}
          </div>
          <div className="mt-5 flex items-center justify-between text-xs text-muted">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </article>
      </section>
    </div>
  );
}
