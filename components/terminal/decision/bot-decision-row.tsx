'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { BotDecisionCard, DecisionReason } from '@/lib/contracts/types';
import { StatusDot } from '@/components/shared/status-dot';
import { RiskBar } from '@/components/shared/risk-bar';

interface BotDecisionRowProps {
  card: BotDecisionCard;
  isBusy: boolean;
  isKept: boolean;
  onKeep: (botId: string) => void;
  onUnsubscribe: (botId: string) => void;
}

const reasonStyles: Record<DecisionReason, { border: string; label: string; text: string; bg: string }> = {
  [DecisionReason.SOLID_PERFORMER]: {
    border: 'border-l-[3px] border-l-[#10b981]',
    label: 'Solid',
    text: 'text-positive',
    bg: 'bg-positive/5',
  },
  [DecisionReason.NEEDS_REVIEW]: {
    border: 'border-l-[3px] border-l-[#f59e0b]',
    label: 'Review',
    text: 'text-warning',
    bg: 'bg-warning/5',
  },
  [DecisionReason.HIGH_RISK]: {
    border: 'border-l-[3px] border-l-[#f43f5e]',
    label: 'High Risk',
    text: 'text-negative',
    bg: 'bg-negative/5',
  },
  [DecisionReason.SLIPPING]: {
    border: 'border-l-[3px] border-l-[#f59e0b]/70',
    label: 'Slipping',
    text: 'text-warning/80',
    bg: 'bg-warning/3',
  },
};

export function BotDecisionRow({
  card,
  isBusy,
  isKept,
  onKeep,
  onUnsubscribe,
}: BotDecisionRowProps) {
  const [isPending, setIsPending] = useState(false);
  const style = reasonStyles[card.reason];

  const handleKeep = async () => {
    setIsPending(true);
    try {
      await onKeep(card.botId);
    } finally {
      setIsPending(false);
    }
  };

  const pnlColor = card.currentPnL >= 0 ? 'text-positive' : 'text-negative';
  const drawdownColor = card.drawdownPercent < -0.1 ? 'text-negative' : 'text-warning';
  const signalSuccess = card.signalCount24h > 0
    ? Math.round((card.successfulSignals24h / card.signalCount24h) * 100)
    : 0;

  const actionDisabled = isBusy || isPending;

  return (
    <div
      className={`flex flex-col gap-4 border border-white/5 bg-[#0b0e14] p-4 transition-colors hover:bg-white/[0.01] sm:flex-row sm:items-center sm:justify-between ${style.border}`}
    >
      {/* Col 1: Bot details & status */}
      <div className="flex items-center gap-3 sm:w-1/4 sm:min-w-[180px]">
        {card.botIcon ? (
          <Image
            src={card.botIcon}
            alt={card.botName}
            width={28}
            height={28}
            unoptimized
            className="h-7 w-7 rounded border border-white/10 object-cover"
          />
        ) : (
          <div className="h-7 w-7 rounded border border-white/10 bg-white/[0.02]" />
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-semibold text-white">
              {card.botName}
            </span>
            <StatusDot
              status={card.status === 'ACTIVE' ? 'active' : 'inactive'}
              size="sm"
            />
          </div>
          <span className="font-mono text-[10px] text-muted">{card.exchange}</span>
        </div>
      </div>

      {/* Col 2: Risk indicator and reason explanation */}
      <div className="flex flex-col gap-1.5 sm:w-1/3">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${style.bg} ${style.text}`}>
            {style.label}
          </span>
          <span className="text-xs text-muted font-mono">
            Risk: {(card.riskScore * 100).toFixed(0)}%
          </span>
          <div className="w-16">
            <RiskBar value={card.riskScore} max={1} />
          </div>
        </div>
        <p className="line-clamp-2 text-xs text-muted leading-normal">
          {card.reasonExplanation}
        </p>
      </div>

      {/* Col 3: Technical Metrics (Win Rate / Drawdown) */}
      <div className="grid grid-cols-3 gap-2 sm:w-1/5 sm:min-w-[150px]">
        <div>
          <span className="block text-[9px] uppercase tracking-wider text-muted/60">Win rate</span>
          <span className="font-mono text-xs font-semibold text-white">
            {(card.winRate * 100).toFixed(0)}%
          </span>
        </div>
        <div>
          <span className="block text-[9px] uppercase tracking-wider text-muted/60">Max DD</span>
          <span className={`font-mono text-xs font-semibold ${drawdownColor}`}>
            {(card.drawdownPercent * 100).toFixed(1)}%
          </span>
        </div>
        <div>
          <span className="block text-[9px] uppercase tracking-wider text-muted/60">Signals</span>
          <span className="font-mono text-xs text-white">
            {card.successfulSignals24h}/{card.signalCount24h}
          </span>
        </div>
      </div>

      {/* Col 4: PnL and floating delta */}
      <div className="flex flex-row gap-4 sm:w-1/6 sm:flex-col sm:gap-0 sm:text-right">
        <div>
          <span className="inline-block text-[9px] uppercase tracking-wider text-muted/60 sm:hidden">PnL: </span>
          <span className={`font-mono text-sm font-semibold ${pnlColor}`}>
            {card.currentPnL >= 0 ? '+' : ''}${card.currentPnL.toFixed(2)}
          </span>
        </div>
        <div>
          <span className="inline-block text-[9px] uppercase tracking-wider text-muted/60 sm:hidden">Return: </span>
          <span className={`font-mono text-[10px] ${pnlColor}`}>
            {(card.pnlPercent * 100).toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Col 5: Actions */}
      <div className="flex items-center gap-2 border-t border-white/5 pt-3 sm:border-t-0 sm:pt-0">
        <button
          onClick={handleKeep}
          disabled={actionDisabled}
          className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors border ${
            isKept
              ? 'border-positive/20 bg-positive/5 text-positive hover:bg-positive/10'
              : 'border-white/10 bg-white/[0.02] text-white hover:bg-white/[0.06]'
          } disabled:opacity-50`}
        >
          {isKept ? 'Kept' : 'Keep'}
        </button>
        <Link
          href={`/terminal/marketplace/${card.botId}`}
          className="px-3 py-1.5 text-xs font-semibold rounded border border-white/10 bg-white/[0.02] text-white hover:bg-white/[0.06] text-center"
        >
          Review
        </Link>
        <button
          onClick={() => onUnsubscribe(card.botId)}
          disabled={actionDisabled}
          className="px-3 py-1.5 text-xs font-semibold rounded border border-negative/20 bg-negative/5 text-negative hover:bg-negative/10 disabled:opacity-50"
        >
          Unsubscribe
        </button>
      </div>
    </div>
  );
}
