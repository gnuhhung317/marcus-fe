'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorStateCard, LoadingStateCard } from '@/components/shared/api-state';
import { useMonitoringData } from '@/lib/hooks/use-monitoring-data';

// Sub-components
import { MonitoringHeader } from '@/components/terminal/monitoring/monitoring-header';
import { MonitoringKpis } from '@/components/terminal/monitoring/monitoring-kpis';
import { MonitoringPerformance } from '@/components/terminal/monitoring/monitoring-performance';
import { MonitoringLogs } from '@/components/terminal/monitoring/monitoring-logs';
import { MonitoringTrades } from '@/components/terminal/monitoring/monitoring-trades';

const PAGE_TITLE = 'Monitoring Dashboard';

export default function MonitoringDashboardPage() {
  const router = useRouter();
  const { data, isLoading, isRefreshing, error, refresh } = useMonitoringData();

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )marcus_role=([^;]*)/);
    const role = match ? decodeURIComponent(match[1]) : null;
    if (role === 'DEVELOPER') {
      router.replace('/terminal/developer-dashboard');
    } else if (!role || (role !== 'TRADER' && role !== 'OPERATOR' && role !== 'ADMIN')) {
      router.replace('/login');
    }
  }, [router]);

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

  return (
    <div className="space-y-8">
      <MonitoringHeader 
        title={PAGE_TITLE}
        connectivityStatus={ops.connectivity.overallStatus}
        isRefreshing={isRefreshing}
        onRefresh={refresh}
      />

      {error && (
        <ErrorStateCard 
          title="Monitoring refresh failed" 
          message={error} 
          onAction={refresh} 
          actionLabel="Try again" 
        />
      )}

      <MonitoringKpis 
        dashboard={dashboard} 
        ops={ops} 
        sparklineSeed={sparklineSeed} 
      />

      <MonitoringPerformance 
        dashboard={dashboard} 
        lastUpdated={lastUpdated} 
      />

      <MonitoringLogs 
        ops={ops} 
      />

      <MonitoringTrades 
        dashboard={dashboard} 
      />
    </div>
  );
}
