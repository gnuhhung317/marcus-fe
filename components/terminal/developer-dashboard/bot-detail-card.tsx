'use client';

import { useState } from 'react';
import { BotAnalyticsSection } from '@/components/terminal/bot-detail/bot-analytics-section';
import {
  BotIntegrationHealth,
  DeveloperBotDetail,
  DeveloperBotStatus,
  DeveloperSignalItem,
  DeveloperSubscriptionSummary,
} from '@/lib/contracts/types';
import { Card } from '@/components/ui/card';
import { EditBotModal } from './edit-bot-modal';
import { DeleteBotModal } from './delete-bot-modal';
import { SignalDetailDrawer } from './signal-detail-drawer';
import { useBotOperations } from '@/lib/hooks/use-bot-operations';

// Sub-components
import { BotDetailHeader } from './bot-detail/bot-detail-header';
import { BotDetailTabs } from './bot-detail/bot-detail-tabs';
import { BotOverviewTab } from './bot-detail/bot-overview-tab';
import { BotCredentialsTab } from './bot-detail/bot-credentials-tab';
import { BotIntegrationTab } from './bot-detail/bot-integration-tab';
import { BotSignalsTab } from './bot-detail/bot-signals-tab';
import { BotSubscribersTab } from './bot-detail/bot-subscribers-tab';

interface BotDetailCardProps {
  bot: DeveloperBotDetail;
  subscriptions: DeveloperSubscriptionSummary[];
  integrationHealth: BotIntegrationHealth | null;
  signals: DeveloperSignalItem[];
  isSwitching?: boolean;
  onStatusChange?: (botId: string, status: DeveloperBotStatus) => void;
}

export function BotDetailCard({ bot, subscriptions, integrationHealth, signals, isSwitching = false, onStatusChange }: BotDetailCardProps) {
  const {
    activeTab,
    setActiveTab,
    localStatus,
    statusError,
  } = useBotOperations(bot.botId, bot.status, onStatusChange);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState<DeveloperSignalItem | null>(null);

  const subscriberCount = subscriptions.length;
  const connectedCount = subscriptions.filter((sub) => sub.status === 'CONNECTED').length;
  const activeCount = subscriptions.filter((sub) => sub.status === 'ACTIVE').length;

  return (
    <Card variant="glass-strong" className="flex h-full flex-col overflow-hidden shadow-[var(--shadow-soft)]">
      {isSwitching && <div className="h-1 w-full animate-pulse bg-primary-soft" />}

      <BotDetailHeader 
        bot={bot} 
        localStatus={localStatus} 
        integrationHealth={integrationHealth}
        onEdit={() => setIsEditModalOpen(true)}
        onDelete={() => setIsDeleteModalOpen(true)}
      />

      {statusError && (
        <div className="mx-6 mt-4 rounded-xl border border-border bg-negative-soft px-4 py-3 text-sm text-negative sm:mx-8">
          {statusError}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-6">
        <BotDetailTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          status={localStatus} 
        />

        <div className="flex-1 p-6 pt-0 sm:p-8 sm:pt-0">
          {activeTab === 'overview' && (
            <BotOverviewTab 
              bot={bot} 
              localStatus={localStatus}
              subscriberCount={subscriberCount}
              connectedCount={connectedCount}
              activeCount={activeCount}
            />
          )}

          {activeTab === 'analytics' && (
            <BotAnalyticsSection analytics={bot.analytics ?? null} />
          )}

          {activeTab === 'credentials' && (
            <BotCredentialsTab 
              botId={bot.botId} 
              apiKey={bot.apiKey ?? 'Not available'}
              exchange={bot.exchange ?? 'binance'}
              pair={bot.tradingPair ?? 'BTC/USDT'}
            />
          )}

          {activeTab === 'integration' && (
            <BotIntegrationTab integrationHealth={integrationHealth} />
          )}

          {activeTab === 'signals' && (
            <BotSignalsTab 
              signals={signals} 
              isSwitching={isSwitching} 
              onSelectSignal={setSelectedSignal} 
            />
          )}

          {activeTab === 'subscribers' && (
            <BotSubscribersTab 
              subscriptions={subscriptions} 
              isSwitching={isSwitching} 
            />
          )}
        </div>
      </div>

      <SignalDetailDrawer signal={selectedSignal} onClose={() => setSelectedSignal(null)} />

      <EditBotModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} bot={bot} />
      <DeleteBotModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        bot={bot}
        activeSubscribersCount={subscriptions.filter((s) => s.status === 'ACTIVE' || s.status === 'CONNECTED').length}     
      />
    </Card>
  );
}
