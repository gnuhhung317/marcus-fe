'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDecisionDashboardData } from '@/lib/contracts/client';
import { PortfolioOverviewStats } from './portfolio-overview';
import { SubscriptionCardsContainer } from './subscription-cards';
import { ErrorStateCard } from '@/components/shared/api-state';

function DecisionDashboardContent() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'AT_RISK'>('ALL');
  const [data, setData] = useState<Awaited<ReturnType<typeof getDecisionDashboardData>> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (filter: 'ALL' | 'ACTIVE' | 'AT_RISK') => {
    try {
      const freshData = await getDecisionDashboardData(filter);
      setData(freshData);
      return freshData;
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

  const summary = data.decisions.summary;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 border-b border-[rgba(148,163,184,0.12)] pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Trader decision center</p>
          <h1 className="text-3xl font-bold tracking-tight text-white font-display">Decision Dashboard</h1>
          <p className="max-w-2xl text-sm text-muted">
            Review at-risk bots first, keep healthy subscriptions in view, and act without losing context.
          </p>
          <div className="flex flex-wrap gap-2 pt-2 text-xs">
            <span className="rounded-full border border-[rgba(244,63,94,0.18)] bg-[rgba(244,63,94,0.08)] px-3 py-1 text-negative">
              {summary.highRiskCount} high risk
            </span>
            <span className="rounded-full border border-[rgba(245,158,11,0.2)] bg-[rgba(245,158,11,0.08)] px-3 py-1 text-warning">
              {summary.reviewNeededCount} need review
            </span>
            <span className="rounded-full border border-[rgba(0,190,115,0.18)] bg-[rgba(0,190,115,0.08)] px-3 py-1 text-positive">
              {summary.activeCount} active
            </span>
          </div>
        </div>

        <button
          onClick={() => void handleRefresh()}
          disabled={isRefreshing}
          className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
            isRefreshing
              ? 'cursor-not-allowed border-[rgba(255,255,255,0.08)] bg-white/[0.03] text-muted'
              : 'border-[rgba(0,190,115,0.3)] bg-[rgba(0,190,115,0.06)] text-positive hover:bg-[rgba(0,190,115,0.1)]'
          }`}
        >
          {isRefreshing ? (
            <>
              <svg className="h-4 w-4 animate-spin text-muted" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Refreshing...</span>
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18" />
              </svg>
              <span>Refresh</span>
            </>
          )}
        </button>
      </div>

      <PortfolioOverviewStats overview={data.overview} />

      <div className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white font-display">Subscription Triage</h2>
            <p className="mt-1 text-sm text-muted">Urgent decisions first, stable bots below.</p>
          </div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">
            Total subscriptions: <span className="font-semibold text-white">{summary.totalCount}</span>
          </p>
        </div>

        <SubscriptionCardsContainer
          cards={data.decisions.decisions}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          onRefreshRequested={handleRefresh}
          summary={summary}
        />
      </div>

      <div className="border-t border-[rgba(148,163,184,0.08)] pt-6 text-center font-mono text-xs text-slate-500">
        Last updated: {new Date(data.overview.lastUpdated).toLocaleTimeString()}
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
    <div className="space-y-8">
      <div className="flex justify-between border-b border-[rgba(148,163,184,0.12)] pb-6">
        <div className="space-y-2">
          <div className="h-8 w-48 rounded-lg bg-slate-800 animate-pulse" />
          <div className="h-4 w-72 rounded-lg bg-slate-800/60 animate-pulse" />
        </div>
        <div className="h-10 w-24 rounded-xl bg-slate-800 animate-pulse" />
      </div>

      <div className="space-y-4">
        <div className="h-6 w-40 rounded-lg bg-slate-800 animate-pulse" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl border border-slate-800/80 bg-slate-800/40 p-4 animate-pulse" />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-6 w-40 rounded-lg bg-slate-800 animate-pulse" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-40 rounded-2xl border border-slate-800/80 bg-slate-800/40 p-6 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
