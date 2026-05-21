'use client';

import { useState } from 'react';
import { BotDecisionCard, DecisionReason } from '@/lib/contracts/types';
import { BotDecisionCardComponent } from './bot-decision-card';
import { DecisionFilter } from './decision-filter';

interface SubscriptionCardsProps {
  cards: BotDecisionCard[];
  statusFilter: 'ALL' | 'ACTIVE' | 'AT_RISK';
  onStatusFilterChange: (status: 'ALL' | 'ACTIVE' | 'AT_RISK') => void;
}

/**
 * Grid container for bot decision cards with sorting and filtering.
 * Sorts by decision reason priority: HIGH_RISK → NEEDS_REVIEW → SLIPPING → SOLID_PERFORMER
 */
export function SubscriptionCardsContainer({
  cards,
  statusFilter,
  onStatusFilterChange,
}: SubscriptionCardsProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Priority order for decision reasons
  const reasonPriority: Record<DecisionReason, number> = {
    [DecisionReason.HIGH_RISK]: 1,
    [DecisionReason.NEEDS_REVIEW]: 2,
    [DecisionReason.SLIPPING]: 3,
    [DecisionReason.SOLID_PERFORMER]: 4,
  };

  // Sort cards by reason priority
  const sortedCards = [...cards].sort((a, b) => reasonPriority[a.reason] - reasonPriority[b.reason]);

  // Filter by search term (bot name)
  const filteredCards = sortedCards.filter((card) =>
    card.botName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleKeep = (subscriptionId: string) => {
    console.log('Keep subscription:', subscriptionId);
    // TODO: Call API to confirm subscription
  };

  const handleReview = (subscriptionId: string) => {
    console.log('Review subscription:', subscriptionId);
    // TODO: Navigate to monitoring/detail page
  };

  const handleUnsubscribe = (subscriptionId: string) => {
    console.log('Unsubscribe:', subscriptionId);
    // TODO: Call API to unsubscribe
  };

  return (
    <div className="space-y-6">
      <DecisionFilter
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
      />

      {/* Cards grid */}
      {filteredCards.length === 0 ? (
        <div className="text-center py-16 bg-white/[0.01] border border-[rgba(255,255,255,0.04)] rounded-2xl">
          <p className="text-slate-400 mb-2 font-semibold">No bots found</p>
          <p className="text-xs text-slate-500">Try adjusting your filter or search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredCards.map((card) => (
            <BotDecisionCardComponent
              key={card.subscriptionId}
              card={card}
              onKeep={handleKeep}
              onReview={handleReview}
              onUnsubscribe={handleUnsubscribe}
            />
          ))}
        </div>
      )}
    </div>
  );
}
