'use client';

import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { BotDecisionCard, DecisionReason } from '@/lib/contracts/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatusDot } from '@/components/shared/status-dot';
import { RiskBar } from '@/components/shared/risk-bar';

interface BotDecisionRowProps {
  card: BotDecisionCard;
  isBusy: boolean;
  onUnsubscribe: (card: BotDecisionCard) => void;
}

const reasonStyles: Record<DecisionReason, { border: string; labelKey: string; badge: 'success' | 'warning' | 'error' }> = {
  [DecisionReason.SOLID_PERFORMER]: {
    border: 'border-l-4 border-l-positive',
    labelKey: 'solid',
    badge: 'success',
  },
  [DecisionReason.NEEDS_REVIEW]: {
    border: 'border-l-4 border-l-warning',
    labelKey: 'review',
    badge: 'warning',
  },
  [DecisionReason.HIGH_RISK]: {
    border: 'border-l-4 border-l-negative',
    labelKey: 'highRisk',
    badge: 'error',
  },
  [DecisionReason.SLIPPING]: {
    border: 'border-l-4 border-l-warning/70',
    labelKey: 'slipping',
    badge: 'warning',
  },
};

export const BotDecisionRow = memo(function BotDecisionRow({
  card,
  isBusy,
  onUnsubscribe,
}: BotDecisionRowProps) {
  const t = useTranslations('Decision.row');
  const style = reasonStyles[card.reason];

  const pnlColor = card.currentPnL >= 0 ? 'text-positive' : 'text-negative';
  const drawdownColor = card.drawdownPercent < -0.1 ? 'text-negative' : 'text-warning';
  const actionDisabled = isBusy;

  return (
    <Card
      className={`flex flex-col gap-4 p-4 transition-colors hover:border-border-line sm:flex-row sm:items-center sm:justify-between ${style.border}`}
    >
      <div className="flex items-center gap-3 sm:w-1/4 sm:min-w-[180px]">
        {card.botIcon ? (
          <Image
            src={card.botIcon}
            alt={card.botName}
            width={28}
            height={28}
            unoptimized
            className="h-7 w-7 rounded border border-border object-cover"
          />
        ) : (
          <div className="h-7 w-7 rounded border border-border bg-surface" />
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-semibold text-main">
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

      <div className="flex flex-col gap-1.5 sm:w-1/3">
        <div className="flex items-center gap-2">
          <Badge variant={style.badge}>{t(style.labelKey)}</Badge>
          <span className="text-xs font-mono text-muted">
            {t('risk', { value: (card.riskScore * 100).toFixed(0) })}
          </span>
          <div className="w-16">
            <RiskBar value={card.riskScore} max={1} />
          </div>
        </div>
        <p className="line-clamp-2 text-xs leading-normal text-muted">
          {card.reasonExplanation}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:w-1/5 sm:min-w-[150px]">
        <div>
          <span className="block text-[9px] uppercase tracking-wider text-muted/60">{t('winRate')}</span>
          <span className="font-mono text-xs font-semibold text-main">
            {(card.winRate * 100).toFixed(0)}%
          </span>
        </div>
        <div>
          <span className="block text-[9px] uppercase tracking-wider text-muted/60">{t('maxDd')}</span>
          <span className={`font-mono text-xs font-semibold ${drawdownColor}`}>
            {(card.drawdownPercent * 100).toFixed(1)}%
          </span>
        </div>
        <div>
          <span className="block text-[9px] uppercase tracking-wider text-muted/60">{t('signals')}</span>
          <span className="font-mono text-xs text-main">
            {card.successfulSignals24h}/{card.signalCount24h}
          </span>
        </div>
      </div>

      <div className="flex flex-row gap-4 sm:w-1/6 sm:flex-col sm:gap-0 sm:text-right">
        <div>
          <span className="inline-block text-[9px] uppercase tracking-wider text-muted/60 sm:hidden">{t('pnlLabel')}</span>
          <span className={`font-mono text-sm font-semibold ${pnlColor}`}>
            {card.currentPnL >= 0 ? '+' : ''}${card.currentPnL.toFixed(2)}
          </span>
        </div>
        <div>
          <span className="inline-block text-[9px] uppercase tracking-wider text-muted/60 sm:hidden">{t('returnLabel')}</span>
          <span className={`font-mono text-[10px] ${pnlColor}`}>
            {(card.pnlPercent * 100).toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-border pt-3 sm:border-t-0 sm:pt-0">
        <Button asChild size="sm" variant="outline">
          <Link href={`/terminal/marketplace/${card.botId}`}>{t('reviewAction')}</Link>
        </Button>
        <Button onClick={() => onUnsubscribe(card)} disabled={actionDisabled} size="sm" variant="danger">
          {t('unsubscribe')}
        </Button>
      </div>
    </Card>
  );
});

BotDecisionRow.displayName = 'BotDecisionRow';
