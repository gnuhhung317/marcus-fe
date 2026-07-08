 'use client';

import { useTranslations } from 'next-intl';
import { DeveloperSubscriptionSummary } from '@/lib/contracts/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface BotSubscribersTabProps {
  subscriptions: DeveloperSubscriptionSummary[];
  isSwitching?: boolean;
}

export function BotSubscribersTab({ subscriptions, isSwitching }: BotSubscribersTabProps) {
  const t = useTranslations('DeveloperDashboard.botDetail.subscribers');
  const tStatus = useTranslations('Common.labels');
  const subscriberCount = subscriptions.length;
  const connectedCount = subscriptions.filter((sub) => sub.status === 'CONNECTED').length;
  const activeCount = subscriptions.filter((sub) => sub.status === 'ACTIVE').length;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted font-sans">{t('title')}</h2>
        </div>
        <Badge variant="outline" className="rounded-lg px-2.5 py-1 text-[9px] font-mono">
          {t('sessions', { count: subscriberCount })}
        </Badge>
      </div>

      {isSwitching ? (
        <div className="space-y-3">
          <div className="h-20 animate-pulse rounded-xl bg-surface/40" />
          <div className="h-12 animate-pulse rounded-xl bg-surface/40" />
        </div>
      ) : subscriptions.length === 0 ? (
        <Card className="rounded-xl border-dashed border-border/40 p-6 text-center text-xs text-muted font-sans">
          {t('empty')}
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: t('subscribers'), value: subscriberCount },
              { label: t('connected'), value: connectedCount },
              { label: t('active'), value: activeCount },
            ].map((item) => (
              <Card key={item.label} className="p-3 font-mono">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted font-sans">{item.label}</p>
                <p className="mt-2 text-lg font-bold tracking-tight text-main">{item.value}</p>
              </Card>
            ))}
          </div>

          <Card className="overflow-hidden border-border/40 bg-surface/30 font-mono">
            <table className="min-w-full border-collapse text-left text-[11px] leading-relaxed">
              <thead className="border-b border-border/40 bg-surface-strong uppercase text-[9px] font-bold tracking-wider text-muted font-sans">
                <tr>
                  <th className="px-4 py-3">{t('subscriber')}</th>
                  <th className="px-4 py-3 text-right">{t('status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {subscriptions.map((sub, index) => {
                  const isActive = sub.status === 'ACTIVE' || sub.status === 'CONNECTED';
                  return (
                    <tr key={`${sub.botId}-${index}`} className="text-main">
                      <td className="px-4 py-3 font-medium font-sans">
                        {t('subscriberLabel', { index: index + 1 })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Badge variant={isActive ? 'success' : 'outline'} className="rounded-lg px-2.5 py-1 text-[9px]">
                          <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-positive' : 'bg-muted'}`} />
                          {sub.status === 'ACTIVE' ? t('active') : sub.status === 'CONNECTED' ? t('connected') : tStatus('unknown')}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </section>
  );
}
