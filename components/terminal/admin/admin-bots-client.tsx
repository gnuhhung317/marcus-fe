'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Eye, PencilLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-primitive';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/providers/toast-provider';
import { AdminBotRow, AdminBotStatus, AdminPage } from '@/lib/contracts/types';
import { updateAdminBotStatus } from '@/lib/services/admin.service';

interface AdminBotsClientProps {
  data: AdminPage<AdminBotRow>;
  filters: {
    query?: string;
    status?: string;
    developerId?: string;
    page: number;
    size: number;
  };
}

function statusVariant(status: string) {
  if (status === 'ACTIVE') return 'success';
  if (status === 'PAUSED') return 'warning';
  if (status === 'DELETED' || status === 'DOWN') return 'error';
  return 'outline';
}

export function AdminBotsClient({ data, filters }: AdminBotsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { pushToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(filters.query ?? '');
  const [status, setStatus] = useState(filters.status ?? '');
  const [developerId, setDeveloperId] = useState(filters.developerId ?? '');

  const [statusDialogBot, setStatusDialogBot] = useState<AdminBotRow | null>(null);
  const [statusDialogStatus, setStatusDialogStatus] = useState<AdminBotStatus>('PAUSED');
  const [statusDialogReason, setStatusDialogReason] = useState('');
  const [cancelSubscriptions, setCancelSubscriptions] = useState(false);
  const [statusDialogError, setStatusDialogError] = useState<string | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusSubmitting, setStatusSubmitting] = useState(false);

  useEffect(() => {
    setQuery(filters.query ?? '');
    setStatus(filters.status ?? '');
    setDeveloperId(filters.developerId ?? '');
  }, [filters.developerId, filters.query, filters.status]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(data.totalElements / data.size)), [data.size, data.totalElements]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '0');
    params.set('size', String(filters.size));

    if (query.trim()) params.set('query', query.trim());
    else params.delete('query');

    if (status) params.set('status', status);
    else params.delete('status');

    if (developerId.trim()) params.set('developerId', developerId.trim());
    else params.delete('developerId');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const openStatusDialog = (bot: AdminBotRow) => {
    setStatusDialogBot(bot);
    setStatusDialogStatus(bot.status);
    setStatusDialogReason('');
    setCancelSubscriptions(false);
    setStatusDialogError(null);
    setStatusDialogOpen(true);
  };

  const submitStatusChange = async () => {
    if (!statusDialogBot) return;
    const normalizedReason = statusDialogReason.trim();
    if (!normalizedReason) {
      setStatusDialogError('Reason is required');
      return;
    }

    setStatusSubmitting(true);
    try {
      await updateAdminBotStatus(statusDialogBot.botId, {
        status: statusDialogStatus,
        reason: normalizedReason,
        cancelActiveSubscriptions: cancelSubscriptions,
      });
      pushToast({ title: 'Bot status updated', message: statusDialogBot.name, tone: 'success' });
      setStatusDialogOpen(false);
      router.refresh();
    } catch (error) {
      setStatusDialogError(error instanceof Error ? error.message : 'Failed to update bot status');
    } finally {
      setStatusSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-border/70 p-4">
        <div className="grid gap-3 lg:grid-cols-[1.4fr_0.9fr_0.9fr_auto]">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search bot name, id, pair, or developer" />
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
            <option value="DOWN">Down</option>
            <option value="DELETED">Deleted</option>
          </Select>
          <Input value={developerId} onChange={(e) => setDeveloperId(e.target.value)} placeholder="Developer id" />
          <Button onClick={applyFilters} isLoading={isPending}>Filter</Button>
        </div>
      </Card>

      <Card className="overflow-hidden rounded-2xl border-border/70">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-surface-strong text-[11px] uppercase tracking-[0.14em] text-muted">
              <tr>
                <th className="px-4 py-3">Bot</th>
                <th className="px-4 py-3">Developer</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Subscribers</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {data.items.map((bot) => (
                <tr key={bot.botId} className="hover:bg-surface/80">
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <p className="font-medium text-main">{bot.name}</p>
                      <p className="text-[11px] font-mono text-muted">{bot.botId}</p>
                      <p className="text-xs text-muted">{bot.tradingPair ?? 'No pair set'}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <p className="text-sm text-main">{bot.developerUsername ?? bot.developerId}</p>
                      <p className="text-[11px] font-mono text-muted">{bot.developerId}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant(bot.status)}>{bot.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-main">{bot.activeSubscriberCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/terminal/admin/bots/${bot.botId}`}>
                          <Eye className="size-4" />
                          Open
                        </Link>
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => openStatusDialog(bot)}>
                        <PencilLine className="size-4" />
                        Status
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!data.items.length ? (
                <tr>
                  <td className="px-4 py-10 text-center text-sm text-muted" colSpan={5}>
                    No bots found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">
          Page {data.page + 1} of {totalPages} · {data.totalElements} bots
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={data.page <= 0}
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.set('page', String(Math.max(0, data.page - 1)));
              router.push(`${pathname}?${params.toString()}`);
            }}
          >
            <ChevronLeft className="size-4" />
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!data.hasNext}
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.set('page', String(data.page + 1));
              router.push(`${pathname}?${params.toString()}`);
            }}
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Update bot status</DialogTitle>
            <DialogDescription>
              Change the lifecycle state for {statusDialogBot?.name ?? 'selected bot'}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-6 py-5">
            <FormField label="Status">
              <Select value={statusDialogStatus} onChange={(e) => setStatusDialogStatus(e.target.value as AdminBotStatus)}>
                <option value="ACTIVE">Active</option>
                <option value="PAUSED">Paused</option>
                <option value="DOWN">Down</option>
                <option value="DELETED">Deleted</option>
              </Select>
            </FormField>
            <FormField label="Reason" error={statusDialogError ?? undefined}>
              <Textarea value={statusDialogReason} onChange={(e) => setStatusDialogReason(e.target.value)} rows={4} />
            </FormField>
            <label className="flex items-start gap-3 rounded-xl border border-border/60 bg-surface/70 px-4 py-3 text-sm text-main">
              <input
                type="checkbox"
                checked={cancelSubscriptions}
                onChange={(e) => setCancelSubscriptions(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-border bg-surface text-primary"
              />
              <span>
                Cancel active subscriptions
                <span className="block text-xs text-muted">Use this when pausing or deleting a bot to protect traders.</span>
              </span>
            </label>
            {statusDialogError ? (
              <p className="text-sm text-negative" role="alert">
                {statusDialogError}
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
            <Button isLoading={statusSubmitting} onClick={submitStatusChange}>Update status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
