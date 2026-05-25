'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { updateBotStatus } from '@/lib/contracts/client';
import { DeveloperBotSummary, DeveloperBotStatus } from '@/lib/contracts/types';
import { CopyButton } from './copy-button';

const statusStyles: Record<DeveloperBotStatus, { bg: string; text: string; dot: string; glow: string }> = {
  CREATED: {
    bg: 'bg-blue-500/10 border-blue-500/20',
    text: 'text-blue-400',
    dot: 'bg-blue-400',
    glow: 'shadow-[0_0_12px_rgba(59,130,246,0.2)]',
  },
  ACTIVE: {
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400 animate-pulse',
    glow: 'shadow-[0_0_12px_rgba(16,185,129,0.3)]',
  },
  PAUSED: {
    bg: 'bg-amber-500/10 border-amber-500/20',
    text: 'text-amber-400',
    dot: 'bg-amber-400',
    glow: 'shadow-[0_0_12px_rgba(245,158,11,0.2)]',
  },
  ERROR: {
    bg: 'bg-rose-500/10 border-rose-500/20',
    text: 'text-rose-400',
    dot: 'bg-rose-400 animate-ping',
    glow: 'shadow-[0_0_12px_rgba(244,63,94,0.3)]',
  },
};

interface BotGridCardProps {
  bot: DeveloperBotSummary;
}

export function BotGridCard({ bot }: BotGridCardProps) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const statusMutation = useMutation({
    mutationFn: async (nextStatus: DeveloperBotStatus) => {
      return updateBotStatus(bot.botId, nextStatus);
    },
    onSuccess: () => {
      router.refresh();
      setIsDropdownOpen(false);
    },
  });

  const style = statusStyles[bot.status] ?? {
    bg: 'bg-slate-500/10 border-slate-500/20',
    text: 'text-slate-400',
    dot: 'bg-slate-400',
    glow: '',
  };

  const handleCardClick = () => {
    router.push(`/terminal/developer-dashboard?botId=${bot.botId}`);
  };

  const apiKey = bot.apiKey ?? 'Not available';

  return (
    <div
      onClick={handleCardClick}
      className={`group relative flex flex-col justify-between rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:bg-[var(--panel-strong)] cursor-pointer ${style.glow}`}
    >
      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-500/0 via-emerald-500/0 to-emerald-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl duration-500" />
      
      <div>
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-white group-hover:text-[var(--positive)] transition-colors truncate">
              {bot.botName}
            </h3>
            <p className="mt-1 text-[10px] text-slate-500 font-mono select-all truncate" title={bot.botId}>
              ID: {bot.botId}
            </p>
          </div>

          {/* Interactive Status Selector */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[9px] font-bold tracking-wider hover:bg-white/5 transition-all outline-none cursor-pointer ${style.bg} ${style.text}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
              {bot.status}
              <svg className="w-2.5 h-2.5 opacity-60 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-32 rounded-xl border border-white/10 bg-slate-950/95 p-1 shadow-2xl z-20 backdrop-blur-md">
                  {(['ACTIVE', 'PAUSED', 'CREATED'] as const).map((statusOption) => (
                    <button
                      key={statusOption}
                      disabled={statusMutation.isPending}
                      onClick={() => {
                        statusMutation.mutate(statusOption);
                      }}
                      className="w-full flex items-center gap-2 text-left px-3 py-2 text-[9px] font-bold uppercase rounded-lg hover:bg-white/5 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusOption === 'ACTIVE' ? 'bg-emerald-400' : statusOption === 'PAUSED' ? 'bg-amber-400' : 'bg-blue-400'}`} />
                      {statusOption}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        {bot.description && (
          <p className="mt-3 text-xs text-slate-400 leading-normal line-clamp-2">
            {bot.description}
          </p>
        )}

        {/* Metadata Badges */}
        <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--panel-border)] pt-4">
          <div className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-2.5 py-1 text-[10px] font-medium text-slate-300 border border-white/5">
            <span className="text-slate-500">Venue:</span>
            <span className="font-mono text-slate-200 font-semibold">{bot.exchange ?? 'N/A'}</span>
          </div>
          <div className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/5 px-2.5 py-1 text-[10px] font-medium text-emerald-400 border border-emerald-500/10">
            <span className="text-emerald-600">Pair:</span>
            <span className="font-mono font-bold">{bot.tradingPair ?? 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* API Key Credential Block */}
      <div className="mt-5 space-y-3 pt-3 border-t border-[var(--panel-border)]">
        <div 
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-between gap-2 rounded-xl bg-slate-950/40 border border-white/5 px-3 py-2"
        >
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Public API Key</p>
            <p className="mt-0.5 font-mono text-[10px] text-slate-300 truncate" title={apiKey}>
              {apiKey.length > 20 ? `${apiKey.slice(0, 10)}...${apiKey.slice(-10)}` : apiKey}
            </p>
          </div>
          <CopyButton value={apiKey} className="h-6 w-6 flex-shrink-0" />
        </div>

        {/* Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/5 bg-[var(--panel)] py-2.5 text-xs font-bold text-slate-200 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all duration-200 cursor-pointer"
        >
          <span>Inspect Console</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
