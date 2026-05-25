'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DashboardContent } from '@/components/terminal/developer-dashboard/dashboard-content';
import { getDeveloperDashboardPageData } from '@/lib/contracts/client';
import type { DeveloperDashboardPageData } from '@/lib/contracts/types';
import { LoadingStateCard, ErrorStateCard } from '@/components/shared/api-state';

function DeveloperDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeBotId = searchParams.get('botId') || undefined;

  const [data, setData] = useState<DeveloperDashboardPageData | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Auth check
    const match = document.cookie.match(/(?:^|; )marcus_role=([^;]*)/);
    const role = match ? decodeURIComponent(match[1]) : null;
    
    if (!role || (role !== 'DEVELOPER' && role !== 'OPERATOR' && role !== 'ADMIN')) {
      router.replace('/terminal');
      return;
    }

    // Optimistic transition to switch layout instantly
    if (data) {
      if (!activeBotId) {
        setData(prev => prev ? {
          ...prev,
          activeBot: null,
          subscriptions: [],
          integrationHealth: null,
          signals: [],
        } : null);
      } else {
        const matched = data.bots.find(b => b.botId === activeBotId);
        if (matched) {
          setData(prev => prev ? {
            ...prev,
            activeBot: {
              ...matched,
              performance: (matched as any).performance ?? null,
              createdAt: (matched as any).createdAt ?? null,
              updatedAt: (matched as any).updatedAt ?? null,
              developerId: null,
            },
            subscriptions: [],
            integrationHealth: null,
            signals: [],
          } : null);
        }
      }
    }

    let active = true;

    const loadData = async () => {
      if (!data) {
        setIsInitialLoading(true);
      } else {
        setIsSwitching(true);
      }
      setError(null);
      try {
        const result = await getDeveloperDashboardPageData(activeBotId);
        if (active) {
          setData(result);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Failed to load developer dashboard data');
        }
      } finally {
        if (active) {
          setIsInitialLoading(false);
          setIsSwitching(false);
        }
      }
    };

    loadData();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, activeBotId]);

  if (isInitialLoading) {
    return (
      <div className="p-8">
        <LoadingStateCard 
          title="Developer Dashboard" 
          message="Loading your bot fleet and active subscriptions..." 
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <ErrorStateCard 
          title="Dashboard Error" 
          message={error} 
          onAction={() => window.location.reload()}
          actionLabel="Retry"
        />
      </div>
    );
  }

  if (!data) return null;

  return (
    <DashboardContent
      bots={data.bots}
      activeBot={data.activeBot}
      subscriptions={data.subscriptions}
      integrationHealth={data.integrationHealth ?? null}
      signals={data.signals ?? []}
      isSwitching={isSwitching}
    />
  );
}

export default function DeveloperDashboardPage() {
  return (
    <Suspense fallback={<LoadingStateCard title="Developer Dashboard" message="Initializating console..." />}>
      <DeveloperDashboardContent />
    </Suspense>
  );
}
