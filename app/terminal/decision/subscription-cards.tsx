'use client';

import { useState } from 'react';
import { BotDecisionCard, DecisionReason } from '@/lib/contracts/types';
import { BotDecisionCardComponent } from './bot-decision-card';

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
      {/* Filter and search controls */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {(['ALL', 'ACTIVE', 'AT_RISK'] as const).map((status) => (
            <button
              key={status}
              onClick={() => onStatusFilterChange(status)}
              className={`px-4 py-2.5 text-sm font-medium rounded-xl border transition-all duration-200 ${
                statusFilter === status
                  ? 'bg-emerald-500/10 text-emerald-400 border-[rgba(0,190,115,0.3)] font-semibold shadow-sm shadow-emerald-500/5'
                  : 'bg-white/[0.02] border-[rgba(255,255,255,0.06)] text-muted hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              {status === 'ALL' ? 'All Bots' : status === 'ACTIVE' ? 'Active' : 'At-Risk'}
            </button>
          ))}
        </div>

        {/* Search input with search icon */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search bot name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.02] border border-[rgba(255,255,255,0.08)] rounded-xl text-white text-sm placeholder-slate-500 focus:border-[rgba(16,185,129,0.45)] focus:outline-none focus:bg-white/[0.04] transition-all duration-200"
          />
        </div>
      </div>

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
