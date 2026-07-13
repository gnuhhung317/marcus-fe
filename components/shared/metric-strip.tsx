import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricItem {
  label: string;
  value: React.ReactNode;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
  delta?: string;
}

interface MetricStripProps {
  items: MetricItem[];
  className?: string;
}

const trendPresentation = {
  up: { symbol: '↑', variant: 'success' as const },
  down: { symbol: '↓', variant: 'error' as const },
  neutral: { symbol: '→', variant: 'outline' as const },
};

export function MetricStrip({ items, className }: MetricStripProps) {
  return (
    <Card className={cn('grid grid-cols-1 divide-y divide-border/50 border-none bg-surface/50 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4', className)}>
      {items.map((item, index) => {
        const trendStyle = item.trend ? trendPresentation[item.trend] : null;

        return (
          <div key={`${item.label}-${index}`} className="flex min-h-[100px] flex-col justify-between p-5 first:rounded-l-xl last:rounded-r-xl">
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                {item.label}
              </p>
              <p className="font-mono text-2xl font-bold tracking-tight text-main">
                {item.value}
              </p>
            </div>
            {(item.subtext || item.delta) && (
              <div className="mt-2 flex items-center gap-2 text-[10px]">
                {item.delta && trendStyle && (
                  <Badge variant={trendStyle.variant} className="h-4.5 px-1.5 py-0 text-[9px] font-bold">
                    {trendStyle.symbol} {item.delta}
                  </Badge>
                )}
                {item.subtext && (
                  <span className="font-medium uppercase tracking-wider text-muted/50">
                    {item.subtext}
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </Card>
  );
}
