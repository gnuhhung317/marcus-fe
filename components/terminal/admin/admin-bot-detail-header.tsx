'use client';

import { PencilLine } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { AdminBotDetailPageData } from '@/lib/contracts/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface AdminBotDetailHeaderProps {
  data: AdminBotDetailPageData;
  onUpdateStatus: () => void;
}

function statusVariant(status: string) {
  if (status === 'ACTIVE') return 'success';
  if (status === 'PAUSED') return 'warning';
  if (status === 'DELETED' || status === 'DOWN') return 'error';
  return 'outline';
}

export function AdminBotDetailHeader({ data, onUpdateStatus }: AdminBotDetailHeaderProps) {
  const subscriberCount = data.subscribers.totalElements;
  const t = useTranslations('Admin.Bots.detail.header');
  const tStatus = useTranslations('Common.botStatus');

  return (
    <Card className="rounded-2xl border-border/70 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Badge variant={statusVariant(data.detail.status)}>{tStatus(data.detail.status)}</Badge>
            <span className="font-mono text-xs text-muted">{data.detail.botId}</span>
          </div>
          <h2 className="text-2xl font-semibold text-main">{data.detail.name}</h2>
          <p className="max-w-3xl text-sm text-muted">{data.detail.description ?? t('descriptionFallback')}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onUpdateStatus}>
            <PencilLine className="size-4" />
            {t('updateStatus')}
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-border/60 bg-surface/70 p-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{t('developer')}</p>
          <p className="mt-2 text-sm text-main">{data.detail.developerUsername ?? data.detail.developerId ?? t('unset')}</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-surface/70 p-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{t('tradingPair')}</p>
          <p className="mt-2 text-sm text-main">{data.detail.tradingPair ?? t('unset')}</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-surface/70 p-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{t('subscribers')}</p>
          <p className="mt-2 text-sm text-main">{subscriberCount}</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-surface/70 p-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{t('signals')}</p>
          <p className="mt-2 text-sm text-main">{data.signals.length}</p>
        </div>
      </div>
    </Card>
  );
}
