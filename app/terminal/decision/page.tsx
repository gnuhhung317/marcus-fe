'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDecisionDashboardData } from '@/lib/contracts/client';
import { PortfolioOverviewStats } from './portfolio-overview';
import { SubscriptionCardsContainer } from './subscription-cards';

async function DecisionDashboardContent() {
  const data = await getDecisionDashboardData('ALL');

  return <DecisionDashboardView initialData={data} />;
}

function DecisionDashboardView({ initialData }: { initialData: Awaited<ReturnType<typeof getDecisionDashboardData>> }) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'AT_RISK'>('ALL');
  const [data, setData] = useState(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )marcus_role=([^;]*)/);
    const role = match ? decodeURIComponent(match[1]) : null;
    if (role === 'DEVELOPER') {
      router.replace('/terminal/developer-dashboard');
    } else if (!role || (role !== 'TRADER' && role !== 'OPERATOR' && role !== 'ADMIN')) {
      router.replace('/login');
    }
  }, [router]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const freshData = await getDecisionDashboardData(statusFilter);
      setData(freshData);
    } catch (error) {
      console.error('Failed to refresh:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleStatusFilterChange = async (status: 'ALL' | 'ACTIVE' | 'AT_RISK') => {
    setStatusFilter(status);
    setIsRefreshing(true);
    try {
      const freshData = await getDecisionDashboardData(status);
      setData(freshData);
    } catch (error) {
      console.error('Failed to load filtered data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with refresh button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[rgba(148,163,184,0.12)] pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white font-display tracking-tight">Decision Dashboard</h1>
          <p className="text-muted text-sm mt-1.5">
            Review your active bot subscriptions and make quick decisions
          </p>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 border ${
            isRefreshing
              ? 'bg-slate-800 text-slate-500 border-slate-700/50 cursor-not-allowed'
              : 'border-[rgba(0,190,115,0.3)] bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 active:scale-95'
          }`}
        >
          {isRefreshing ? (
            <>
              <svg className="animate-spin h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24">
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

      {/* Portfolio overview stats */}
      <PortfolioOverviewStats overview={data.overview} />

      {/* Subscription cards grid */}
      <div className="space-y-5">
        <h2 className="text-xl font-bold text-white font-display tracking-tight">Your Subscriptions</h2>
        <SubscriptionCardsContainer
          cards={data.decisions.decisions}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
        />
      </div>

      {/* Last updated info */}
      <div className="pt-6 border-t border-[rgba(148,163,184,0.08)] text-xs text-slate-500 text-center font-mono">
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
      <div className="border-b border-[rgba(148,163,184,0.12)] pb-6 flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 bg-slate-800 rounded-lg w-48 animate-pulse" />
          <div className="h-4 bg-slate-800/60 rounded-lg w-72 animate-pulse" />
        </div>
        <div className="h-10 bg-slate-800 rounded-xl w-24 animate-pulse" />
      </div>
      
      <div className="space-y-4">
        <div className="h-6 bg-slate-800 rounded-lg w-36 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-800/40 border border-slate-800/80 rounded-2xl p-4 h-24 animate-pulse" />
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="h-6 bg-slate-800 rounded-lg w-40 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-slate-800/40 border border-slate-800/80 rounded-2xl p-6 h-40 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
