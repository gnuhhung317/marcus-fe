import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MarketplaceBot } from '@/lib/contracts/types';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Award, ShieldAlert, ArrowRight } from 'lucide-react';

interface MarketplaceBotCardProps {
  bot: MarketplaceBot;
}

function formatPercent(value: number | null, digits = 1, signed = false) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return 'N/A';
  }
  const prefix = signed && value >= 0 ? '+' : '';
  return `${prefix}${value.toFixed(digits)}%`;
}

export function MarketplaceBotCard({ bot }: MarketplaceBotCardProps) {
  const returnTone = bot.pnl30d === null || bot.pnl30d === undefined
    ? 'text-main'
    : bot.pnl30d >= 0
      ? 'text-positive'
      : 'text-negative';
  
  const drawdownTone = bot.drawdown === null || bot.drawdown === undefined ? 'text-main' : 'text-negative';

  const displayId = bot.botId.startsWith('bot_')
    ? `bot_${bot.botId.slice(4, 8)}...${bot.botId.slice(-4)}`
    : `${bot.botId.slice(0, 8)}...${bot.botId.slice(-4)}`;

  return (
    <Card 
      variant="glass-strong" 
      className="p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_8px_30px_rgba(16,185,129,0.06)] bg-surface-strong/30"
    >
      <div className="flex h-full flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold text-main tracking-tight">{bot.name}</h2>
              <p className="mt-0.5 font-mono text-[10px] text-muted">{displayId}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {bot.tags.map((tag) => {
              const isRisk = ['HIGH', 'MEDIUM', 'LOW'].includes(tag.toUpperCase());
              let badgeVariant: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'outline' = 'outline';
              
              if (isRisk) {
                if (tag.toUpperCase() === 'HIGH') badgeVariant = 'error';
                else if (tag.toUpperCase() === 'MEDIUM') badgeVariant = 'warning';
                else if (tag.toUpperCase() === 'LOW') badgeVariant = 'success';
              }

              return (
                <Badge 
                  key={tag} 
                  variant={badgeVariant} 
                  className={cn(
                    "normal-case text-[9px] px-1.5 py-0.5 font-medium tracking-normal",
                    !isRisk && "bg-surface/50 border-border/40 text-muted"
                  )}
                >
                  {tag}
                </Badge>
              );
            })}
          </div>

          <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-border/30 bg-surface/30 shadow-none divide-x divide-border/30 text-center">
            <div className="p-2 flex flex-col justify-between h-full min-w-0">
              <span className="text-[9px] uppercase tracking-[0.12em] text-muted flex items-center justify-center gap-1 font-medium">
                {bot.pnl30d !== null && bot.pnl30d >= 0 ? (
                  <TrendingUp className="w-3 h-3 text-positive shrink-0" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-negative shrink-0" />
                )}
                Return
              </span>
              <p className={cn('mt-1 text-base font-semibold', returnTone)}>
                {formatPercent(bot.pnl30d, 1, true)}
              </p>
            </div>

            <div className="p-2 flex flex-col justify-between h-full min-w-0">
              <span className="text-[9px] uppercase tracking-[0.12em] text-muted flex items-center justify-center gap-1 font-medium">
                <Award className="w-3 h-3 text-muted shrink-0" />
                Win rate
              </span>
              <p className="mt-1 text-base font-semibold text-main">
                {formatPercent(bot.winRate)}
              </p>
            </div>

            <div className="p-2 flex flex-col justify-between h-full min-w-0">
              <span className="text-[9px] uppercase tracking-[0.12em] text-muted flex items-center justify-center gap-1 font-medium">
                <ShieldAlert className="w-3 h-3 text-muted shrink-0" />
                Drawdown
              </span>
              <p className={cn('mt-1 text-base font-semibold', drawdownTone)}>
                {bot.drawdown === null || bot.drawdown === undefined 
                  ? 'N/A' 
                  : bot.drawdown === 0 
                    ? '0.0%' 
                    : `-${Math.abs(bot.drawdown).toFixed(1)}%`}
              </p>
            </div>
          </div>
        </div>

        <Button 
          variant="outline" 
          asChild 
          className="mt-4 w-full group/btn border-border hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm"
        >
          <Link href={`/terminal/marketplace/${encodeURIComponent(bot.botId)}`} className="flex items-center justify-center gap-1">
            Open bot
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
