'use client';

import { useEffect, useRef, useState } from 'react';
import { favoriteBot, unsubscribeFromBot } from '@/lib/contracts/client';
import { BotDecisionCard, DecisionReason } from '@/lib/contracts/types';
import { BotDecisionCardComponent } from './bot-decision-card';
import { DecisionFilter } from './decision-filter';
import { EmptyStateCard } from '@/components/shared/api-state';

interface SubscriptionCardsProps {
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

const reasonPriority: Record<DecisionReason, number> = {
  [DecisionReason.HIGH_RISK]: 1,
  [DecisionReason.NEEDS_REVIEW]: 2,
  [DecisionReason.SLIPPING]: 3,
  [DecisionReason.SOLID_PERFORMER]: 4,
};

const attentionReasons = new Set<DecisionReason>([
  DecisionReason.HIGH_RISK,
  DecisionReason.NEEDS_REVIEW,
  DecisionReason.SLIPPING,
]);

export function SubscriptionCardsContainer({
  cards,
  statusFilter,
  onStatusFilterChange,
  onRefreshRequested,
  summary,
}: SubscriptionCardsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [favoriteBotIds, setFavoriteBotIds] = useState<string[]>([]);
  const [busyBotId, setBusyBotId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ tone: 'success' | 'error'; message: string } | null>(null);
  const [confirmingBot, setConfirmingBot] = useState<BotDecisionCard | null>(null);
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!confirmingBot) return undefined;

    cancelButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setConfirmingBot(null);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [confirmingBot]);

  const sortedCards = [...cards].sort((a, b) => reasonPriority[a.reason] - reasonPriority[b.reason]);
  const filteredCards = sortedCards.filter((card) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;
    return card.botName.toLowerCase().includes(query) || card.exchange.toLowerCase().includes(query);
  });

  const attentionCards = filteredCards.filter((card) => attentionReasons.has(card.reason));
  const healthyCards = filteredCards.filter((card) => card.reason === DecisionReason.SOLID_PERFORMER);

  const handleKeep = async (botId: string) => {
    setBusyBotId(botId);
    setFeedback(null);
    try {
      const result = await favoriteBot(botId);
      if (result.favorited) {
        setFavoriteBotIds((current) => (current.includes(botId) ? current : [...current, botId]));
      }
      setFeedback({ tone: 'success', message: 'Bot marked as kept for now.' });
    } catch (error) {
      setFeedback({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Unable to keep this bot right now.',
      });
    } finally {
      setBusyBotId(null);
    }
  };

  const handleUnsubscribeRequest = (botId: string) => {
    const card = filteredCards.find((item) => item.botId === botId) ?? cards.find((item) => item.botId === botId) ?? null;
    setConfirmingBot(card);
  };

  const executeUnsubscribe = async () => {
    if (!confirmingBot) return;

    const botId = confirmingBot.botId;
    setBusyBotId(botId);
    setFeedback(null);

    try {
      await unsubscribeFromBot(botId);
      setFeedback({ tone: 'success', message: `${confirmingBot.botName} unsubscribed successfully.` });
      setConfirmingBot(null);
      await onRefreshRequested();
    } catch (error) {
      setFeedback({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Unable to unsubscribe right now.',
      });
    } finally {
      setBusyBotId(null);
    }
  };

  const groupedEmpty = filteredCards.length === 0;

  return (
    <div className="space-y-6">
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

      {feedback ? (
        <div className="rounded-xl border border-border/40 bg-surface/40 p-4">
          <p className={`text-sm font-medium ${feedback.tone === 'success' ? 'text-positive' : 'text-negative'}`}>
            {feedback.message}
          </p>
        </div>
      ) : null}

      {groupedEmpty ? (
        <EmptyStateCard title="No bots found" message="Try adjusting the status filter or search term." />
      ) : (
        <div className="space-y-8">
          <section className="space-y-3">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-main">Needs attention</h3>
                <p className="mt-1 text-xs text-muted">
                  {attentionCards.length} subscriptions need a decision.
                </p>
              </div>
              <p className="text-xs text-muted">
                High risk: <span className="font-semibold text-negative">{summary.highRiskCount}</span>
              </p>
            </div>

            {attentionCards.length === 0 ? (
              <EmptyStateCard
                title="No urgent subscriptions"
                message="Everything in the current filter looks stable."
              />
            ) : (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {attentionCards.map((card) => (
                  <BotDecisionCardComponent
                    key={card.subscriptionId}
                    card={card}
                    onKeep={handleKeep}
                    onUnsubscribe={handleUnsubscribeRequest}
                    isBusy={busyBotId === card.botId}
                    isKept={favoriteBotIds.includes(card.botId)}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="space-y-3">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-main">Healthy</h3>
                <p className="mt-1 text-xs text-muted">
                  {healthyCards.length} stable subscriptions remain in the background.
                </p>
              </div>
              <p className="text-xs text-muted">
                Active: <span className="font-semibold text-main">{summary.activeCount}</span>
              </p>
            </div>

            {healthyCards.length === 0 ? (
              <EmptyStateCard
                title="No healthy bots in this filter"
                message="Try clearing the status filter to see all subscriptions."
              />
            ) : (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {healthyCards.map((card) => (
                  <BotDecisionCardComponent
                    key={card.subscriptionId}
                    card={card}
                    onKeep={handleKeep}
                    onUnsubscribe={handleUnsubscribeRequest}
                    isBusy={busyBotId === card.botId}
                    isKept={favoriteBotIds.includes(card.botId)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {confirmingBot ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-canvas/80 px-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => setConfirmingBot(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-border/40 bg-surface p-6 shadow-[var(--shadow-soft)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-unsubscribe-title"
            aria-describedby="confirm-unsubscribe-description"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-xs uppercase tracking-[0.16em] text-negative">Confirm unsubscribe</p>
            <h3 id="confirm-unsubscribe-title" className="mt-2 text-xl font-semibold text-main">
              {confirmingBot.botName}
            </h3>
            <p id="confirm-unsubscribe-description" className="mt-3 text-sm text-muted">
              This removes the bot from your subscription list. If you only need to review its performance, keep it subscribed and use Review instead.
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmingBot(null)}
                ref={cancelButtonRef}
                className="rounded-xl border border-border/40 bg-surface-strong px-4 py-2 text-sm font-semibold text-main transition-colors hover:bg-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void executeUnsubscribe()}
                disabled={busyBotId === confirmingBot.botId}
                className="rounded-xl border border-negative/20 bg-negative/10 px-4 py-2 text-sm font-semibold text-negative transition-colors hover:bg-negative/15 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busyBotId === confirmingBot.botId ? 'Unsubscribing...' : 'Unsubscribe'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
