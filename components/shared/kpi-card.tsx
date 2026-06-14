import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { createSparklineDefaultConfig } from '@/lib/configs/sparkline.config';
import { Sparkline } from './sparkline';

interface KpiCardProps {
  label: string;
  value: string;
  delta: string;
  context: string;
  trend: 'up' | 'down' | 'neutral';
  data?: number[];
}

const trendPresentation = {
  up: { symbol: '↑', variant: 'success' as const },
  down: { symbol: '↓', variant: 'error' as const },
  neutral: { symbol: '→', variant: 'outline' as const },
};

export function KpiCard({ label, value, delta, context, trend, data }: KpiCardProps) {
  const trendStyle = trendPresentation[trend];
  const sparklineConfig = createSparklineDefaultConfig();

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">{label}</p>
          <p className="mt-2 text-3xl font-bold leading-none tracking-tight text-main">{value}</p>
        </div>
        {data && (
          <div className="pt-1">
            <Sparkline
              data={data}
              color={
                trend === 'up'
                  ? sparklineConfig.colors.positive
                  : trend === 'down'
                  ? sparklineConfig.colors.negative
                  : sparklineConfig.colors.neutral
              }
            />
          </div>
        )}
      </div>
      {(delta || context) && (
        <div className="mt-4 flex items-center gap-2.5">
          {delta && (
            <Badge variant={trendStyle.variant} className="h-4.5 px-1.5 py-0 text-[9px] font-bold">
              {trendStyle.symbol} {delta}
            </Badge>
          )}
          {context && (
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted/50">
              {context}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
