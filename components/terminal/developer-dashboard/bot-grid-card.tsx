'use client';

import { useEffect, useState } from 'react';
import { useBotMutations } from '@/lib/hooks/use-bot-mutations';
import { CopyButton } from './copy-button';
import { DeveloperBotSummary, DeveloperBotStatus } from '@/lib/contracts/types';

const statusStyles: Record<DeveloperBotStatus, { badge: string; dot: string; label: string }> = {
  ACTIVE: {
    badge: 'bg-positive/10 text-positive border-positive/20',
    dot: 'bg-positive',
    label: 'Active',
  },
  PAUSED: {
    badge: 'bg-warning/10 text-warning border-warning/20',
    dot: 'bg-warning',
    label: 'Paused',
  },
  DOWN: {
    badge: 'bg-negative/10 text-negative border-negative/20',
    dot: 'bg-negative',
    label: 'Down',
  },
  DELETED: {
    badge: 'bg-white/5 text-slate-400 border-white/5',
    dot: 'bg-slate-400',
    label: 'Deleted',
  },
};

interface BotGridCardProps {
  bot: DeveloperBotSummary;
  onStatusChange?: (botId: string, newStatus: DeveloperBotStatus) => void;
  onSelect?: (botId: string) => void;
}

function getSeededBotData(botId: string) {
  let hash = 0;
  for (let i = 0; i < botId.length; i++) {
    hash = botId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Seeded PNL between -5.00% and +15.00%
  const absHash = Math.abs(hash);
  const pnlPct = (absHash % 2000) / 100 - 5;
  const isPositive = pnlPct >= 0;
  
  const points: number[] = [];
  let currentVal = 50;
  points.push(currentVal);
  
  for (let i = 0; i < 11; i++) {
    const seed = Math.sin(hash + i) * 1000;
    const step = (seed - Math.floor(seed)) * 24 - 12;
    currentVal = Math.max(10, Math.min(90, currentVal + step));
    points.push(currentVal);
  }
  
  const width = 120;
  const height = 36;
  const padding = 2;
  const usableHeight = height - padding * 2;
  
  const minVal = Math.min(...points);
  const maxVal = Math.max(...points);
  const valRange = maxVal - minVal || 1;
  
  const svgPoints = points.map((val, idx) => {
    const x = (idx / (points.length - 1)) * width;
    const normalizedY = (val - minVal) / valRange;
    const y = padding + usableHeight - normalizedY * usableHeight;
    return { x, y };
  });
  
  const linePath = svgPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${width.toFixed(1)} ${height.toFixed(1)} L 0 ${height.toFixed(1)} Z`;
  
  return {
    pnlPct,
    isPositive,
    linePath,
    areaPath,
  };
}

export function BotGridCard({ bot, onStatusChange, onSelect }: BotGridCardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [localStatus, setLocalStatus] = useState<DeveloperBotStatus>(bot.status);
  
  const { pnlPct, isPositive, linePath, areaPath } = getSeededBotData(bot.botId);

  const { updateStatus } = useBotMutations();

  useEffect(() => {
    setLocalStatus(bot.status);
    setStatusError(null);
  }, [bot.botId, bot.status]);

  const handleStatusToggle = (nextStatus: DeveloperBotStatus) => {
    updateStatus.mutate(
      { botId: bot.botId, status: nextStatus },
      {
        onSuccess: (updated) => {
          const newStatus = updated.status as DeveloperBotStatus ?? nextStatus;
          setLocalStatus(newStatus);
          setIsDropdownOpen(false);
          setStatusError(null);
          onStatusChange?.(bot.botId, newStatus);
        },
        onError: (error) => {
          setStatusError(error.message);
        },
      }
    );
  };

  const style = statusStyles[localStatus] ?? statusStyles.DELETED;
  const apiKey = bot.apiKey ?? 'Not available';
  const nextLifecycleStatus: DeveloperBotStatus | null =
    localStatus === 'ACTIVE' ? 'PAUSED' : localStatus === 'PAUSED' || localStatus === 'DOWN' ? 'ACTIVE' : null;
  const lifecycleLabel = nextLifecycleStatus === 'PAUSED' ? 'Stop bot' : nextLifecycleStatus === 'ACTIVE' ? 'Resume bot' : 'Status locked';

  return (
    <article className="group relative h-full rounded-xl border border-border bg-surface shadow-[var(--shadow-soft)] transition-colors duration-200 hover:border-slate-500/30 flex flex-col p-5 font-mono">
      <div className="flex-1 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1 font-sans">
            <h3 className="truncate text-base font-bold text-white uppercase tracking-tight">{bot.botName}</h3>
            <p className="font-mono text-[10px] text-slate-500">{bot.botId}</p>
          </div>

          <div className="relative shrink-0 font-sans">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen((current) => !current);
              }}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${style.badge}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
              {style.label}
              <svg className="h-3 w-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen ? (
              <>
                <button
                  type="button"
                  aria-label="Close status menu"
                  className="fixed inset-0 z-10 cursor-default bg-black/0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpen(false);
                  }}
                />
                <div className="absolute right-0 z-20 mt-1.5 w-36 rounded-lg border border-border bg-surface-strong p-1 shadow-[var(--shadow-soft)]">
                  {nextLifecycleStatus ? (
                    <button
                      type="button"
                      disabled={updateStatus.isPending}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusToggle(nextLifecycleStatus);
                      }}
                      className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-[9px] font-bold uppercase tracking-wider text-white hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${nextLifecycleStatus === 'ACTIVE' ? 'bg-positive' : 'bg-warning'}`} />
                      {updateStatus.isPending ? 'Updating...' : lifecycleLabel}
                    </button>
                  ) : (
                    <div className="px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                      No status action
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>

        {bot.description ? (
          <p className="line-clamp-2 text-xs leading-relaxed text-slate-400 font-sans">{bot.description}</p>
        ) : null}

        <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-surface px-3 py-2 font-mono">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 font-sans">Performance (24h)</p>
            <p className={`mt-1 text-xs font-bold ${isPositive ? 'text-positive' : 'text-negative'}`}>
              {isPositive ? '+' : ''}{pnlPct.toFixed(2)}%
            </p>
          </div>
          <svg className="h-9 w-28 shrink-0 overflow-visible" viewBox="0 0 120 36">
            <defs>
              <linearGradient id={`sparkline-grad-${bot.botId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity="0.15" />
                <stop offset="100%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={areaPath}
              fill={`url(#sparkline-grad-${bot.botId})`}
            />
            <path
              d={linePath}
              fill="none"
              stroke={isPositive ? '#22c55e' : '#ef4444'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-3 text-left">
          <div className="rounded-lg border border-border bg-surface px-3 py-2.5">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 font-sans">Venue</p>
            <p className="mt-1 text-xs font-bold text-white uppercase">{bot.exchange ?? 'N/A'}</p>
          </div>
          <div className="rounded-lg border border-border bg-surface px-3 py-2.5">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 font-sans">Pair</p>
            <p className="mt-1 text-xs font-bold text-white font-mono">{bot.tradingPair ?? 'N/A'}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3 py-2.5">
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 font-sans">API key</p>
            <p className="mt-1 truncate font-mono text-[11px] text-white" title={apiKey}>
              {apiKey.length > 22 ? `${apiKey.slice(0, 10)}...${apiKey.slice(-10)}` : apiKey}
            </p>
          </div>
          <CopyButton value={apiKey} className="h-7 w-7 shrink-0 text-slate-400 hover:text-white" />
        </div>

        {statusError ? (
          <p className="rounded border border-negative/20 bg-negative/5 px-2.5 py-1.5 text-[11px] font-semibold text-negative">
            {statusError}
          </p>
        ) : null}
      </div>

      <div className="mt-5 pt-4 border-t border-border/60">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
            {localStatus}
          </div>

          <button
            type="button"
            onClick={() => onSelect?.(bot.botId)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white/5 hover:bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white transition-colors cursor-pointer font-sans uppercase tracking-wider"
          >
            Console
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
