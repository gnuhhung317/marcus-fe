'use client';

import { Eye, PencilLine } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { AdminBotRow, AdminPage } from '@/lib/contracts/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from '@/lib/navigation';

interface AdminBotsTableProps {
  data: AdminPage<AdminBotRow>;
  onChangeStatus: (bot: AdminBotRow) => void;
}

function statusVariant(status: string) {
  if (status === 'ACTIVE') return 'success';
  if (status === 'PAUSED') return 'warning';
  if (status === 'DELETED' || status === 'DOWN') return 'error';
  return 'outline';
}

export function AdminBotsTable({ data, onChangeStatus }: AdminBotsTableProps) {
  const t = useTranslations('Admin.Bots.table');
  const tStatus = useTranslations('Common.botStatus');

  return (
    <Card className="overflow-hidden rounded-2xl border-border/70">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-surface-strong text-[11px] uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="px-4 py-3">{t('bot')}</th>
              <th className="px-4 py-3">{t('developer')}</th>
              <th className="px-4 py-3">{t('status')}</th>
              <th className="px-4 py-3">{t('subscribers')}</th>
              <th className="px-4 py-3 text-right">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {data.items.map((bot) => (
              <tr key={bot.botId} className="hover:bg-surface/80">
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <p className="font-medium text-main">{bot.name}</p>
                    <p className="text-[11px] font-mono text-muted">{bot.botId}</p>
                    <p className="text-xs text-muted">{bot.tradingPair ?? t('noPairSet')}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <p className="text-sm text-main">{bot.developerUsername ?? bot.developerId}</p>
                    <p className="text-[11px] font-mono text-muted">{bot.developerId}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant(bot.status)}>{tStatus(bot.status)}</Badge>
                </td>
                <td className="px-4 py-3 text-sm text-main">{bot.activeSubscriberCount}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/terminal/admin/bots/${bot.botId}`}>
                        <Eye className="size-4" />
                        {t('open')}
                      </Link>
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => onChangeStatus(bot)}>
                      <PencilLine className="size-4" />
                      {t('statusButton')}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {!data.items.length ? (
              <tr>
                <td className="px-4 py-10 text-center text-sm text-muted" colSpan={5}>
                  {t('noBotsFound')}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
