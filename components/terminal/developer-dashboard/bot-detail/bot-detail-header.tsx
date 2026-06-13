import Link from 'next/link';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DeveloperBotDetail, DeveloperBotStatus, BotIntegrationHealth } from '@/lib/contracts/types';
import { cn } from '@/lib/utils';

interface BotDetailHeaderProps {
  bot: DeveloperBotDetail;
  localStatus: DeveloperBotStatus;
  integrationHealth: BotIntegrationHealth | null;
  onEdit: () => void;
  onDelete: () => void;
}

const statusTone: Record<DeveloperBotStatus, "success" | "warning" | "error" | "default"> = {
  ACTIVE: 'success',
  PAUSED: 'warning',
  DOWN: 'error',
  DELETED: 'default',
};

function integrationTone(status?: string | null): "success" | "warning" | "error" | "default" {
  const normalized = String(status ?? '').toUpperCase();
  if (normalized === 'UP') return 'success';
  if (normalized === 'DEGRADED') return 'warning';
  if (normalized === 'DOWN') return 'error';
  return 'default';
}

export function BotDetailHeader({ bot, localStatus, integrationHealth, onEdit, onDelete }: BotDetailHeaderProps) {
  return (
    <div className="border-b border-border p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-4">
          <Link 
            href="/terminal/developer-dashboard" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-muted transition-colors hover:text-main"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to fleet
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={statusTone[localStatus]}>
              {localStatus === 'DELETED' ? 'Deleted' : localStatus}
            </Badge>
            {integrationHealth && (
              <Badge variant={integrationTone(integrationHealth.overallStatus)}>
                {integrationHealth.overallStatus}
              </Badge>
            )}
            <Badge variant="outline" className="font-mono">
              {bot.botId}
            </Badge>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-main sm:text-4xl">{bot.botName}</h1>
            {bot.description && (
              <p className="line-clamp-3 max-w-3xl text-sm leading-relaxed text-muted">
                {bot.description}
              </p>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-border bg-surface px-4 py-4">
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Venue</p>
              <p className="mt-2 text-sm font-semibold text-main">{bot.exchange ?? 'N/A'}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface px-4 py-4">
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Pair</p>
              <p className="mt-2 font-mono text-sm font-semibold text-main">{bot.tradingPair ?? 'N/A'}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface px-4 py-4">
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Developer</p>
              <p className="mt-2 truncate font-mono text-sm text-main">
                {bot.developerId ? `${bot.developerId.slice(0, 8)}...` : 'N/A'}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface px-4 py-4">
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Updated</p>
              <p className="mt-2 text-sm font-semibold text-main">
                {bot.updatedAt ? new Date(bot.updatedAt).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
          <Button variant="secondary" onClick={onEdit} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit bot
          </Button>
          <Button variant="danger" onClick={onDelete} className="gap-2">
            <Trash2 className="h-4 w-4" />
            Delete bot
          </Button>
        </div>
      </div>
    </div>
  );
}
