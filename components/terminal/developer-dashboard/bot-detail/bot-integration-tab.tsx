import { BotIntegrationHealth } from '@/lib/contracts/types';
import { IntegrationHealthWidget } from '../integration-health-widget';

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
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Integration Health</h2>
          <p className="mt-1 text-xs text-slate-400 font-sans">Operational summary for the webhook and runtime bridge.</p>      
        </div>
        {integrationHealth && (
          <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider font-mono ${
            isUp 
              ? 'border-positive/20 bg-positive/10 text-positive' 
              : isDegraded 
                ? 'border-warning/20 bg-warning/10 text-warning' 
                : 'border-negative/20 bg-negative/10 text-negative'
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${isUp ? 'bg-positive' : isDegraded ? 'bg-warning' : 'bg-negative'}`} />
            {integrationHealth.overallStatus}
          </span>
        )}
      </div>

      {integrationHealth ? (
        <IntegrationHealthWidget health={integrationHealth} />
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-surface p-6 text-center text-xs text-slate-400 font-sans">        
          Integration health is not available for this bot yet.
        </div>
      )}
    </section>
  );
}
