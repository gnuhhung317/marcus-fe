import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface MonitoringHeaderProps {
  connectivityStatus: string;
  isRefreshing: boolean;
  onRefresh: () => void;
  title: string;
}

export function MonitoringHeader({ connectivityStatus, isRefreshing, onRefresh, title }: MonitoringHeaderProps) {
  const isUp = connectivityStatus === 'UP';

  return (
    <header className="flex flex-col gap-5 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted">
          <Badge variant="success" className="px-2.5">
            Phase 2
          </Badge>
          <span>Monitoring</span>
          <span>Portfolio telemetry + execution observability</span>
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-main lg:text-4xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Equity performance, exchange allocation, execution logs, and signal flow in a single operator-friendly view.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Badge variant={isUp ? 'success' : 'warning'} className="px-3 py-2 text-sm">
          {connectivityStatus}
        </Badge>
        <Button
          variant="outline"
          onClick={onRefresh}
          isLoading={isRefreshing}
        >
          Refresh
        </Button>
      </div>
    </header>
  );
}
