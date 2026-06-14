import Link from 'next/link';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
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

  return (
    <div className="border-b border-border p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-4">
          <Link 
            href="/terminal/developer-dashboard" 
            onClick={(e) => {
              if (onBackToFleet) {
                e.preventDefault();
                onBackToFleet();
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Fleet
          </Link>

          <div className="flex flex-wrap items-center gap-2 font-mono">
            <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
              localStatus === 'ACTIVE'
                ? 'border-positive/20 bg-positive/10 text-positive'
                : localStatus === 'PAUSED'
                  ? 'border-warning/20 bg-warning/10 text-warning'
                  : 'border-negative/20 bg-negative/10 text-negative'
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${localStatus === 'ACTIVE' ? 'bg-positive' : localStatus === 'PAUSED' ? 'bg-warning' : 'bg-negative'}`} />
              {localStatus}
            </span>

            {integrationHealth && (
              <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
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

            <span className="rounded-lg border border-border bg-surface px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-400">
              ID: {bot.botId}
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-white uppercase sm:text-3xl">{bot.botName}</h1>
            {bot.description && (
              <p className="line-clamp-2 max-w-3xl text-xs leading-relaxed text-slate-400 font-sans">
                {bot.description}
              </p>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 font-mono">
            <div className="rounded-xl border border-border bg-surface px-4 py-3">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 font-sans">Venue</p>
              <p className="mt-1 text-xs font-bold text-white uppercase">{bot.exchange ?? 'N/A'}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface px-4 py-3">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 font-sans">Pair</p>
              <p className="mt-1 text-xs font-bold text-white uppercase">{bot.tradingPair ?? 'N/A'}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface px-4 py-3">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 font-sans">Developer ID</p>
              <p className="mt-1 text-xs font-bold text-white">
                {bot.developerId ? `${bot.developerId.slice(0, 12)}...` : 'N/A'}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface px-4 py-3">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 font-sans">Last Updated</p>
              <p className="mt-1 text-xs font-bold text-white font-sans">
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
