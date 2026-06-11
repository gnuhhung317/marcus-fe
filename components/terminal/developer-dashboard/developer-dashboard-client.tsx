'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getDeveloperDashboardPageData } from '@/lib/contracts/client';
import { FleetGridView } from './fleet-grid-view';
import { DeveloperOnboardingState } from './developer-onboarding-state';
import { DeveloperDashboardPageData, DeveloperBotStatus } from '@/lib/contracts/types';

interface DeveloperDashboardClientProps {
  initialData: DeveloperDashboardPageData;
}

export function DeveloperDashboardClient({ initialData }: DeveloperDashboardClientProps) {
  const queryClient = useQueryClient();

  const { data } = useQuery<DeveloperDashboardPageData>({
    queryKey: ['developerDashboard', 'fleet'],
    queryFn: () => getDeveloperDashboardPageData(),
    initialData,
    refetchInterval: 10000, // keep fleet list fresh every 10s
  });

  const handleBotStatusChange = (botId: string, status: DeveloperBotStatus) => {
    // Optimistically update the list of bots
    queryClient.setQueryData<DeveloperDashboardPageData>(['developerDashboard', 'fleet'], (prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        bots: prev.bots.map((bot) => (bot.botId === botId ? { ...bot, status } : bot)),
      };
    });
  };

  const hasBots = data.bots.length > 0;

  if (!hasBots) {
    return <DeveloperOnboardingState />;
  }

  return (
    <FleetGridView bots={data.bots} onBotStatusChange={handleBotStatusChange} />
  );
}
