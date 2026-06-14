'use client';

import { useState } from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBots = bots.filter((bot) =>
    bot.botName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bot.botId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (bot.tradingPair && bot.tradingPair.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (bot.exchange && bot.exchange.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <article className="rounded-xl border border-border bg-surface p-5 flex flex-col">
      <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
        <div>
          <h2 className="text-sm font-bold text-white tracking-wide uppercase">Bot Registry</h2>
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 mt-0.5 font-mono">
            {bots.length} provisioned
          </p>
        </div>
        <button
          type="button"
          onClick={onRegisterClick}
          className="inline-flex items-center justify-center rounded-lg border border-border bg-surface-strong p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer hover:border-slate-700"
          title="Register New Bot"
        >
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-4.5 h-4.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter registry..."
          className="w-full rounded-xl border border-border bg-surface-strong py-2 pl-9 pr-8 text-xs text-white placeholder:text-slate-600 outline-none transition-all focus:border-white/20"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Bot List Container */}
      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[var(--border-base)] scrollbar-track-transparent">
        {/* Global Fleet Row */}
        <button
          type="button"
          onClick={() => onSelectBot?.(undefined)}
          className={`w-full text-left rounded-xl border p-3.5 transition-all duration-200 cursor-pointer ${
            activeBotId === undefined
              ? 'border-positive/30 bg-positive/5'
              : 'border-border bg-surface hover:bg-surface-strong hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className={`text-xs font-bold transition-colors ${activeBotId === undefined ? 'text-positive' : 'text-slate-300'}`}>
                Global Fleet Overview
              </p>
              <p className="mt-1 text-[10px] text-slate-500 font-mono">Aggregated telemetry & routed logs</p>
            </div>
            <span className="flex-shrink-0 flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[9px] font-bold text-slate-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
              FLEET
            </span>
          </div>
        </button>

        {filteredBots.length === 0 ? (
          <div className="py-8 text-center rounded-xl border border-dashed border-border bg-surface-strong">
            <p className="text-xs text-slate-500">No bots matching &quot;{searchQuery}&quot;</p>
          </div>
        ) : (
          filteredBots.map((bot) => {
            const isActive = bot.botId === activeBotId;
            const style = statusColors[bot.status] || {
              bg: 'bg-surface border-border',
              text: 'text-slate-400',
              dot: 'bg-slate-400',
            };

            return (
              <button
                key={bot.botId}
                type="button"
                onClick={() => onSelectBot?.(bot.botId)}
                className="w-full text-left outline-none block"
              >
                <div
                  className={`cursor-pointer rounded-xl border p-3.5 transition-all duration-200 ${
                    isActive
                      ? 'border-positive/30 bg-positive/5'
                      : 'border-border bg-surface hover:bg-surface-strong hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-xs font-bold transition-colors ${isActive ? 'text-white' : 'text-slate-300'}`}>
                        {bot.botName}
                      </p>
                      <p className="mt-1 truncate font-mono text-[9px] text-slate-500" title={bot.botId}>
                        {bot.botId}
                      </p>
                    </div>
                    <span className={`flex-shrink-0 flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9px] font-bold ${style.bg} ${style.text} font-mono`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                      {bot.status}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center border-t border-white/5 pt-2.5 text-[9px] font-mono">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-300 uppercase">
                      <span>{bot.exchange ?? 'N/A'}</span>
                      <span className="text-slate-600 font-normal">•</span>
                      <span>{bot.tradingPair ?? 'N/A'}</span>
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
