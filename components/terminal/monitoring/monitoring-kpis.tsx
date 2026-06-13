import { KpiCard } from '@/components/shared/kpi-card';
import { Badge } from '@/components/ui/badge';
import type { DashboardPageData, DeveloperConsolePageData } from '@/lib/contracts/types';

interface MonitoringKpisProps {
  dashboard: DashboardPageData;
  ops: DeveloperConsolePageData;
  sparklineSeed: number[];
}

export function MonitoringKpis({ dashboard, ops, sparklineSeed }: MonitoringKpisProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.16em] text-muted">
        <Badge variant={ops.connectivity.overallStatus === 'UP' ? 'success' : 'warning'} className="bg-transparent border-border">
           Connectivity: {ops.connectivity.overallStatus}
        </Badge>
        <Badge variant="outline" className="bg-white/[0.03]">
          Signals: <span className="text-main ml-1">{ops.signalStream.length}</span>
        </Badge>
        <Badge variant="outline" className="bg-white/[0.03]">
          Logs: <span className="text-main ml-1">{ops.executionLogs.length}</span>
        </Badge>
        <Badge variant="outline" className="bg-white/[0.03]">
          Trades: <span className="text-main ml-1">{dashboard.botTrades.length}</span>
        </Badge>
      </div>
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {dashboard.terminalKpis.map((kpi, index) => (
          <KpiCard
            key={kpi.label}
            {...kpi}
            data={sparklineSeed.length ? sparklineSeed.map((value, seriesIndex) => value * (1 + index * 0.01) + seriesIndex) : undefined}
          />
        ))}
      </div>
    </section>
  );
}
