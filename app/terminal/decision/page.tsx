'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDecisionDashboardData, getDashboardPageData } from '@/lib/contracts/client';
import { PortfolioMetrics } from '@/components/terminal/decision/portfolio-metrics';
import { EquityOverview } from '@/components/terminal/decision/equity-overview';
import { SubscriptionList } from '@/components/terminal/decision/subscription-list';
import { ErrorStateCard } from '@/components/shared/api-state';

interface DashboardState {
  decisionData: Awaited<ReturnType<typeof getDecisionDashboardData>>;
  dashboardData: Awaited<ReturnType<typeof getDashboardPageData>>;
}

function DecisionDashboardContent() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'AT_RISK'>('ALL');
  const [data, setData] = useState<DashboardState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (filter: 'ALL' | 'ACTIVE' | 'AT_RISK') => {
    try {
      const [decisionData, dashboardData] = await Promise.all([
        getDecisionDashboardData(filter),
        getDashboardPageData(),
      ]);
      const state = { decisionData, dashboardData };
      setData(state);
      return state;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load decision dashboard data');
      return null;
    }
  };

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )marcus_role=([^;]*)/);
    const role = match ? decodeURIComponent(match[1]) : null;

    if (role === 'DEVELOPER') {
      router.replace('/terminal/developer-dashboard');
      return;
    }

    if (!role || (role !== 'TRADER' && role !== 'OPERATOR' && role !== 'ADMIN')) {
      router.replace('/login');
      return;
    }

    const loadInitialData = async () => {
      setIsLoading(true);
      setError(null);
      await loadData('ALL');
      setIsLoading(false);
    };

    void loadInitialData();
  }, [router]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setError(null);
    await loadData(statusFilter);
    setIsRefreshing(false);
  };

  const handleStatusFilterChange = async (status: 'ALL' | 'ACTIVE' | 'AT_RISK') => {
    setStatusFilter(status);
    setIsRefreshing(true);
    setError(null);
    await loadData(status);
    setIsRefreshing(false);
  };

  if (isLoading) {
    return <DecisionDashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="p-8">
        <ErrorStateCard
          title="Dashboard Error"
          message={error}
          onAction={() => void handleRefresh()}
          actionLabel="Retry"
        />
      </div>
    );
  }

  if (!data) return null;

  const { overview, decisions } = data.decisionData;
  const { summary } = decisions;
  const { performanceSeries, allocations } = data.dashboardData;

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-4 border-b border-white/5 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Trader decision center</p>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">Decision Dashboard</h1>
          <p className="max-w-2xl text-xs text-muted">
            Triage at-risk subscriptions first, analyze asset allocations, and verify performance curves.
          </p>
        </div>

        <button
          onClick={() => void handleRefresh()}
          disabled={isRefreshing}
          className={`inline-flex items-center justify-center gap-2 rounded border px-3 py-1.5 text-xs font-semibold transition-colors ${
            isRefreshing
              ? 'cursor-not-allowed border-white/5 bg-white/[0.01] text-muted'
              : 'border-positive/20 bg-positive/5 text-positive hover:bg-positive/10'
          }`}
        >
          {isRefreshing ? (
            <>
              <svg className="h-3 w-3 animate-spin text-muted" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Syncing...</span>
            </>
          ) : (
            <>
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18" />
              </svg>
              <span>Sync Telemetry</span>
            </>
          )}
        </button>
      </div>

      {/* KPI stats bar */}
      <PortfolioMetrics overview={overview} />

      {/* Performance & Capital allocation splits */}
      <EquityOverview
        performanceSeries={performanceSeries}
        allocations={allocations}
      />

      {/* Main triage table */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">Subscription Triage</h3>
          <p className="text-xs text-muted mt-1">Review live subscriptions, filter status, and process alerts.</p>
        </div>
        
        <SubscriptionList
          cards={decisions.decisions}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          onRefreshRequested={handleRefresh}
          summary={summary}
        />
      </div>
    </div>
  );
}

export default function DecisionDashboardPage() {
  return (
    <Suspense fallback={<DecisionDashboardSkeleton />}>
      <DecisionDashboardContent />
    </Suspense>
  );
}

function DecisionDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between border-b border-white/5 pb-5">
        <div className="space-y-2 animate-pulse">
          <div className="h-6 w-40 rounded bg-slate-800" />
          <div className="h-3 w-64 rounded bg-slate-800/60" />
        </div>
        <div className="h-8 w-24 rounded bg-slate-800 animate-pulse" />
      </div>

      <div className="space-y-4 animate-pulse">
        <div className="h-4 w-32 rounded bg-slate-800" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded border border-white/5 bg-slate-800/20 p-3" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-10 animate-pulse">
        <div className="h-64 rounded border border-white/5 bg-slate-800/20 lg:col-span-6" />
        <div className="h-64 rounded border border-white/5 bg-slate-800/20 lg:col-span-4" />
      </div>
    </div>
  );
}
