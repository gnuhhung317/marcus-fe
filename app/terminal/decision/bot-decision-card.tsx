'use client';

import { BotDecisionCard, DecisionReason } from '@/lib/contracts/types';

interface BotCardProps {
  card: BotDecisionCard;
  onKeep?: (subscriptionId: string) => void;
  onReview?: (subscriptionId: string) => void;
  onUnsubscribe?: (subscriptionId: string) => void;
}

/**
 * Single bot decision card with reason tag, metrics, and quick actions.
 */
export function BotDecisionCardComponent({ card, onKeep, onReview, onUnsubscribe }: BotCardProps) {
  // Color scheme based on decision reason
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
  const pnlColor = card.currentPnL >= 0 ? 'text-emerald-400' : 'text-rose-400';
  const drawdownBadgeColor = card.drawdownPercent < -0.1 ? 'text-rose-400' : 'text-amber-400';

  return (
    <div
      className={`${colors.bg} border ${colors.border} rounded-2xl p-5 hover:border-slate-500/50 hover:bg-white/[0.01] transition-all duration-300 shadow-md backdrop-blur-md flex flex-col justify-between`}
    >
      <div>
        {/* Header: Bot name + icon */}
        <div className="flex items-start justify-between mb-5 gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1.5">
              {card.botIcon && (
                <img src={card.botIcon} alt={card.botName} className="w-8 h-8 rounded-lg object-cover border border-[rgba(255,255,255,0.06)]" />
              )}
              <h3 className="text-base font-bold text-white tracking-tight">{card.botName}</h3>
            </div>
            <p className="text-xs text-slate-500 font-mono font-medium">{card.exchange}</p>
          </div>

          {/* Reason tag */}
          <div className={`${colors.text} text-[9px] font-bold px-2.5 py-1 rounded-lg bg-white/[0.04] border border-[rgba(255,255,255,0.06)] uppercase tracking-wider font-mono`}>
            {card.reason.replace('_', ' ')}
          </div>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-[rgba(255,255,255,0.06)] font-mono">
          {/* Current P&L */}
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-semibold">Current P&L</p>
            <p className={`${pnlColor} text-sm font-bold`}>
              {card.currentPnL >= 0 ? '+' : ''}${card.currentPnL.toFixed(2)}
            </p>
            <p className="text-[11px] text-slate-400 font-medium">{(card.pnlPercent * 100).toFixed(2)}%</p>
          </div>

          {/* Drawdown */}
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-semibold">Drawdown</p>
            <p className={`${drawdownBadgeColor} text-sm font-bold`}>
              {(card.drawdownPercent * 100).toFixed(1)}%
            </p>
            <p className="text-[11px] text-slate-500 font-medium">7-day max</p>
          </div>

          {/* Win Rate */}
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-semibold">Win Rate</p>
            <p className="text-emerald-400 text-sm font-bold">{(card.winRate * 100).toFixed(1)}%</p>
            <p className="text-[11px] text-slate-500 font-medium">24h avg</p>
          </div>
        </div>

        {/* Reason explanation */}
        <div className="mb-4">
          <p className={`text-xs ${colors.text} font-medium leading-relaxed`}>{card.reasonExplanation}</p>
        </div>

        {/* Signal stats */}
        <div className="text-[11px] text-slate-500 mb-5 leading-relaxed">
          <p className="font-medium">
            Signal Success: <span className="text-slate-300 font-semibold">{card.successfulSignals24h}</span> / <span className="text-slate-300">{card.signalCount24h}</span> signals (
            {card.signalCount24h > 0 ? ((card.successfulSignals24h / card.signalCount24h) * 100).toFixed(0) : 0}%)
          </p>
          {card.lastSignal && (
            <p className="text-[10px] mt-0.5 font-mono">Last signal: {new Date(card.lastSignal).toLocaleTimeString()}</p>
          )}
        </div>
      </div>

      {/* Quick action buttons */}
      <div className="flex gap-2.5 pt-4 border-t border-[rgba(255,255,255,0.06)]">
        <button
          onClick={() => onKeep?.(card.subscriptionId)}
          className="flex-1 px-3 py-2 text-[11px] font-semibold text-white bg-white/[0.04] hover:bg-white/[0.08] rounded-xl border border-[rgba(255,255,255,0.08)] transition-all duration-200 active:scale-95"
        >
          Keep Subscribed
        </button>
        <button
          onClick={() => onReview?.(card.subscriptionId)}
          className="flex-1 px-3 py-2 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/15 rounded-xl border border-emerald-500/20 transition-all duration-200 active:scale-95"
        >
          Review
        </button>
        <button
          onClick={() => onUnsubscribe?.(card.subscriptionId)}
          className="flex-1 px-3 py-2 text-[11px] font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/15 rounded-xl border border-rose-500/20 transition-all duration-200 active:scale-95"
        >
          Unsubscribe
        </button>
      </div>
    </div>
  );
}
