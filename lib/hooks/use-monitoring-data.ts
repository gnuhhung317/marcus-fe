'use client';

import { useCallback, useTransition } from 'react';
import { useIsFetching, useQuery, useQueryClient } from '@tanstack/react-query';
import { getDashboardOverviewData, getDashboardPerformanceSeries, getDeveloperConsolePageData } from '@/lib/contracts/client';

export const monitoringKeys = {
  root: ['monitoring'] as const,
  overview: () => [...monitoringKeys.root, 'overview'] as const,
  dashboard: (range: string) => [...monitoringKeys.root, 'dashboard', range] as const,
  ops: () => [...monitoringKeys.root, 'ops'] as const,
};

export function useMonitoringOverviewQuery() {
  return useQuery({
    queryKey: monitoringKeys.overview(),
    queryFn: getDashboardOverviewData,
    refetchInterval: 10000,
  });
}

export function useMonitoringDashboardQuery(range: string = '7D') {
  return useQuery({
    queryKey: monitoringKeys.dashboard(range),
    queryFn: () => getDashboardPerformanceSeries(range),
    refetchInterval: 10000,
  });
}

export function useMonitoringOpsQuery() {
  return useQuery({
    queryKey: monitoringKeys.ops(),
    queryFn: getDeveloperConsolePageData,
    refetchInterval: 10000,
  });
}

export function useRefreshMonitoringData() {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const isFetching = useIsFetching({ queryKey: monitoringKeys.root }) > 0;

  const refresh = useCallback(() => {
    startTransition(() => {
      void queryClient.invalidateQueries({ queryKey: monitoringKeys.root });
    });
  }, [queryClient, startTransition]);

  return {
    refresh,
    isRefreshing: isFetching || isPending,
  };
}
