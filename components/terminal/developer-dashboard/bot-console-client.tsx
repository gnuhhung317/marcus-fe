'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('DeveloperDashboard');
  const router = useRouter();
  const { data, optimisticallyUpdateBotStatus } = useDeveloperDashboard(botId, initialData);

  const activeBot = data?.activeBot || initialData.activeBot;

  if (!activeBot) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted">{t('consoleError')}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr] min-h-screen items-start">
      <aside className="w-full lg:sticky lg:top-8">
        <DeveloperBotList
          bots={data?.bots ?? initialData.bots}
          activeBotId={botId}
          onSelectBot={(nextBotId) => {
            if (!nextBotId) {
              router.push('/terminal/developer-dashboard');
              return;
            }

            if (nextBotId !== botId) {
              router.push(`/terminal/developer-dashboard/${nextBotId}`);
            }
          }}
          onRegisterClick={() => router.push('/terminal/create-bot')}
        />
      </aside>

      <main className="w-full min-w-0">
        <BotDetailCard
          bot={activeBot}
          subscriptions={data?.subscriptions ?? []}
          integrationHealth={data?.integrationHealth ?? null}
          signals={data?.signals ?? []}
          isSwitching={false}
          onStatusChange={optimisticallyUpdateBotStatus}
          onBackToFleet={() => router.push('/terminal/developer-dashboard')}
        />
      </main>
    </div>
  );
}
