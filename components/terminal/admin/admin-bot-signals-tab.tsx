'use client';

import { useFormatter, useTranslations } from 'next-intl';
import type { DeveloperSignalItem } from '@/lib/contracts/types/developer';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { EmptyStateCard } from '@/components/shared/api-state';

interface AdminBotSignalsTabProps {
  signals: DeveloperSignalItem[];
}

function signalBadgeVariant(status?: string | null) {
  if (status === 'FAILED') return 'error';
  if (status === 'DELIVERED' || status === 'SUCCESS') return 'success';
  return 'outline';
}

export function AdminBotSignalsTab({ signals }: AdminBotSignalsTabProps) {
  const t = useTranslations('Admin.Bots.detail.signals');
  const tStatus = useTranslations('Common.labels');
  const formatter = useFormatter();

  if (!signals.length) {
    return <EmptyStateCard title={t('emptyTitle')} message={t('emptyMessage')} />;
  }

  return (
    <Card className="overflow-hidden rounded-2xl border-border/70">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-surface-strong text-[11px] uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="px-4 py-3">{t('signal')}</th>
              <th className="px-4 py-3">{t('action')}</th>
              <th className="px-4 py-3">{t('symbol')}</th>
              <th className="px-4 py-3">{t('status')}</th>
              <th className="px-4 py-3">{t('time')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {signals.map((signal) => (
              <tr key={signal.signalId} className="hover:bg-surface/80">
                <td className="px-4 py-3 font-mono text-xs text-main">{signal.signalId}</td>
                <td className="px-4 py-3 text-main">{signal.action ?? t('unknown')}</td>
                <td className="px-4 py-3 text-main">{signal.symbol ?? t('unknown')}</td>
                <td className="px-4 py-3">
                  <Badge variant={signalBadgeVariant(signal.status)}>{signal.status ?? tStatus('unknown')}</Badge>
                </td>
                <td className="px-4 py-3 text-xs text-muted">
                  {signal.generatedTimestamp ? formatter.dateTime(new Date(signal.generatedTimestamp), { dateStyle: 'medium', timeStyle: 'short' }) : t('unknown')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
