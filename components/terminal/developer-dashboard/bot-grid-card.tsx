'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { updateBotStatus } from '@/lib/contracts/client';
import { CopyButton } from './copy-button';
import { DeveloperBotSummary, DeveloperBotStatus } from '@/lib/contracts/types';

const statusStyles: Record<DeveloperBotStatus, { badge: string; dot: string; label: string }> = {
  ACTIVE: {
    badge: 'bg-positive-soft text-positive',
    dot: 'bg-positive',
    label: 'Active',
  },
  PAUSED: {
    badge: 'bg-warning-soft text-warning',
    dot: 'bg-warning',
    label: 'Paused',
  },
  DOWN: {
    badge: 'bg-negative-soft text-negative',
    dot: 'bg-negative',
    label: 'Down',
  },
  DELETED: {
    badge: 'bg-surface text-fg-muted',
    dot: 'bg-fg-muted',
    label: 'Deleted',
  },
};

interface BotGridCardProps {
  bot: DeveloperBotSummary;
  onStatusChange?: (botId: string, newStatus: DeveloperBotStatus) => void;
}

export function BotGridCard({ bot, onStatusChange }: BotGridCardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [localStatus, setLocalStatus] = useState<DeveloperBotStatus>(bot.status);

  useEffect(() => {
    setLocalStatus(bot.status);
    setStatusError(null);
  }, [bot.botId, bot.status]);

  const statusMutation = useMutation({
    mutationFn: async (nextStatus: DeveloperBotStatus) => updateBotStatus(bot.botId, nextStatus),
    onSuccess: (updated) => {
      const newStatus = updated.status ?? localStatus;
      setLocalStatus(newStatus);
      setIsDropdownOpen(false);
      setStatusError(null);
      onStatusChange?.(bot.botId, newStatus);
    },
    onError: (error) => {
      setStatusError(error instanceof Error ? error.message : 'Unable to update bot status.');
    },
  });

  const style = statusStyles[localStatus] ?? statusStyles.DELETED;
  const apiKey = bot.apiKey ?? 'Not available';
  const nextLifecycleStatus: DeveloperBotStatus | null =
    localStatus === 'ACTIVE' ? 'PAUSED' : localStatus === 'PAUSED' || localStatus === 'DOWN' ? 'ACTIVE' : null;
  const lifecycleLabel = nextLifecycleStatus === 'PAUSED' ? 'Stop bot' : nextLifecycleStatus === 'ACTIVE' ? 'Resume bot' : 'Status locked';

  const handleStatusToggle = (nextStatus: DeveloperBotStatus) => {
    statusMutation.mutate(nextStatus);
  };

  return (
    <article className="glass-strong group relative h-full rounded-2xl border border-[var(--panel-border)] shadow-[var(--shadow-soft)] transition-colors duration-200 hover:border-[var(--primary-soft)]">
      <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-[var(--primary-soft)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex h-full flex-col p-5">
        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-2">
              <h3 className="truncate text-base font-semibold text-fg">{bot.botName}</h3>
              <p className="font-mono text-xs text-fg-muted">{bot.botId}</p>
            </div>

            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setIsDropdownOpen((current) => !current)}
                className={`inline-flex items-center gap-1.5 rounded-full border border-[var(--panel-border)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${style.badge}`}
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
                    className="fixed inset-0 z-10 cursor-default bg-[var(--bg-0)] opacity-0"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute right-0 z-20 mt-2 w-40 rounded-xl border border-[var(--panel-border)] bg-surface p-1 shadow-[var(--shadow-soft)]">
                    {nextLifecycleStatus ? (
                      <button
                        type="button"
                        disabled={statusMutation.isPending}
                        onClick={() => handleStatusToggle(nextLifecycleStatus)}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-fg transition-colors hover:bg-surface-strong disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${nextLifecycleStatus === 'ACTIVE' ? 'bg-positive' : 'bg-warning'}`} />
                        {statusMutation.isPending ? 'Updating...' : lifecycleLabel}
                      </button>
                    ) : (
                      <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-muted">
                        No status action
                      </div>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {bot.description ? <p className="line-clamp-2 text-sm leading-relaxed text-fg-muted">{bot.description}</p> : null}

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[var(--panel-border)] bg-surface px-3 py-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">Venue</p>
              <p className="mt-2 text-sm font-semibold text-fg">{bot.exchange ?? 'N/A'}</p>
            </div>
            <div className="rounded-xl border border-[var(--panel-border)] bg-surface px-3 py-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">Pair</p>
              <p className="mt-2 font-mono text-sm font-semibold text-fg">{bot.tradingPair ?? 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--panel-border)] bg-surface px-3 py-3">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">API key</p>
              <p className="mt-1 truncate font-mono text-xs text-fg" title={apiKey}>
                {apiKey.length > 22 ? `${apiKey.slice(0, 10)}...${apiKey.slice(-10)}` : apiKey}
              </p>
            </div>
            <CopyButton value={apiKey} className="h-8 w-8 shrink-0" />
          </div>

          {statusError ? (
            <p className="rounded-lg border border-[var(--panel-border)] bg-negative-soft px-3 py-2 text-xs font-semibold text-negative">
              {statusError}
            </p>
          ) : null}
        </div>

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between gap-3 border-t border-[var(--panel-border)] pt-4">
            <div className="flex items-center gap-2 text-xs text-fg-muted">
              <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
              {localStatus}
            </div>

            <Link
              href={`/terminal/developer-dashboard?botId=${bot.botId}`}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--panel-border)] bg-positive-soft px-4 py-2 text-sm font-semibold text-positive transition-colors hover:brightness-105"
            >
              Inspect console
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
