'use client';

import { useCallback, useDeferredValue, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { BotDecisionCard } from '@/lib/contracts/types';
import { useUnsubscribeFromDecisionBot } from '@/lib/hooks/use-portfolio-decisions';
import { BotDecisionRow } from './bot-decision-row';
import { DecisionFilter } from '@/app/[locale]/terminal/decision/decision-filter';
import { EmptyStateCard } from '@/components/shared/api-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DecisionStatusFilter } from '@/lib/hooks/use-portfolio-decisions';

interface SubscriptionListProps {
  cards: BotDecisionCard[];
  statusFilter: DecisionStatusFilter;
  onStatusFilterChange: (status: DecisionStatusFilter) => void;
  onRefreshRequested: () => Promise<void> | void;
  summary: {
    totalCount: number;
    activeCount: number;
    reviewNeededCount: number;
    highRiskCount: number;
  };
  isFiltering?: boolean;
}

export function SubscriptionList({
  cards,
  statusFilter,
  onStatusFilterChange,
  onRefreshRequested,
  summary,
  isFiltering = false,
}: SubscriptionListProps) {
  const t = useTranslations('Decision.subscriptions');
  const [searchTerm, setSearchTerm] = useState('');
  const [busyBotId, setBusyBotId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ tone: 'success' | 'error'; message: string } | null>(null);
  const [confirmingBot, setConfirmingBot] = useState<BotDecisionCard | null>(null);
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const unsubscribe = useUnsubscribeFromDecisionBot();

  const filteredCards = useMemo(() => {
    const query = deferredSearchTerm.trim().toLowerCase();
    if (!query) {
      return cards;
    }

    return cards.filter(
      (card) => card.botName.toLowerCase().includes(query) || card.exchange.toLowerCase().includes(query)
    );
  }, [cards, deferredSearchTerm]);

  const handleOpenUnsubscribeConfirm = useCallback((card: BotDecisionCard) => {
    setConfirmingBot(card);
  }, []);

  const handleUnsubscribe = async () => {
    if (!confirmingBot) return;
    const botId = confirmingBot.botId;
    setBusyBotId(botId);
    setFeedback(null);
    try {
      await unsubscribe(botId);
      setFeedback({ tone: 'success', message: t('unsubscribed', { botName: confirmingBot.botName }) });
      setConfirmingBot(null);
      await onRefreshRequested();
    } catch (error) {
      setFeedback({
        tone: 'error',
        message: error instanceof Error ? error.message : t('error'),
      });
    } finally {
      setBusyBotId(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <DecisionFilter
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        resultCount={filteredCards.length}
        totalCount={summary.totalCount}
        isFiltering={isFiltering}
        counts={{
          active: summary.activeCount,
          atRisk: summary.reviewNeededCount + summary.highRiskCount,
        }}
      />

      {feedback && (
        <Card variant="glass-strong" className="flex items-center gap-3 px-4 py-3">
          <Badge variant={feedback.tone === 'success' ? 'success' : 'error'}>{feedback.tone}</Badge>
          <p className="text-xs font-semibold text-main">{feedback.message}</p>
        </Card>
      )}

      {filteredCards.length === 0 ? (
        <EmptyStateCard title={t('empty.title')} message={t('empty.message')} />
      ) : (
        <div className="flex flex-col gap-2">
          {filteredCards.map((card) => (
            <BotDecisionRow
              key={card.subscriptionId}
              card={card}
              isBusy={busyBotId === card.botId}
              onUnsubscribe={handleOpenUnsubscribeConfirm}
            />
          ))}
        </div>
      )}

      {confirmingBot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-4 backdrop-blur-sm">
          <Card variant="glass-strong" className="w-full max-w-md p-5">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-negative">{t('confirm.title')}</h4>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              {t('confirm.message', { botName: confirmingBot.botName, exchange: confirmingBot.exchange })}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setConfirmingBot(null)}
              >
                {t('cancel')}
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={() => void handleUnsubscribe()}
                disabled={busyBotId === confirmingBot.botId}
              >
                {busyBotId === confirmingBot.botId ? t('processing') : t('confirm.action')}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
