import { useQuery } from '@tanstack/react-query';
import { getDashboardPageData, getDeveloperConsolePageData } from '@/lib/contracts/client';
import type { DashboardPageData, DeveloperConsolePageData } from '@/lib/contracts/types';

export const monitoringKeys = {
  all: (range: string) => ['monitoring', range] as const,
};

export type MonitoringSnapshot = {
  dashboard: DashboardPageData & { performanceSeries: { timestamp: string; value: number }[] };
  ops: DeveloperConsolePageData;
};

export function useMonitoringData(range: string = '7D') {
  const query = useQuery<MonitoringSnapshot>({
    queryKey: monitoringKeys.all(range),
    queryFn: async () => {
      const [dashboard, ops] = await Promise.all([
        getDashboardPageData(range),
        getDeveloperConsolePageData(),
      ]);
      return { dashboard, ops };
    },
    refetchInterval: 10000, // Refresh every 10s
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isRefreshing: query.isFetching && !query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    refresh: () => query.refetch(),
  };
}
