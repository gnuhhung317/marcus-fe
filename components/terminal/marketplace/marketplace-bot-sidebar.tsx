import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { StatusDot } from '@/components/shared/status-dot';
import { BotSignalItem, ViewerSubscription } from '@/lib/contracts/types';
import { SubscribeBotPanel } from '@/components/terminal/marketplace/subscribe-bot-panel';

interface MarketplaceBotSidebarProps {
  botId: string;
  botStatus?: string;
  initialSubscription?: ViewerSubscription | null;
  signals: BotSignalItem[];
}

function getSignalDotStatus(signal: BotSignalItem) {
  const statusNormalized = (signal.status ?? 'UNKNOWN').toUpperCase();
  if (statusNormalized === 'COMPLETED' || statusNormalized === 'FILLED') {
    return 'live' as const;
  }

  if (statusNormalized === 'PENDING') {
    return 'warning' as const;
  }

  return 'offline' as const;
}

export function MarketplaceBotSidebar({ botId, botStatus, initialSubscription, signals }: MarketplaceBotSidebarProps) {
  const t = useTranslations('Marketplace.sidebar');
  const setupSteps = [t('steps.1'), t('steps.2'), t('steps.3')];

  return (
    <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
      <section className="space-y-3">
        <p className="text-xs uppercase tracking-[0.16em] text-muted">{t('deployment')}</p>
        <SubscribeBotPanel botId={botId} botStatus={botStatus} initialSubscription={initialSubscription} />
      </section>

      <Card variant="glass-strong" className="p-6 shadow-[var(--shadow-soft)]">
        <h2 className="text-lg font-semibold text-main">{t('setupTitle')}</h2>
        <ol className="mt-4 space-y-4">
          {setupSteps.map((step, index) => (
            <li key={step} className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary font-mono">
                {index + 1}
              </div>
              <div>
                <p className="text-sm font-semibold text-main">{step}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <Card variant="glass-strong" className="p-6 shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">{t('signals')}</p>
            <h2 className="mt-2 text-xl font-semibold text-main">{t('recentSignals')}</h2>
          </div>
          <Badge variant="outline" className="font-mono">
            {signals.length}
          </Badge>
        </div>

        {signals.length ? (
          <div className="mt-6 max-h-[460px] divide-y divide-border/40 overflow-y-auto pr-1">
            {signals.slice(0, 12).map((signal) => {
              const isBuy = (signal.action ?? '').toUpperCase() === 'BUY';
              const isSell = (signal.action ?? '').toUpperCase() === 'SELL';
              const actionColor = isBuy ? 'text-positive bg-positive-soft' : isSell ? 'text-negative bg-negative-soft' : 'text-muted bg-surface';
              const statusNormalized = (signal.status ?? 'UNKNOWN').toUpperCase();

              return (
                <div key={signal.signalId} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-main">
                        {signal.symbol ?? 'UNKNOWN'}
                      </span>
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${actionColor}`}>
                        {signal.action ?? 'SIGNAL'}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-muted">
                      {signal.generatedTimestamp ?? 'Timestamp pending'}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <StatusDot status={getSignalDotStatus(signal)} size="sm" pulse={statusNormalized === 'PENDING'} />
                    <Badge
                      variant={statusNormalized === 'FILLED' || statusNormalized === 'COMPLETED' ? 'success' : 'default'}
                      className="text-[10px]"
                    >
                      {signal.status ?? 'PENDING'}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-border/40 bg-surface/40 p-5 text-center text-sm text-muted">
            {t('empty')}
          </div>
        )}
      </Card>
    </aside>
  );
}
