import { BotIntegrationHealth } from '@/lib/contracts/types';
import { IntegrationHealthWidget } from '../integration-health-widget';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface BotIntegrationTabProps {
  integrationHealth: BotIntegrationHealth | null;
}

export function BotIntegrationTab({ integrationHealth }: BotIntegrationTabProps) {
  const isUp = integrationHealth?.overallStatus === 'UP';
  const isDegraded = integrationHealth?.overallStatus === 'DEGRADED';

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted font-sans">Integration Health</h2>
        </div>
        {integrationHealth && (
          <Badge variant={isUp ? 'success' : isDegraded ? 'warning' : 'error'} className="rounded-lg px-2.5 py-1 text-[9px] font-mono">
            <span className={`h-1.5 w-1.5 rounded-full ${isUp ? 'bg-positive' : isDegraded ? 'bg-warning' : 'bg-negative'}`} />
            {integrationHealth.overallStatus}
          </Badge>
        )}
      </div>

      {integrationHealth ? (
        <IntegrationHealthWidget health={integrationHealth} />
      ) : (
        <Card className="rounded-xl border-dashed border-border p-6 text-center text-xs text-muted font-sans">
          Integration health is not available for this bot yet.
        </Card>
      )}
    </section>
  );
}
