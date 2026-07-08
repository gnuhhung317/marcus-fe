'use client';

import { useFormatter, useTranslations } from 'next-intl';
import type { AdminAuditEventRow } from '@/lib/contracts/types';
import { Card } from '@/components/ui/card';
import { EmptyStateCard } from '@/components/shared/api-state';

interface AdminBotAuditTabProps {
  auditEvents: AdminAuditEventRow[];
}

export function AdminBotAuditTab({ auditEvents }: AdminBotAuditTabProps) {
  const t = useTranslations('Admin.Bots.detail.audit');
  const formatter = useFormatter();

  if (!auditEvents.length) {
    return <EmptyStateCard title={t('emptyTitle')} message={t('emptyMessage')} />;
  }

  return (
    <Card className="overflow-hidden rounded-2xl border-border/70">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-surface-strong text-[11px] uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="px-4 py-3">{t('action')}</th>
              <th className="px-4 py-3">{t('target')}</th>
              <th className="px-4 py-3">{t('reason')}</th>
              <th className="px-4 py-3">{t('time')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {auditEvents.map((event) => (
              <tr key={event.adminAuditEventId} className="hover:bg-surface/80">
                <td className="px-4 py-3 font-medium text-main">{event.action}</td>
                <td className="px-4 py-3 text-xs text-muted">
                  {event.targetType} - {event.targetId}
                </td>
                <td className="px-4 py-3 text-xs text-muted">{event.reason ?? t('noReasonStored')}</td>
                <td className="px-4 py-3 text-xs text-muted">
                  {event.createdAt ? formatter.dateTime(new Date(event.createdAt), { dateStyle: 'medium', timeStyle: 'short' }) : t('unknown')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
