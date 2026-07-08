 'use client';

import { useTranslations } from 'next-intl';
import { BotIntegrationHealth } from '@/lib/contracts/types';
import { IntegrationHealthWidget } from '../integration-health-widget';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface BotIntegrationTabProps {
  integrationHealth: BotIntegrationHealth | null;
}

export function BotIntegrationTab({ integrationHealth }: BotIntegrationTabProps) {
  const t = useTranslations('DeveloperDashboard.botIntegrationTab');
  const tHealth = useTranslations('Common.systemHealth');
  const isUp = integrationHealth?.overallStatus === 'UP';
  const isDegraded = integrationHealth?.overallStatus === 'DEGRADED';

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted font-sans">{t('title')}</h2>
        </div>
        {integrationHealth && (
          <Badge variant={isUp ? 'success' : isDegraded ? 'warning' : 'error'} className="rounded-lg px-2.5 py-1 text-[9px] font-mono">
            <span className={`h-1.5 w-1.5 rounded-full ${isUp ? 'bg-positive' : isDegraded ? 'bg-warning' : 'bg-negative'}`} />
            {tHealth(integrationHealth.overallStatus as 'UP' | 'DEGRADED' | 'DOWN')}
          </Badge>
        )}
      </div>

      {integrationHealth ? (
        <IntegrationHealthWidget health={integrationHealth} />
      ) : (
        <Card className="rounded-xl border-dashed border-border/40 p-6 text-center text-xs text-muted font-sans">
          {t('empty')}
        </Card>
      )}
    </section>
  );
}
