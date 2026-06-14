'use client';

import { useEffect, useRef, useState } from 'react';
import { favoriteBot, unsubscribeFromBot } from '@/lib/contracts/client';
import { BotDecisionCard, DecisionReason } from '@/lib/contracts/types';
import { BotDecisionRow } from './bot-decision-row';
import { DecisionFilter } from '@/app/terminal/decision/decision-filter';
import { EmptyStateCard } from '@/components/shared/api-state';

interface SubscriptionListProps {
  cards: BotDecisionCard[];
  statusFilter: 'ALL' | 'ACTIVE' | 'AT_RISK';
  onStatusFilterChange: (status: 'ALL' | 'ACTIVE' | 'AT_RISK') => void;
  onRefreshRequested: () => Promise<void> | void;
  summary: {
    totalCount: number;
    activeCount: number;
    reviewNeededCount: number;
    highRiskCount: number;
  };
}

const attentionReasons = new Set<DecisionReason>([
  DecisionReason.HIGH_RISK,
  DecisionReason.NEEDS_REVIEW,
  DecisionReason.SLIPPING,
]);

export function SubscriptionList({
  cards,
  statusFilter,
  onStatusFilterChange,
  onRefreshRequested,
  summary,
}: SubscriptionListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [favoriteBotIds, setFavoriteBotIds] = useState<string[]>([]);
  const [busyBotId, setBusyBotId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ tone: 'success' | 'error'; message: string } | null>(null);
  const [confirmingBot, setConfirmingBot] = useState<BotDecisionCard | null>(null);

  const filteredCards = cards.filter((card) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;
    return card.botName.toLowerCase().includes(query) || card.exchange.toLowerCase().includes(query);
  });

  const handleKeep = async (botId: string) => {
    setBusyBotId(botId);
    setFeedback(null);
    try {
      const result = await favoriteBot(botId);
      if (result.favorited) {
        setFavoriteBotIds((current) => (current.includes(botId) ? current : [...current, botId]));
      }
      setFeedback({ tone: 'success', message: 'Bot marked as kept.' });
    } catch (error) {
      setFeedback({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Unable to keep this bot right now.',
      });
    } finally {
      setBusyBotId(null);
    }
  };

  const handleUnsubscribe = async () => {
    if (!confirmingBot) return;
    const botId = confirmingBot.botId;
    setBusyBotId(botId);
    setFeedback(null);
    try {
      await unsubscribeFromBot(botId);
      setFeedback({ tone: 'success', message: `${confirmingBot.botName} unsubscribed.` });
      setConfirmingBot(null);
      await onRefreshRequested();
    } catch (error) {
      setFeedback({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Unable to unsubscribe.',
      });
    } finally {
      setBusyBotId(null);
    }
  };

  return (
    <div className="space-y-4">
      <DecisionFilter
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        resultCount={filteredCards.length}
        totalCount={summary.totalCount}
        counts={{
          active: summary.activeCount,
          atRisk: summary.reviewNeededCount + summary.highRiskCount,
        }}
      />

      {feedback && (
        <div className="rounded border border-white/5 bg-[#0b0e14] px-4 py-3">
          <p className={`text-xs font-semibold ${feedback.tone === 'success' ? 'text-positive' : 'text-negative'}`}>
            {feedback.message}
          </p>
        </div>
      )}

      {filteredCards.length === 0 ? (
        <EmptyStateCard title="No subscriptions found" message="Adjust filters or search parameters." />
      ) : (
        <div className="flex flex-col gap-2">
          {filteredCards.map((card) => (
            <BotDecisionRow
              key={card.subscriptionId}
              card={card}
              isBusy={busyBotId === card.botId}
              isKept={favoriteBotIds.includes(card.botId)}
              onKeep={handleKeep}
              onUnsubscribe={(id) => setConfirmingBot(card)}
            />
          ))}
        </div>
      )}

      {confirmingBot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded border border-white/10 bg-[#0b0e14] p-5">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-negative">Confirm Unsubscribe</h4>
            <p className="mt-3 text-xs text-muted leading-relaxed">
              Are you sure you want to unsubscribe from <span className="font-semibold text-white">{confirmingBot.botName}</span>?
              This action will halt active executions for this bot on {confirmingBot.exchange}.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmingBot(null)}
                className="px-3 py-1.5 text-xs font-semibold rounded border border-white/10 bg-white/[0.02] text-white hover:bg-white/[0.06]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleUnsubscribe()}
                disabled={busyBotId === confirmingBot.botId}
                className="px-3 py-1.5 text-xs font-semibold rounded border border-negative/20 bg-negative/5 text-negative hover:bg-negative/10"
              >
                {busyBotId === confirmingBot.botId ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
