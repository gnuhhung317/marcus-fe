 'use client';

import { useTranslations } from 'next-intl';
import { DeveloperSubscriptionSummary } from '@/lib/contracts/types';

interface SubscriptionTableProps {
  subscriptions: DeveloperSubscriptionSummary[];
}

export function SubscriptionTable({ subscriptions }: SubscriptionTableProps) {
  const t = useTranslations('DeveloperDashboard.subscriptionTable');
  const tStatus = useTranslations('DeveloperDashboard.botDetail.subscribers');
  const tCommon = useTranslations('Common.labels');

  return (
    <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-main">{t('title')}</h2>
        <p className="text-sm text-muted">{t('activeCount', { count: subscriptions.length })}</p>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-border/40">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-surface-strong text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="px-4 py-3">{t('bot')}</th>
              <th className="px-4 py-3">{t('subscriber')}</th>
              <th className="px-4 py-3">{t('status')}</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub, index) => (
              <tr
                key={`${sub.botId}-${index}`}
                className="group border-t border-border/40 hover:bg-surface-strong transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 max-w-[150px]">
                    <span className="text-main font-mono text-xs truncate" title={sub.botId}>
                      {sub.botId}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-muted font-mono text-xs">{t('subscriberLabel', { index: index + 1 })}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    sub.status === 'ACTIVE' || sub.status === 'CONNECTED'
                      ? 'bg-primary-soft text-positive border border-primary-soft'
                      : 'bg-surface-strong text-muted border border-border/40'
                  }`}>
                    {sub.status === 'ACTIVE' ? tStatus('active') : sub.status === 'CONNECTED' ? tStatus('connected') : tCommon('unknown')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
