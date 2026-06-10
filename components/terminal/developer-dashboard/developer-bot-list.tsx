'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DeveloperBotSummary } from '@/lib/contracts/types';

const statusColors: Record<DeveloperBotSummary['status'], { bg: string; text: string; dot: string }> = {
  ACTIVE: {
    bg: 'bg-positive-soft border-[var(--panel-border)]',
    text: 'text-positive',
    dot: 'bg-positive animate-pulse',
  },
  PAUSED: {
    bg: 'bg-warning-soft border-[var(--panel-border)]',
    text: 'text-warning',
    dot: 'bg-warning',
  },
  DOWN: {
    bg: 'bg-negative-soft border-[var(--panel-border)]',
    text: 'text-negative',
    dot: 'bg-negative animate-ping',
  },
  DELETED: {
    bg: 'bg-surface border-[var(--panel-border)]',
    text: 'text-muted',
    dot: 'bg-[var(--fg-muted)]',
  },
};

interface DeveloperBotListProps {
  bots: DeveloperBotSummary[];
  activeBotId?: string;
}

export function DeveloperBotList({ bots, activeBotId }: DeveloperBotListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBots = bots.filter((bot) =>
    bot.botName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bot.botId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (bot.tradingPair && bot.tradingPair.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (bot.exchange && bot.exchange.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)] border border-[var(--panel-border)] relative overflow-hidden group">
      <div className="flex items-center justify-between border-b border-[var(--panel-border)] pb-4 mb-4">
        <div>
          <h2 className="text-sm font-bold text-fg tracking-wide">Bot Registry</h2>
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted mt-0.5 font-semibold">
            {bots.length} provisioned
          </p>
        </div>
        <Link
          href="/terminal/create-bot"
          className="inline-flex items-center justify-center rounded-lg border border-[var(--panel-border)] bg-surface p-1.5 text-muted transition-colors cursor-pointer hover:bg-surface-strong hover:text-fg"
          title="Register New Bot"
        >
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </Link>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter registry..."
          className="w-full rounded-xl border border-[var(--panel-border)] bg-surface py-2 pl-9 pr-4 text-xs text-fg placeholder:text-muted outline-none transition-all focus:border-[var(--primary-soft)] focus:bg-surface-strong focus:shadow-[0_0_12px_var(--primary-soft)]"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted hover:text-fg"
          >
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Bot List Container */}
      <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[var(--panel-border)] scrollbar-track-transparent">
        {filteredBots.length === 0 ? (
          <div className="py-8 text-center rounded-xl border border-dashed border-[var(--panel-border)] bg-surface">
            <p className="text-xs text-muted">No bots matching &quot;{searchQuery}&quot;</p>
          </div>
        ) : (
          filteredBots.map((bot) => {
            const isActive = bot.botId === activeBotId;
            const style = statusColors[bot.status] || {
              bg: 'bg-surface border-[var(--panel-border)]',
              text: 'text-muted',
              dot: 'bg-[var(--fg-muted)]',
            };

            return (
              <Link
                key={bot.botId}
                href={`/terminal/developer-dashboard?botId=${bot.botId}`}
                className="block outline-none"
              >
                <div
                  className={`group/item cursor-pointer rounded-xl border p-3.5 transition-all duration-300 ${
                    isActive
                      ? 'border-[var(--panel-border)] bg-positive-soft'
                      : 'border-[var(--panel-border)] bg-surface hover:bg-surface-strong hover:border-[var(--panel-border)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-xs font-semibold leading-snug transition-colors ${isActive ? 'text-fg' : 'text-muted group-hover/item:text-fg'}`}>
                        {bot.botName}
                      </p>
                      <p className="mt-1 truncate font-mono text-[10px] text-muted" title={bot.botId}>
                        {bot.botId.slice(0, 12)}...
                      </p>
                    </div>
                    <span className={`flex-shrink-0 flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[9px] font-bold tracking-wider ${style.bg} ${style.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                      {bot.status}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-[var(--panel-border)] pt-2.5 text-[10px]">
                    <div className="flex items-center gap-1.5 text-muted">
                      <span>Venue:</span>
                      <span className="font-mono font-medium text-fg">{bot.exchange ?? 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted">
                      <span>Pair:</span>
                      <span className="font-mono font-semibold text-fg">{bot.tradingPair ?? 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </article>
  );
}
