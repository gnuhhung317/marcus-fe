'use client';

import { useFormatter, useTranslations } from 'next-intl';
import type { AdminBotSubscriberRow } from '@/lib/contracts/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyStateCard } from '@/components/shared/api-state';

interface AdminBotSubscribersTabProps {
  subscribers: AdminBotSubscriberRow[];
  onForceCancel: (subscriber: AdminBotSubscriberRow) => void;
}

function subscriberStatusVariant(status: string) {
  if (status === 'ACTIVE') return 'success';
  if (status === 'CANCELED') return 'error';
  return 'outline';
}

function executorVariant(connected: boolean) {
  return connected ? 'success' : 'warning';
}

export function AdminBotSubscribersTab({ subscribers, onForceCancel }: AdminBotSubscribersTabProps) {
  const t = useTranslations('Admin.Bots.detail.subscribers');
  const formatter = useFormatter();

  if (!subscribers.length) {
    return <EmptyStateCard title={t('emptyTitle')} message={t('emptyMessage')} />;
  }

  return (
    <Card className="overflow-hidden rounded-2xl border-border/70">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-surface-strong text-[11px] uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="px-4 py-3">{t('subscriber')}</th>
              <th className="px-4 py-3">{t('status')}</th>
              <th className="px-4 py-3">{t('executor')}</th>
              <th className="px-4 py-3">{t('lifecycle')}</th>
              <th className="px-4 py-3 text-right">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {subscribers.map((subscriber) => (
              <tr key={subscriber.userSubscriptionId} className="hover:bg-surface/80">
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <p className="text-sm text-main">{subscriber.username ?? subscriber.userId}</p>
                    <p className="text-[11px] font-mono text-muted">{subscriber.userId}</p>
                    <p className="text-[11px] text-muted">{subscriber.email ?? t('noEmail')}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={subscriberStatusVariant(subscriber.status)}>{subscriber.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={executorVariant(subscriber.executorConnected)}>
                    {subscriber.executorConnected ? t('connected') : t('disconnected')}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-xs text-muted">
                  {subscriber.cancellationReason
                    ? subscriber.cancellationReason
                    : subscriber.startDate
                      ? formatter.dateTime(new Date(subscriber.startDate), { dateStyle: 'medium', timeStyle: 'short' })
                      : t('unknown')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <Button
                      variant={subscriber.status === 'ACTIVE' ? 'destructive' : 'outline'}
                      size="sm"
                      disabled={subscriber.status !== 'ACTIVE'}
                      onClick={() => onForceCancel(subscriber)}
                    >
                      {t('forceCancel')}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
