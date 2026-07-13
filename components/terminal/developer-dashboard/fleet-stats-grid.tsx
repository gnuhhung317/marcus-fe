'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { AlertTriangle, Bot, Pause, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface FleetStatsGridProps {
  total: number;
  active: number;
  paused: number;
  down: number;
}

function StatCard({
  label,
  value,
  description,
  icon,
  tone,
}: {
  label: string;
  value: number;
  description: string;
  icon: ReactNode;
  tone: 'neutral' | 'positive' | 'warning' | 'negative';
}) {
  const toneIconClass =
    tone === 'positive'
      ? 'text-positive bg-positive/10 border-positive/20'
      : tone === 'warning'
        ? 'text-warning bg-warning/10 border-warning/20'
        : tone === 'negative'
          ? 'text-negative bg-negative/10 border-negative/20'
          : 'text-muted bg-surface-strong border-border';

  return (
    <div className="flex flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">{label}</p>
          <p className="mt-1.5 text-3xl font-bold tracking-tight text-main">{value}</p>
        </div>
        <div className={`flex size-9 items-center justify-center rounded-lg border ${toneIconClass}`}>{icon}</div>
      </div>
      <p className={`text-[10px] flex items-center gap-1.5 font-sans font-medium ${tone === 'positive' ? 'text-positive/85' : tone === 'warning' ? 'text-warning/85' : tone === 'negative' ? 'text-negative/85' : 'text-muted/60'}`}>
        <span className={`size-1.5 rounded-full ${tone === 'positive' ? 'bg-positive' : tone === 'warning' ? 'bg-warning' : tone === 'negative' ? 'bg-negative' : 'bg-muted'}`} />
        {description}
      </p>
    </div>
  );
}

export function FleetStatsGrid({ total, active, paused, down }: FleetStatsGridProps) {
  const t = useTranslations('DeveloperDashboard.fleetStats');

  return (
    <Card className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border/40 bg-surface/40 border-none">
      <StatCard label={t('fleetSize.label')} value={total} description={t('fleetSize.description')} icon={<Bot className="h-4 w-4" />} tone="neutral" />
      <StatCard label={t('active.label')} value={active} description={t('active.description')} icon={<Zap className="h-4 w-4" />} tone="positive" />
      <StatCard label={t('paused.label')} value={paused} description={t('paused.description')} icon={<Pause className="h-4 w-4" />} tone="warning" />
      <StatCard
        label={t('down.label')}
        value={down}
        description={down > 0 ? t('down.alert') : t('down.ok')}
        icon={<AlertTriangle className="h-4 w-4" />}
        tone={down > 0 ? 'negative' : 'neutral'}
      />
    </Card>
  );
}
