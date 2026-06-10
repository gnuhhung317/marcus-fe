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

/**
 * Single bot decision card with reason tag, metrics, and quick actions.
 */
export function BotDecisionCardComponent({ card, onKeep, onUnsubscribe, isBusy = false, isKept = false }: BotCardProps) {
  const [isLocalPending, setIsLocalPending] = useState(false);

  const reasonColors: Record<DecisionReason, { bg: string; text: string; border: string }> = {
    [DecisionReason.SOLID_PERFORMER]: {
      bg: 'bg-emerald-500/[0.02]',
      text: 'text-emerald-400',
      border: 'border-emerald-500/20',
    },
    [DecisionReason.NEEDS_REVIEW]: {
      bg: 'bg-amber-500/[0.02]',
      text: 'text-amber-400',
      border: 'border-amber-500/20',
    },
    [DecisionReason.HIGH_RISK]: {
      bg: 'bg-rose-500/[0.02]',
      text: 'text-rose-400',
      border: 'border-rose-500/20',
    },
    [DecisionReason.SLIPPING]: {
      bg: 'bg-orange-500/[0.02]',
      text: 'text-orange-400',
      border: 'border-orange-500/20',
    },
  };

  const colors = reasonColors[card.reason];
  const pnlColor = card.currentPnL >= 0 ? 'text-positive' : 'text-negative';
  const drawdownBadgeColor = card.drawdownPercent < -0.1 ? 'text-negative' : 'text-warning';
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
    <div className={`${colors.bg} flex flex-col justify-between rounded-2xl border ${colors.border} p-5 shadow-[var(--shadow-soft)] backdrop-blur-md transition-colors duration-200`}>
      <div>
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="mb-1.5 flex items-center gap-3">
              {card.botIcon ? (
                <Image
                  src={card.botIcon}
                  alt={card.botName}
                  width={32}
                  height={32}
                  unoptimized
                  className="h-8 w-8 rounded-lg border border-[rgba(255,255,255,0.06)] object-cover"
                />
              ) : null}
              <h3 className="text-base font-bold tracking-tight text-white">{card.botName}</h3>
            </div>
            <p className="font-mono text-xs font-medium text-muted">{card.exchange}</p>
          </div>

          <div className={`${colors.text} rounded-lg border border-[rgba(255,255,255,0.06)] bg-white/[0.04] px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider`}>
            {card.reason.replace('_', ' ')}
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 border-b border-[rgba(255,255,255,0.06)] pb-4 font-mono md:grid-cols-4">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted">Current P&amp;L</p>
            <p className={`text-sm font-bold ${pnlColor}`}>{card.currentPnL >= 0 ? '+' : ''}${card.currentPnL.toFixed(2)}</p>
            <p className="text-[11px] font-medium text-muted">{(card.pnlPercent * 100).toFixed(2)}%</p>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted">Drawdown</p>
            <p className={`text-sm font-bold ${drawdownBadgeColor}`}>{(card.drawdownPercent * 100).toFixed(1)}%</p>
            <p className="text-[11px] font-medium text-muted">7-day max</p>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted">Win Rate</p>
            <p className="text-sm font-bold text-positive">{(card.winRate * 100).toFixed(1)}%</p>
            <p className="text-[11px] font-medium text-muted">24h avg</p>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted">Signals</p>
            <p className="text-sm font-bold text-white">{card.successfulSignals24h}/{card.signalCount24h}</p>
            <p className="text-[11px] font-medium text-muted">{signalSuccess}% success</p>
          </div>
        </div>

        <div className="mb-4">
          <p className={`text-sm font-medium leading-relaxed ${colors.text}`}>{card.reasonExplanation}</p>
        </div>

        <div className="mb-5 space-y-1 text-[11px] leading-relaxed text-muted">
          <p>
            Last signal:{' '}
            <span className="font-mono text-white">
              {card.lastSignal ? new Date(card.lastSignal).toLocaleTimeString() : 'No recent signal'}
            </span>
          </p>
          {isKept ? <p className="text-positive">Kept in portfolio</p> : null}
        </div>
      </div>

      <div className="flex gap-2.5 border-t border-[rgba(255,255,255,0.06)] pt-4">
        <button
          type="button"
          onClick={handleKeep}
          disabled={actionDisabled || !onKeep}
          className="flex-1 rounded-xl border border-[rgba(255,255,255,0.08)] bg-white/[0.04] px-3 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={`Keep ${card.botName} active`}
        >
          {actionDisabled ? 'Saving...' : 'Keep'}
        </button>

        <Link
          href={`/terminal/marketplace/${card.botId}`}
          className="flex-1 rounded-xl border border-[rgba(0,190,115,0.24)] bg-[rgba(0,190,115,0.08)] px-3 py-2 text-center text-[11px] font-semibold text-positive transition-colors hover:bg-[rgba(0,190,115,0.12)]"
          aria-label={`Review ${card.botName}`}
        >
          Review
        </Link>

        <button
          type="button"
          onClick={() => onUnsubscribe?.(card.botId)}
          disabled={actionDisabled || !onUnsubscribe}
          className="flex-1 rounded-xl border border-[rgba(244,63,94,0.2)] bg-[rgba(244,63,94,0.1)] px-3 py-2 text-[11px] font-semibold text-negative transition-colors hover:bg-[rgba(244,63,94,0.15)] disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={`Unsubscribe from ${card.botName}`}
        >
          Unsubscribe
        </button>
      </div>
    </div>
  );
}
