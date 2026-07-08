'use client';

import { ErrorStateCard, LoadingStateCard } from '@/components/shared/api-state';
import { KpiCard } from '@/components/shared/kpi-card';
import { Badge } from '@/components/ui/badge';
import { useMonitoringOpsQuery, useMonitoringOverviewQuery, useRefreshMonitoringData } from '@/lib/hooks/use-monitoring-data';
import { getConnectivityBadgeVariant, getConnectivityStatusLabel, normalizeConnectivityStatus } from './connectivity-status';
import { useTranslations } from 'next-intl';

export function MonitoringKpis() {
  const t = useTranslations('Monitoring.header');
  const tHealth = useTranslations('Common.systemHealth');
  const { data: dashboard, error: dashboardError } = useMonitoringOverviewQuery();
  const { data: ops, error: opsError } = useMonitoringOpsQuery();
  const { refresh } = useRefreshMonitoringData();

  const error = dashboardError ?? opsError;

  if (error) {
    return (
      <ErrorStateCard
        title={t('kpis.errorTitle')}
        message={error instanceof Error ? error.message : t('kpis.errorMessage')}
        onAction={refresh}
        actionLabel={t('refresh')}
      />
    );
  }

  if (!dashboard || !ops) {
    return <LoadingStateCard title={t('kpis.loadingTitle')} message={t('kpis.loadingMessage')} />;
  }

  const sparklineSeed = dashboard.terminalKpis.map((_, index) => dashboard.botTrades[index]?.pnl ?? index);
  const connectivityStatus = normalizeConnectivityStatus(ops.connectivity.overallStatus);
  const connectivityLabel = getConnectivityStatusLabel(connectivityStatus, {
    checking: t('status.checking'),
    up: tHealth('UP'),
    degraded: tHealth('DEGRADED'),
    down: tHealth('DOWN'),
    unavailable: t('status.unavailable'),
  });

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.16em] text-muted">
        <Badge variant={getConnectivityBadgeVariant(connectivityStatus)}>
          {t('status.connectivity')}: {connectivityLabel}
        </Badge>
        <Badge variant="outline">
          <span className="text-main">{ops.signalStream.length}</span>
        </Badge>
        <Badge variant="outline">
          <span className="text-main">{ops.executionLogs.length}</span>
        </Badge>
        <Badge variant="outline">
          <span className="text-main">{dashboard.botTrades.length}</span>
        </Badge>
      </div>
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {dashboard.terminalKpis.map((kpi, index) => (
          <KpiCard
            key={kpi.label}
            {...kpi}
            data={
              sparklineSeed.length
                ? sparklineSeed.map((value, seriesIndex) => value * (1 + index * 0.01) + seriesIndex)
                : undefined
            }
          />
        ))}
      </div>
    </section>
  );
}
