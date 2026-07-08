'use client';

import { useTranslations } from 'next-intl';
import type { AdminBotDetailPageData } from '@/lib/contracts/types';
import { Card } from '@/components/ui/card';

interface AdminBotOverviewTabProps {
  data: AdminBotDetailPageData;
}

export function AdminBotOverviewTab({ data }: AdminBotOverviewTabProps) {
  const t = useTranslations('Admin.Bots.detail.overview');

  return (
    <Card className="rounded-2xl border-border/70 p-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl border border-border/60 bg-surface/70 p-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{t('exchange')}</p>
          <p className="mt-2 text-sm text-main">{data.detail.exchangeId ?? t('unset')}</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-surface/70 p-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{t('riskLevel')}</p>
          <p className="mt-2 text-sm text-main">{data.detail.riskLevel ?? t('unset')}</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-surface/70 p-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{t('activeSubscribers')}</p>
          <p className="mt-2 text-sm text-main">{data.subscribers.items.filter((subscriber) => subscriber.status === 'ACTIVE').length}</p>
        </div>
      </div>
    </Card>
  );
}
