'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { BotDecisionCard, DecisionReason } from '@/lib/contracts/types';

interface BotCardProps {
  card: BotDecisionCard;
  onKeep?: (botId: string) => Promise<void> | void;
  onUnsubscribe?: (botId: string) => Promise<void> | void;
  isBusy?: boolean;
  isKept?: boolean;
}

const reasonTone: Record<DecisionReason, { badge: string; label: string; text: string }> = {
  [DecisionReason.SOLID_PERFORMER]: {
    badge: 'bg-positive-soft text-positive',
    label: 'Solid performer',
    text: 'text-positive',
  },
  [DecisionReason.NEEDS_REVIEW]: {
    badge: 'bg-warning-soft text-warning',
    label: 'Needs review',
    text: 'text-warning',
  },
  [DecisionReason.HIGH_RISK]: {
    badge: 'bg-negative-soft text-negative',
    label: 'High risk',
    text: 'text-negative',
  },
  [DecisionReason.SLIPPING]: {
    badge: 'bg-warning-soft text-warning',
    label: 'Slipping',
    text: 'text-warning',
  },
};

export function BotDecisionCardComponent({ card, onKeep, onUnsubscribe, isBusy = false, isKept = false }: BotCardProps) {
  const [isLocalPending, setIsLocalPending] = useState(false);
  const tone = reasonTone[card.reason];
  const pnlColor = card.currentPnL >= 0 ? 'text-positive' : 'text-negative';
  const drawdownColor = card.drawdownPercent < -0.1 ? 'text-negative' : 'text-warning';
  const signalSuccess = card.signalCount24h > 0 ? Math.round((card.successfulSignals24h / card.signalCount24h) * 100) : 0;
  const actionDisabled = isBusy || isLocalPending;

  const handleKeep = async () => {
    if (!onKeep) return;
    setIsLocalPending(true);
    try {
      await onKeep(card.botId);
    } finally {
      setIsLocalPending(false);
    }
  };

  return (
    <article className="glass-strong h-full rounded-2xl border border-[var(--panel-border)] shadow-[var(--shadow-soft)]">
      <div className="flex h-full flex-col p-5">
        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-2">
              <div className="flex items-center gap-3">
                {card.botIcon ? (
                  <Image
                    src={card.botIcon}
                    alt={card.botName}
                    width={32}
                    height={32}
                    unoptimized
                    className="h-8 w-8 rounded-lg border border-[var(--panel-border)] object-cover"
                  />
                ) : null}
                <h3 className="truncate text-base font-semibold text-fg">{card.botName}</h3>
              </div>
              <p className="font-mono text-xs text-fg-muted">{card.exchange}</p>
            </div>

            <span className={`rounded-full border border-[var(--panel-border)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${tone.badge}`}>
              {tone.label}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-xl border border-[var(--panel-border)] bg-surface px-3 py-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">PnL</p>
              <p className={`mt-2 font-mono text-lg font-semibold ${pnlColor}`}>
                {card.currentPnL >= 0 ? '+' : ''}
                ${card.currentPnL.toFixed(2)}
              </p>
              <p className="mt-1 text-[11px] text-fg-muted">{(card.pnlPercent * 100).toFixed(2)}%</p>
            </div>

            <div className="rounded-xl border border-[var(--panel-border)] bg-surface px-3 py-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">Drawdown</p>
              <p className={`mt-2 font-mono text-lg font-semibold ${drawdownColor}`}>{(card.drawdownPercent * 100).toFixed(1)}%</p>
              <p className="mt-1 text-[11px] text-fg-muted">7-day max</p>
            </div>

            <div className="rounded-xl border border-[var(--panel-border)] bg-surface px-3 py-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">Win rate</p>
              <p className="mt-2 font-mono text-lg font-semibold text-positive">{(card.winRate * 100).toFixed(1)}%</p>
              <p className="mt-1 text-[11px] text-fg-muted">24h average</p>
            </div>

            <div className="rounded-xl border border-[var(--panel-border)] bg-surface px-3 py-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">Signals</p>
              <p className="mt-2 font-mono text-lg font-semibold text-fg">
                {card.successfulSignals24h}/{card.signalCount24h}
              </p>
              <p className="mt-1 text-[11px] text-fg-muted">{signalSuccess}% success</p>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--panel-border)] bg-surface px-4 py-4">
            <p className={`line-clamp-3 text-sm leading-relaxed ${tone.text}`}>{card.reasonExplanation}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-[var(--panel-border)] bg-surface px-2.5 py-1 text-[11px] font-semibold text-fg-muted">
              {card.status}
            </span>
            <span className="rounded-full border border-[var(--panel-border)] bg-surface px-2.5 py-1 text-[11px] font-semibold text-fg-muted">
              Day {card.subscribedSinceDay}
            </span>
            <span className={`rounded-full border border-[var(--panel-border)] px-2.5 py-1 text-[11px] font-semibold ${card.daysAtRisk > 0 ? 'bg-warning-soft text-warning' : 'bg-positive-soft text-positive'}`}>
              {card.daysAtRisk > 0 ? `${card.daysAtRisk} at risk` : 'Stable'}
            </span>
          </div>

          <p className="text-[11px] text-fg-muted">
            Last signal:{' '}
            <span className="font-mono text-fg">
              {card.lastSignal ? new Date(card.lastSignal).toLocaleTimeString() : 'No recent signal'}
            </span>
            {isKept ? <span className="ml-2 text-positive">Kept in portfolio</span> : null}
          </p>
        </div>

        <div className="mt-auto flex gap-2 border-t border-[var(--panel-border)] pt-4">
          <button
            type="button"
            onClick={handleKeep}
            disabled={actionDisabled || !onKeep}
            className="flex-1 rounded-xl border border-[var(--panel-border)] bg-surface px-3 py-2 text-sm font-semibold text-fg transition-colors hover:bg-surface-strong disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Keep ${card.botName} active`}
          >
            {actionDisabled ? 'Saving...' : 'Keep'}
          </button>

          <Link
            href={`/terminal/marketplace/${card.botId}`}
            className="flex-1 rounded-xl border border-[var(--panel-border)] bg-positive-soft px-3 py-2 text-center text-sm font-semibold text-positive transition-colors hover:brightness-105"
            aria-label={`Review ${card.botName}`}
          >
            Review
          </Link>

          <button
            type="button"
            onClick={() => onUnsubscribe?.(card.botId)}
            disabled={actionDisabled || !onUnsubscribe}
            className="flex-1 rounded-xl border border-[var(--panel-border)] bg-negative-soft px-3 py-2 text-sm font-semibold text-negative transition-colors hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Unsubscribe from ${card.botName}`}
          >
            Unsubscribe
          </button>
        </div>
      </div>
    </article>
  );
}
