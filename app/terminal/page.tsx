"use client";

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { KpiCard } from '../../components/shared/kpi-card';
import { PerformanceChart } from '../../components/shared/performance-chart';
import { ErrorStateCard, LoadingStateCard } from '../../components/shared/api-state';
import { getDashboardPageData } from '../../lib/contracts/client';
import { DashboardPageData, TimeSeriesValue } from '../../lib/contracts/types';

export default function TerminalDashboardPage() {
  const [dashboardData, setDashboardData] = useState<(DashboardPageData & { performanceSeries: TimeSeriesValue[] }) | null>(null);
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
      setErrorMessage('Failed to synchronize with Marcus Trading Terminal.');
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
  const performanceSeries = useMemo(() => dashboardData?.performanceSeries ?? [], [dashboardData]);

  const pnlKpi = useMemo(() => {
    return terminalKpis.find((kpi) => kpi.label === 'Today PnL')?.value ?? '$0.00';
  }, [terminalKpis]);

  const totalAllocation = useMemo(() => {
    return allocations.reduce((acc, item) => acc + item.value, 0);
  }, [allocations]);

  // Mock series for KPI sparklines to add visual depth
  const mockSeries = useMemo(() => [30, 40, 35, 50, 49, 60, 70, 91], []);
  const mockSeriesDown = useMemo(() => [90, 80, 85, 70, 75, 60, 50, 45], []);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const formatSafeDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };


  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-wrap items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 animate-pulse rounded-full bg-positive shadow-[0_0_8px_var(--positive)]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted/60">System Status: Live</p>
          </div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Marcus <span className="text-positive">Terminal</span>
          </h1>
          <p className="mt-3 text-sm text-muted max-w-md leading-relaxed">
            Real-time portfolio intelligence and algorithmic execution. Today&apos;s performance: <span className="font-bold text-positive">{pnlKpi}</span>.
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-xl border border-white/5">
          <button
            type="button"
            onClick={() => void loadDashboardData()}
            disabled={isRefreshing}
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-white/10 active:scale-95 disabled:opacity-50"
          >
            {isRefreshing ? 'Syncing...' : 'Sync Data'}
          </button>
          <Link href="/terminal/marketplace" className="rounded-lg bg-positive px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black shadow-[0_8px_20px_rgba(0,190,115,0.2)] transition-all hover:brightness-110 active:scale-95">
            Deployment
          </Link>
        </div>
      </header>

      {errorMessage && (
        <ErrorStateCard title="Sync Failure" message={errorMessage} onAction={() => void loadDashboardData()} />
      )}

      {/* KPI Section */}
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {isBootstrapping ? (
          Array.from({ length: 4 }).map((_, i) => (
            <LoadingStateCard key={i} title="Loading Metrics" message="Connecting to signal core..." />
          ))
        ) : terminalKpis.length ? (
          terminalKpis.map((kpi, index) => (
            <KpiCard 
              key={kpi.label} 
              {...kpi} 
              data={index % 2 === 0 ? mockSeries : mockSeriesDown} 
            />
          ))
        ) : (
          <div className="col-span-full py-12 text-center glass rounded-2xl text-muted font-medium">
            Waiting for terminal telemetry...
          </div>
        )}
      </section>

      {/* Main Performance Section */}
      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <article className="glass-strong overflow-hidden rounded-3xl p-6 shadow-2xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Portfolio Performance</h2>
              <p className="text-sm text-muted/60 font-medium">Aggregated equity curve across all active vaults.</p>
            </div>
            <div className="flex gap-2">
              {['1D', '1W', '1M', 'ALL'].map((r) => (
                <button key={r} className={`rounded-md px-3 py-1 text-[10px] font-bold tracking-tighter ${r === '1W' ? 'bg-positive text-black' : 'bg-white/5 text-muted hover:bg-white/10'}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          
          <div className="min-h-[300px]">
             {isBootstrapping ? (
               <div className="h-64 animate-pulse rounded-xl bg-white/5" />
             ) : (
               <PerformanceChart data={performanceSeries} />
             )}
          </div>
        </article>

        <article className="glass-strong flex flex-col rounded-3xl p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-white tracking-tight">Asset Allocation</h2>
          <p className="mt-1 text-sm text-muted/60 font-medium">Capital concentration by venue.</p>
          
          <div className="mt-8 flex-1 space-y-6">
            {allocations.length ? (
              allocations.map((item, index) => (
                <div key={item.name} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white/80 uppercase tracking-widest">{item.name}</span>
                    <span className="text-xs font-black text-positive">{item.value}%</span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${index === 0 ? 'bg-positive shadow-[0_0_12px_rgba(0,190,115,0.4)]' : 'bg-white/20'}`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-full items-center justify-center text-muted text-sm italic">
                No active allocations detected.
              </div>
            )}
          </div>
          
          <div className="mt-8 border-t border-white/5 pt-6 flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted uppercase tracking-tighter">Total Allocation</span>
            <span className="text-lg font-black text-white">{totalAllocation.toFixed(1)}%</span>
          </div>
        </article>
      </section>

      {/* Execution Log Section */}
      <section>
        <article className="glass-strong overflow-hidden rounded-3xl shadow-2xl">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Real-time Execution Stream</h2>
              <p className="mt-1 text-sm text-muted/60 font-medium">Live trade logs from connected algorithmic engines.</p>
            </div>
            <div className="rounded-full bg-positive/10 px-3 py-1 text-[10px] font-black text-positive uppercase">
              {strategyTrades.length} Active Events
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] font-black uppercase tracking-[0.2em] text-muted/60">
                  <th className="px-6 py-4">Instrument</th>
                  <th className="px-6 py-4 text-center">Side</th>
                  <th className="px-6 py-4 text-right">Size</th>
                  <th className="px-6 py-4 text-right">Entry</th>
                  <th className="px-6 py-4 text-right">Exit</th>
                  <th className="px-6 py-4 text-right">Net PnL</th>
                  <th className="px-6 py-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {strategyTrades.length ? (
                  strategyTrades.map((trade, i) => (
                    <tr key={`${trade.timestamp}-${trade.pair}-${i}`} className="group transition-colors hover:bg-white/[0.03]">
                      <td className="px-6 py-4">
                        <span className="font-bold text-white tracking-tight">{trade.pair}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${trade.side === 'LONG' ? 'bg-positive/10 text-positive' : 'bg-negative/10 text-negative'}`}>
                          {trade.side}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-xs text-white/70">
                        {trade.size ? trade.size.toFixed(4) : '--'}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-xs text-white/70">
                        {trade.entryPrice ? `$${trade.entryPrice.toLocaleString()}` : '--'}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-xs text-white/70">
                        {trade.exitPrice ? `$${trade.exitPrice.toLocaleString()}` : '--'}
                      </td>
                      <td className={`px-6 py-4 text-right font-mono text-xs font-bold ${trade.pnl >= 0 ? 'text-positive' : 'text-negative'}`}>
                        {trade.pnl >= 0 ? '+' : ''}${Math.abs(trade.pnl).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right text-[11px] font-medium text-muted/40 uppercase">
                        {isMounted ? formatSafeDate(trade.timestamp) : '...'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-12 text-center text-muted font-medium italic" colSpan={7}>
                      Awaiting market signals...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      {/* Manual Sync Footer */}
      <footer className="flex items-center justify-between px-2 text-[10px] font-bold uppercase tracking-widest text-muted/30">
        <span>Marcus v0.1.0-alpha</span>
        <span>Last Synced: {isMounted && lastSyncedAt ? lastSyncedAt.toLocaleTimeString() : '...'}</span>
      </footer>
    </div>
  );
}
