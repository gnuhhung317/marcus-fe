'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { DeveloperBotSummary } from '@/lib/contracts/types';

const statusColors: Record<DeveloperBotSummary['status'], { bg: string; text: string; dot: string }> = {
  ACTIVE: {
    bg: 'bg-positive/10 border-positive/20',
    text: 'text-positive',
    dot: 'bg-positive animate-pulse',
  },
  PAUSED: {
    bg: 'bg-warning/10 border-warning/20',
    text: 'text-warning',
    dot: 'bg-warning',
  },
  DOWN: {
    bg: 'bg-negative/10 border-negative/20',
    text: 'text-negative',
    dot: 'bg-negative',
  },
  DELETED: {
    bg: 'bg-surface border-border',
    text: 'text-muted',
    dot: 'bg-[var(--text-muted)]',
  },
};

interface DeveloperBotListProps {
  bots: DeveloperBotSummary[];
  activeBotId?: string;
  onSelectBot?: (botId: string | undefined) => void;
  onRegisterClick?: () => void;
}

export function DeveloperBotList({ bots, activeBotId, onSelectBot, onRegisterClick }: DeveloperBotListProps) {
  const t = useTranslations('DeveloperDashboard.botList');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBots = bots.filter(
    (bot) =>
      bot.botName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.botId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bot.tradingPair && bot.tradingPair.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (bot.exchange && bot.exchange.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <article className="flex flex-col rounded-xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-sm font-bold tracking-wide uppercase text-main">{t('title')}</h2>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            {t('provisioned', { count: bots.length })}
          </p>
        </div>
        <button
          type="button"
          onClick={onRegisterClick}
          className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-border bg-surface-strong p-1.5 text-muted transition-colors hover:border-border/60 hover:text-main"
          title={t('registerTooltip')}
        >
          <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <div className="relative mb-4">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg className="h-4.5 w-4.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full rounded-xl border border-border bg-surface-strong py-2 pl-9 pr-8 text-xs text-main placeholder:text-muted outline-none transition-all focus:border-border/60"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted transition-colors hover:text-main"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="max-h-[600px] space-y-2 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[var(--border-base)] scrollbar-track-transparent">
        <button
          type="button"
          onClick={() => onSelectBot?.(undefined)}
          className={`w-full cursor-pointer rounded-xl border p-3.5 text-left transition-all duration-200 ${
            activeBotId === undefined
              ? 'border-positive/30 bg-positive/5'
              : 'border-border bg-surface hover:border-border/60 hover:bg-surface-strong'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className={`text-xs font-bold transition-colors ${activeBotId === undefined ? 'text-positive' : 'text-main'}`}>
                {t('overviewTitle')}
              </p>
              <p className="mt-1 font-mono text-[10px] text-muted">{t('overviewSubtitle')}</p>
            </div>
            <span className="flex-shrink-0 flex items-center gap-1.5 rounded-full border border-border/40 bg-surface-strong px-2 py-0.5 font-mono text-[9px] font-bold text-muted">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted" />
              {t('fleetBadge')}
            </span>
          </div>
        </button>

        {filteredBots.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-surface-strong py-8 text-center">
            <p className="text-xs text-muted">{t('empty', { query: searchQuery })}</p>
          </div>
        ) : (
          filteredBots.map((bot) => {
            const isActive = bot.botId === activeBotId;
            const style = statusColors[bot.status] || {
              bg: 'bg-surface border-border',
              text: 'text-muted',
              dot: 'bg-muted',
            };

            return (
              <button
                key={bot.botId}
                type="button"
                onClick={() => onSelectBot?.(bot.botId)}
                className="block w-full text-left outline-none"
              >
                <div
                  className={`cursor-pointer rounded-xl border p-3.5 transition-all duration-200 ${
                    isActive
                      ? 'border-positive/30 bg-positive/5'
                      : 'border-border bg-surface hover:border-border/60 hover:bg-surface-strong'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-xs font-bold transition-colors ${isActive ? 'text-main' : 'text-main'}`}>
                        {bot.botName}
                      </p>
                      <p className="mt-1 truncate font-mono text-[9px] text-muted" title={bot.botId}>
                        {bot.botId}
                      </p>
                    </div>
                    <span className={`flex-shrink-0 flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9px] font-bold ${style.bg} ${style.text} font-mono`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                      {bot.status}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center border-t border-border/40 pt-2.5 font-mono text-[9px]">
                    <div className="flex items-center gap-1.5 font-semibold uppercase text-main">
                      <span>{bot.exchange ?? t('na')}</span>
                      <span className="font-normal text-muted">•</span>
                      <span>{bot.tradingPair ?? t('na')}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </article>
  );
}
