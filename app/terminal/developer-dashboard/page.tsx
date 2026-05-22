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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Auth check - using cookie parsing compatible with client-side
    const match = document.cookie.match(/(?:^|; )marcus_role=([^;]*)/);
    const role = match ? decodeURIComponent(match[1]) : null;
    
    if (!role || (role !== 'DEVELOPER' && role !== 'OPERATOR' && role !== 'ADMIN')) {
      router.replace('/terminal');
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getDeveloperDashboardPageData(activeBotId);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load developer dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [router, activeBotId]);

  if (isLoading) {
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
