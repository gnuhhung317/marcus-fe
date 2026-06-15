'use client';

import { useDeveloperDashboard } from '@/lib/hooks/use-developer-dashboard';
import { DeveloperBotList } from './developer-bot-list';
import { BotDetailCard } from './bot-detail-card';
import {
  DeveloperDashboardPageData,
} from '@/lib/contracts/types';

interface BotConsoleClientProps {
  initialData: DeveloperDashboardPageData;
  botId: string;
}

export function BotConsoleClient({ initialData, botId }: BotConsoleClientProps) {
  const { data, optimisticallyUpdateBotStatus } = useDeveloperDashboard(botId, initialData);

  const activeBot = data?.activeBot || initialData.activeBot;

  if (!activeBot) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted">Bot console data could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr] min-h-screen items-start">
      <aside className="w-full lg:sticky lg:top-8">
        <DeveloperBotList bots={data?.bots ?? initialData.bots} activeBotId={botId} />
      </aside>

      <main className="w-full min-w-0">
        <BotDetailCard
          bot={activeBot}
          subscriptions={data?.subscriptions ?? []}
          integrationHealth={data?.integrationHealth ?? null}
          signals={data?.signals ?? []}
          isSwitching={false}
          onStatusChange={optimisticallyUpdateBotStatus}
        />
      </main>
    </div>
  );
}
