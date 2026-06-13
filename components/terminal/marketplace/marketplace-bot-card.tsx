import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MarketplaceBot } from '@/lib/contracts/types';
import { cn } from '@/lib/utils';

interface MarketplaceBotCardProps {
  bot: MarketplaceBot;
}

export function MarketplaceBotCard({ bot }: MarketplaceBotCardProps) {
  return (
    <Card variant="glass-strong" className="p-5">
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-2xl font-semibold text-main">{bot.name}</h2>
              <p className="mt-1 font-mono text-xs text-muted">{bot.botId}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {bot.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="bg-surface normal-case">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Card variant="default" className="p-3 border-border rounded-xl">
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Return</p>
              <p className={cn(
                "mt-2 text-lg font-semibold",
                bot.pnl30d >= 0 ? 'text-positive' : 'text-negative'
              )}>
                {bot.pnl30d >= 0 ? '+' : ''}
                {bot.pnl30d.toFixed(1)}%
              </p>
            </Card>
            <Card variant="default" className="p-3 border-border rounded-xl">
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Win rate</p>
              <p className="mt-2 text-lg font-semibold text-main">{bot.winRate.toFixed(1)}%</p>
            </Card>
            <Card variant="default" className="p-3 border-border rounded-xl">
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Drawdown</p>
              <p className="mt-2 text-lg font-semibold text-negative">-{bot.drawdown.toFixed(1)}%</p>
            </Card>
          </div>
        </div>

        <Button variant="primary" asChild className="mt-6 w-full">
          <Link href={`/terminal/marketplace/${encodeURIComponent(bot.botId)}`}>
            Open bot
          </Link>
        </Button>
      </div>
    </Card>
  );
}
