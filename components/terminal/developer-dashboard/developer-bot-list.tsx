'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DeveloperBotSummary } from '../../../lib/contracts/types';

const statusColors: Record<DeveloperBotSummary['status'], { bg: string; text: string; dot: string }> = {
  CREATED: {
    bg: 'bg-blue-500/10 border-blue-500/20',
    text: 'text-blue-400',
    dot: 'bg-blue-400',
  },
  ACTIVE: {
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400 animate-pulse',
  },
  PAUSED: {
    bg: 'bg-amber-500/10 border-amber-500/20',
    text: 'text-amber-400',
    dot: 'bg-amber-400',
  },
  ERROR: {
    bg: 'bg-rose-500/10 border-rose-500/20',
    text: 'text-rose-400',
    dot: 'bg-rose-400 animate-ping',
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
    <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)] border border-[rgba(255,255,255,0.06)] relative overflow-hidden group">
      {/* Visual background ambient glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-500" />
      
      <div className="flex items-center justify-between border-b border-[rgba(148,163,184,0.12)] pb-4 mb-4">
        <div>
          <h2 className="text-sm font-bold text-white tracking-wide">Bot Registry</h2>
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted mt-0.5 font-semibold">
            {bots.length} provisioned
          </p>
        </div>
        <Link
          href="/terminal/create-bot"
          className="inline-flex items-center justify-center p-1.5 rounded-lg bg-white/5 border border-white/8 hover:bg-emerald-500/15 hover:border-emerald-500/30 hover:text-white transition-all cursor-pointer text-muted"
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
          <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter registry..."
          className="w-full bg-[rgba(6,10,18,0.4)] border border-[rgba(255,255,255,0.06)] rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500/50 focus:bg-[rgba(6,10,18,0.6)] focus:shadow-[0_0_12px_rgba(16,185,129,0.05)] transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300"
          >
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Bot List Container */}
      <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {filteredBots.length === 0 ? (
          <div className="py-8 text-center rounded-xl border border-dashed border-white/5 bg-[rgba(6,10,18,0.2)]">
            <p className="text-xs text-slate-500">No bots matching &quot;{searchQuery}&quot;</p>
          </div>
        ) : (
          filteredBots.map((bot) => {
            const isActive = bot.botId === activeBotId;
            const style = statusColors[bot.status] || {
              bg: 'bg-slate-500/10 border-slate-500/20',
              text: 'text-slate-400',
              dot: 'bg-slate-400',
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
                      ? 'border-emerald-500/35 bg-emerald-500/[0.04] shadow-[0_0_16px_rgba(16,185,129,0.06)]'
                      : 'border-[rgba(255,255,255,0.05)] bg-[rgba(6,10,18,0.3)] hover:bg-[rgba(255,255,255,0.02)] hover:border-white/10 hover:translate-x-[1px]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-semibold leading-snug transition-colors truncate ${isActive ? 'text-white' : 'text-slate-300 group-hover/item:text-white'}`}>
                        {bot.botName}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-500 font-mono truncate" title={bot.botId}>
                        {bot.botId.slice(0, 12)}...
                      </p>
                    </div>
                    <span className={`flex-shrink-0 flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[9px] font-bold tracking-wider ${style.bg} ${style.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                      {bot.status}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-[rgba(255,255,255,0.04)] pt-2.5 text-[10px]">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <span>Venue:</span>
                      <span className="text-slate-300 font-mono font-medium">{bot.exchange ?? 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <span>Pair:</span>
                      <span className="text-white font-semibold font-mono">{bot.tradingPair ?? 'N/A'}</span>
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
