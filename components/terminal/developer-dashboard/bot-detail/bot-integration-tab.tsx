import { BotIntegrationHealth } from '@/lib/contracts/types';
import { Badge } from '@/components/ui/badge';
import { IntegrationHealthWidget } from '../integration-health-widget';

interface BotIntegrationTabProps {
  integrationHealth: BotIntegrationHealth | null;
}

function integrationTone(status?: string | null): "success" | "warning" | "error" | "default" {
  const normalized = String(status ?? '').toUpperCase();
  if (normalized === 'UP') return 'success';
  if (normalized === 'DEGRADED') return 'warning';
  if (normalized === 'DOWN') return 'error';
  return 'default';
}

export function BotIntegrationTab({ integrationHealth }: BotIntegrationTabProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-main">Integration health</h2>
          <p className="mt-1 text-sm text-muted">Operational summary for the webhook and runtime bridge.</p>      
        </div>
        {integrationHealth && (
          <Badge variant={integrationTone(integrationHealth.overallStatus)}>
            {integrationHealth.overallStatus}
          </Badge>
        )}
      </div>

      {integrationHealth ? (
        <IntegrationHealthWidget health={integrationHealth} />
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-6 text-sm text-muted">        
          Integration health is not available for this bot yet.
        </div>
      )}
    </section>
  );
}
