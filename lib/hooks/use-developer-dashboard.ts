import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getDeveloperDashboardPageData } from '@/lib/contracts/client';
import { DeveloperDashboardPageData, DeveloperBotStatus } from '@/lib/contracts/types';

export const developerDashboardKeys = {
  all: ['developerDashboard'] as const,
  fleet: () => [...developerDashboardKeys.all, 'fleet'] as const,
  detail: (botId: string) => [...developerDashboardKeys.all, botId] as const,
};

export function useDeveloperDashboard(
  botId?: string,
  initialData?: DeveloperDashboardPageData,
  options?: { enabled?: boolean }
) {
  const queryClient = useQueryClient();
  const isFleet = !botId;

  const query = useQuery<DeveloperDashboardPageData>({
    queryKey: isFleet ? developerDashboardKeys.fleet() : developerDashboardKeys.detail(botId),
    queryFn: () => getDeveloperDashboardPageData(botId),
    initialData,
    refetchInterval: isFleet ? 10000 : 5000,
    ...options,
  });

  const optimisticallyUpdateBotStatus = (changedBotId: string, status: DeveloperBotStatus) => {
    // 1. Update the specific dashboard query (if it matches the botId)
    if (botId === changedBotId) {
      queryClient.setQueryData<DeveloperDashboardPageData>(developerDashboardKeys.detail(changedBotId), (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          bots: prev.bots.map((bot) => (bot.botId === changedBotId ? { ...bot, status } : bot)),
          activeBot: prev.activeBot?.botId === changedBotId ? { ...prev.activeBot, status } : prev.activeBot,
        };
      });
    }

    // 2. Always update the fleet cache
    queryClient.setQueryData<DeveloperDashboardPageData>(developerDashboardKeys.fleet(), (prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        bots: prev.bots.map((bot) => (bot.botId === changedBotId ? { ...bot, status } : bot)),
      };
    });

    // 3. Invalidate to ensure consistency
    queryClient.invalidateQueries({ queryKey: developerDashboardKeys.all });
  };

  return {
    ...query,
    optimisticallyUpdateBotStatus,
  };
}
