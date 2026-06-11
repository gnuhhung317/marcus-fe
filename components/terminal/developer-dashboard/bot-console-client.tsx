'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getDeveloperDashboardPageData } from '@/lib/contracts/client';
import { DeveloperBotList } from './developer-bot-list';
import { BotDetailCard } from './bot-detail-card';
import {
  DeveloperDashboardPageData,
  DeveloperBotStatus,
} from '@/lib/contracts/types';

interface BotConsoleClientProps {
  initialData: DeveloperDashboardPageData;
  botId: string;
}

export function BotConsoleClient({ initialData, botId }: BotConsoleClientProps) {
  const queryClient = useQueryClient();

  const { data } = useQuery<DeveloperDashboardPageData>({
    queryKey: ['developerDashboard', botId],
    queryFn: () => getDeveloperDashboardPageData(botId),
    initialData,
    refetchInterval: 5000, // keep single bot console telemetry fresh every 5s
  });

  const handleBotStatusChange = (changedBotId: string, status: DeveloperBotStatus) => {
    // Update active bot status in cache
    queryClient.setQueryData<DeveloperDashboardPageData>(['developerDashboard', botId], (prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        bots: prev.bots.map((bot) => (bot.botId === changedBotId ? { ...bot, status } : bot)),
        activeBot: prev.activeBot?.botId === changedBotId ? { ...prev.activeBot, status } : prev.activeBot,
      };
    });

    // Also invalidate the fleet cache to keep list sync'd
    queryClient.invalidateQueries({ queryKey: ['developerDashboard', 'fleet'] });
  };

  const activeBot = data.activeBot || initialData.activeBot;

  if (!activeBot) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-slate-400">Bot console data could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr] min-h-screen items-start">
      <aside className="w-full lg:sticky lg:top-8">
        <DeveloperBotList bots={data.bots ?? initialData.bots} activeBotId={botId} />
      </aside>

      <main className="w-full min-w-0">
        <BotDetailCard
          bot={activeBot}
          subscriptions={data.subscriptions ?? []}
          integrationHealth={data.integrationHealth ?? null}
          signals={data.signals ?? []}
          isSwitching={false}
          onStatusChange={handleBotStatusChange}
        />
      </main>
    </div>
  );
}
