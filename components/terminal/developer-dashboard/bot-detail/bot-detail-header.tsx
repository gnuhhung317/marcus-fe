import Link from 'next/link';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DeveloperBotDetail, DeveloperBotStatus, BotIntegrationHealth } from '@/lib/contracts/types';

interface BotDetailHeaderProps {
  bot: DeveloperBotDetail;
  localStatus: DeveloperBotStatus;
  integrationHealth: BotIntegrationHealth | null;
  onEdit: () => void;
  onDelete: () => void;
  onBackToFleet?: () => void;
}

export function BotDetailHeader({ bot, localStatus, integrationHealth, onEdit, onDelete, onBackToFleet }: BotDetailHeaderProps) {
  const isUp = integrationHealth?.overallStatus === 'UP';
  const isDegraded = integrationHealth?.overallStatus === 'DEGRADED';
  const statusVariant = localStatus === 'ACTIVE' ? 'success' : localStatus === 'PAUSED' ? 'warning' : 'error';
  const integrationVariant = isUp ? 'success' : isDegraded ? 'warning' : 'error';

  return (
    <div className="border-b border-border p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-4">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-8 px-0 text-xs font-bold uppercase tracking-wider text-muted hover:text-main"
          >
            <Link
              href="/terminal/developer-dashboard"
              onClick={(e) => {
                if (onBackToFleet) {
                  e.preventDefault();
                  onBackToFleet();
                }
              }}
              className="inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Fleet
            </Link>
          </Button>

          <div className="flex flex-wrap items-center gap-2 font-mono">
            <Badge variant={statusVariant} className="rounded-lg px-2.5 py-1 text-[9px]">
              <span className={`h-1.5 w-1.5 rounded-full ${localStatus === 'ACTIVE' ? 'bg-positive' : localStatus === 'PAUSED' ? 'bg-warning' : 'bg-negative'}`} />
              {localStatus}
            </Badge>

            {integrationHealth && (
              <Badge variant={integrationVariant} className="rounded-lg px-2.5 py-1 text-[9px]">
                <span className={`h-1.5 w-1.5 rounded-full ${isUp ? 'bg-positive' : isDegraded ? 'bg-warning' : 'bg-negative'}`} />
                {integrationHealth.overallStatus}
              </Badge>
            )}

            <span className="rounded-lg border border-border bg-surface px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-muted">
              {bot.botId}
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-main uppercase sm:text-3xl">{bot.botName}</h1>
            {bot.description && (
              <p className="line-clamp-2 max-w-3xl text-xs leading-relaxed text-muted font-sans">
                {bot.description}
              </p>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 font-mono">
            <div className="rounded-xl border border-border bg-surface px-4 py-3 flex items-center gap-2">
              <p className="text-xs font-bold text-main uppercase">
                {bot.exchange ?? 'N/A'} <span className="text-muted font-normal mx-1">•</span> {bot.tradingPair ?? 'N/A'}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface px-4 py-3">
              <p className="text-[9px] font-bold uppercase tracking-wider text-muted font-sans">Developer ID</p>
              <p className="mt-1 text-xs font-bold text-main">
                {bot.developerId ? `${bot.developerId.slice(0, 12)}...` : 'N/A'}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface px-4 py-3">
              <p className="text-[9px] font-bold uppercase tracking-wider text-muted font-sans">Last Updated</p>
              <p className="mt-1 text-xs font-bold text-main font-sans">
                {bot.updatedAt ? new Date(bot.updatedAt).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-row gap-3 sm:flex-row lg:flex-col font-sans">
          <Button variant="secondary" onClick={onEdit} className="gap-2 text-xs font-bold uppercase tracking-wider cursor-pointer h-9 px-4">
            <Edit className="h-3.5 w-3.5" />
            Edit Bot
          </Button>
          <Button variant="danger" onClick={onDelete} className="gap-2 text-xs font-bold uppercase tracking-wider cursor-pointer h-9 px-4">
            <Trash2 className="h-3.5 w-3.5" />
            Delete Bot
          </Button>
        </div>
      </div>
    </div>
  );
}
