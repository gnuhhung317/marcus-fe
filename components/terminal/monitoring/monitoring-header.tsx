'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMonitoringOpsQuery, useRefreshMonitoringData } from '@/lib/hooks/use-monitoring-data';
import {
  getConnectivityBadgeVariant,
  getConnectivityStatusLabel,
  normalizeConnectivityStatus,
} from './connectivity-status';

interface MonitoringHeaderProps {
  showConnectivity?: boolean;
}

export function MonitoringHeader({ showConnectivity = true }: MonitoringHeaderProps) {
  const t = useTranslations('Monitoring.header');
  const tHealth = useTranslations('Common.systemHealth');
  const { data: ops, isLoading } = useMonitoringOpsQuery(showConnectivity);
  const { refresh, isRefreshing } = useRefreshMonitoringData();
  const connectivityStatus = normalizeConnectivityStatus(
    ops?.connectivity.executorConnectionStatus ?? ops?.connectivity.overallStatus,
  );
  const isChecking = isLoading && !ops;
  const connectivityLabel = getConnectivityStatusLabel(
    connectivityStatus,
    {
      checking: t('status.checking'),
      up: tHealth('UP'),
      degraded: tHealth('DEGRADED'),
      down: tHealth('DOWN'),
      unavailable: t('status.unavailable'),
    },
    isChecking,
  );

  return (
    <header className="flex flex-col gap-5 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted">
          <Badge variant="success" className="px-2.5">
            {t('phase')}
          </Badge>
          <span>{t('eyebrow')}</span>
          <span>{t('subheading')}</span>
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-main lg:text-4xl">{t('title')}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            {t('description')}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {showConnectivity ? (
          <Badge variant={getConnectivityBadgeVariant(connectivityStatus, isChecking)} className="px-3 py-2 text-sm">
            {connectivityLabel}
          </Badge>
        ) : null}
        <Button
          variant="outline"
          onClick={refresh}
          isLoading={isRefreshing}
        >
          {t('refresh')}
        </Button>
      </div>
    </header>
  );
}
