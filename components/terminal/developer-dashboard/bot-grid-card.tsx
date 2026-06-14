'use client';

import { ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CopyButton } from './copy-button';
import { useBotStatus } from '@/lib/hooks/use-bot-status';
import { DeveloperBotSummary, DeveloperBotStatus } from '@/lib/contracts/types';

interface BotGridCardProps {
  bot: DeveloperBotSummary;
  onStatusChange?: (botId: string, newStatus: DeveloperBotStatus) => void;
  onSelect?: (botId: string) => void;
}

export function BotGridCard({ bot, onStatusChange, onSelect }: BotGridCardProps) {
  const {
    isDropdownOpen,
    setIsDropdownOpen,
    statusError,
    statusStyle,
    localStatus,
    apiKey,
    nextLifecycleStatus,
    lifecycleLabel,
    updatePending,
    handleStatusToggle,
    pnlPct,
    isPositive,
    linePath,
    areaPath,
  } = useBotStatus(bot, onStatusChange);

  return (
    <article className="group relative flex h-full flex-col rounded-xl border border-border bg-surface/50 p-6 font-mono shadow-[var(--shadow-soft)] transition-all duration-200 hover:border-border-line hover:bg-surface">
      <div className="flex-1 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1 font-sans">
            <h3 className="truncate text-base font-bold uppercase tracking-tight text-main">{bot.botName}</h3>
            <p className="truncate font-mono text-[10px] text-muted/60">{bot.botId}</p>
          </div>

          <div className="relative shrink-0 font-sans">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen((current) => !current);
              }}
              className="h-7 gap-2 px-2.5 text-[10px] uppercase tracking-wider bg-surface-strong border-border/50"
              aria-expanded={isDropdownOpen}
              aria-haspopup="menu"
            >
              <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
              {statusStyle.label}
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>

            {isDropdownOpen ? (
              <>
                <button
                  type="button"
                  aria-label="Close status menu"
                  className="fixed inset-0 z-10 cursor-default bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpen(false);
                  }}
                />
                <div className="absolute right-0 z-20 mt-1.5 w-40 rounded-lg border border-border bg-surface-strong p-1 shadow-xl">
                  {nextLifecycleStatus ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={updatePending}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusToggle(nextLifecycleStatus);
                      }}
                      className="h-9 w-full justify-start gap-2.5 px-2.5 text-[10px] font-bold uppercase tracking-wider text-main hover:bg-surface"
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${nextLifecycleStatus === 'ACTIVE' ? 'bg-positive' : 'bg-warning'}`} />
                      {updatePending ? 'Updating...' : lifecycleLabel}
                    </Button>
                  ) : (
                    <div className="px-2.5 py-2 text-[10px] font-bold uppercase tracking-wider text-muted">
                      No status action
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>

        {bot.description ? <p className="line-clamp-2 text-xs leading-relaxed text-muted/80 font-sans">{bot.description}</p> : null}

        <div className="flex items-center justify-between gap-4 py-1">
          <div className="space-y-1">
            <p className="text-[9px] font-bold uppercase tracking-wider text-muted/50">Performance</p>
            <p className={`text-sm font-bold ${isPositive ? 'text-positive' : 'text-negative'}`}>
              {isPositive ? '+' : ''}
              {pnlPct.toFixed(2)}%
            </p>
          </div>
          <svg className="h-10 w-32 shrink-0 overflow-visible" viewBox="0 0 120 36" aria-hidden="true">
            <defs>
              <linearGradient id={`sparkline-grad-${bot.botId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isPositive ? 'hsl(var(--semantic-positive))' : 'hsl(var(--semantic-negative))'} stopOpacity="0.15" />
                <stop offset="100%" stopColor={isPositive ? 'hsl(var(--semantic-positive))' : 'hsl(var(--semantic-negative))'} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill={`url(#sparkline-grad-${bot.botId})`} />
            <path
              d={linePath}
              fill="none"
              stroke={isPositive ? 'hsl(var(--semantic-positive))' : 'hsl(var(--semantic-negative))'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="flex flex-col gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-main">
            <span className="px-1.5 py-0.5 rounded bg-surface-strong border border-border/40 text-[10px]">{bot.exchange ?? 'N/A'}</span>
            <span className="text-muted/40 font-normal">/</span>
            <span className="tracking-tight">{bot.tradingPair ?? 'N/A'}</span>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border/30 pt-4">
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-wider text-muted/50">Runtime Key</p>
              <p className="mt-1 truncate font-mono text-[11px] text-main/80" title={apiKey}>
                {apiKey.length > 22 ? `${apiKey.slice(0, 10)}...${apiKey.slice(-10)}` : apiKey}
              </p>
            </div>
            <CopyButton value={apiKey} className="h-7 w-7 shrink-0 text-muted/50 hover:text-main" />
          </div>
        </div>

        {statusError ? <Badge variant="error" className="w-full justify-start rounded-lg px-2.5 py-1.5 text-[11px]">{statusError}</Badge> : null}
      </div>

      <div className="mt-6 border-t border-border/30 pt-4">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="outline" className="rounded-lg px-2.5 py-1 text-[10px] uppercase tracking-wider">
            <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
            {localStatus}
          </Badge>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onSelect?.(bot.botId)}
            className="h-8 gap-1.5 px-3 text-xs font-bold uppercase tracking-wider"
          >
            Console
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </article>
  );
}
