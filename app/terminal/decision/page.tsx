'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PortfolioMetrics } from '@/components/terminal/decision/portfolio-metrics';
import { EquityOverview } from '@/components/terminal/decision/equity-overview';
import { SubscriptionList } from '@/components/terminal/decision/subscription-list';
import { ErrorStateCard } from '@/components/shared/api-state';
import { usePortfolioDecisions } from '@/lib/hooks/use-portfolio-decisions';

function DecisionDashboardContent() {
  const router = useRouter();
  const [accessState, setAccessState] = useState<'checking' | 'authorized' | 'redirecting'>('checking');
  const {
    overview,
    summary,
    decisions,
    performanceSeries,
    allocations,
    isLoading,
    isRefreshing,
    error,
    statusFilter,
    setStatusFilter,
    refresh,
  } = usePortfolioDecisions({ enabled: accessState === 'authorized' });

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )marcus_role=([^;]*)/);
    const role = match ? decodeURIComponent(match[1]) : null;

    if (role === 'DEVELOPER') {
      setAccessState('redirecting');
      router.replace('/terminal/developer-dashboard');
      return;
    }

    if (!role || (role !== 'TRADER' && role !== 'OPERATOR' && role !== 'ADMIN')) {
      setAccessState('redirecting');
      router.replace('/login');
      return;
    }

    setAccessState('authorized');
  }, [router]);

  if (accessState !== 'authorized') {
    return <DecisionDashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="p-8">
        <ErrorStateCard
          title="Dashboard Error"
          message={error}
          onAction={() => void refresh()}
          actionLabel="Retry"
        />
      </div>
    );
  }

  if (isLoading || !overview || !summary) {
    return <DecisionDashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold tracking-tight text-main uppercase">Decision Dashboard</h1>
        </div>

        <Button variant="outline" size="sm" onClick={() => void refresh()} isLoading={isRefreshing} className="min-w-32">
          Sync Telemetry
        </Button>
      </div>

      <PortfolioMetrics overview={overview} />

      <EquityOverview performanceSeries={performanceSeries} allocations={allocations} />

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-main">Subscription Triage</h3>
        </div>

        <SubscriptionList
          cards={decisions}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onRefreshRequested={refresh}
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
      <div className="flex justify-between border-b border-border pb-5">
        <div className="space-y-2 animate-pulse">
          <div className="h-6 w-40 rounded bg-surface-strong" />
          <div className="h-3 w-64 rounded bg-surface-strong/70" />
        </div>
        <div className="h-9 w-28 animate-pulse rounded-xl bg-surface-strong" />
      </div>

      <div className="space-y-4 animate-pulse">
        <div className="h-4 w-32 rounded bg-surface-strong" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl border border-border bg-surface p-3" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-10 animate-pulse">
        <div className="h-64 rounded-xl border border-border bg-surface lg:col-span-6" />
        <div className="h-64 rounded-xl border border-border bg-surface lg:col-span-4" />
      </div>
    </div>
  );
}
