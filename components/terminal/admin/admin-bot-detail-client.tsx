'use client';

import { useEffect, useMemo, useState } from 'react';
import { PencilLine, ShieldAlert, ScrollText, Signal, Users, Bot } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AdminReasonDialog } from './admin-reason-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { FormField } from '@/components/ui/form-primitive';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/providers/toast-provider';
import { AdminBotDetailPageData, AdminBotStatus, AdminBotSubscriberRow } from '@/lib/contracts/types';
import { forceCancelAdminSubscription, updateAdminBotStatus } from '@/lib/services/admin.service';

interface AdminBotDetailClientProps {
  data: AdminBotDetailPageData;
}

function statusVariant(status: string) {
  if (status === 'ACTIVE') return 'success';
  if (status === 'PAUSED') return 'warning';
  if (status === 'DELETED' || status === 'DOWN') return 'error';
  return 'outline';
}

function tabButtonClass(active: boolean) {
  return active ? 'bg-primary text-cta-on-primary' : 'bg-surface-strong text-muted hover:text-main';
}

export function AdminBotDetailClient({ data }: AdminBotDetailClientProps) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'signals' | 'subscribers' | 'audit'>('overview');
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusDialogStatus, setStatusDialogStatus] = useState<AdminBotStatus>(data.detail.status);
  const [statusDialogReason, setStatusDialogReason] = useState('');
  const [cancelSubscriptions, setCancelSubscriptions] = useState(false);
  const [statusDialogError, setStatusDialogError] = useState<string | null>(null);
  const [statusSubmitting, setStatusSubmitting] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<AdminBotSubscriberRow | null>(null);

  const subscriberCount = data.subscribers.totalElements;
  const activeSubscribers = useMemo(
    () => data.subscribers.items.filter((subscriber) => subscriber.status === 'ACTIVE'),
    [data.subscribers.items]
  );

  useEffect(() => {
    setStatusDialogStatus(data.detail.status);
  }, [data.detail.status]);

  const submitStatusChange = async () => {
    const reason = statusDialogReason.trim();
    if (!reason) {
      setStatusDialogError('Reason is required');
      return;
    }

    setStatusSubmitting(true);
    try {
      await updateAdminBotStatus(data.detail.botId, {
        status: statusDialogStatus,
        reason,
        cancelActiveSubscriptions: cancelSubscriptions,
      });
      pushToast({ title: 'Bot status updated', message: data.detail.name, tone: 'success' });
      setStatusDialogOpen(false);
      router.refresh();
    } catch (error) {
      setStatusDialogError(error instanceof Error ? error.message : 'Failed to update bot status');
    } finally {
      setStatusSubmitting(false);
    }
  };

  const submitCancel = async (reason: string) => {
    if (!cancelTarget) return;

    try {
      await forceCancelAdminSubscription(cancelTarget.userSubscriptionId, { reason });
      pushToast({ title: 'Subscription canceled', message: cancelTarget.username ?? cancelTarget.userId, tone: 'success' });
      setCancelTarget(null);
      router.refresh();
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-border/70 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge variant={statusVariant(data.detail.status)}>{data.detail.status}</Badge>
              <span className="text-xs text-muted font-mono">{data.detail.botId}</span>
            </div>
            <h2 className="text-2xl font-semibold text-main">{data.detail.name}</h2>
            <p className="max-w-3xl text-sm text-muted">{data.detail.description ?? 'No description provided.'}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setStatusDialogOpen(true)}>
              <PencilLine className="size-4" />
              Update status
            </Button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-border/60 bg-surface/70 p-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted">Developer</p>
            <p className="mt-2 text-sm text-main">{data.detail.developerUsername ?? data.detail.developerId}</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-surface/70 p-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted">Trading pair</p>
            <p className="mt-2 text-sm text-main">{data.detail.tradingPair ?? 'Unset'}</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-surface/70 p-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted">Subscribers</p>
            <p className="mt-2 text-sm text-main">{subscriberCount}</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-surface/70 p-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted">Signals</p>
            <p className="mt-2 text-sm text-main">{data.signals.length}</p>
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button variant={activeTab === 'overview' ? 'primary' : 'outline'} onClick={() => setActiveTab('overview')}>
          <Bot className="size-4" />
          Overview
        </Button>
        <Button variant={activeTab === 'signals' ? 'primary' : 'outline'} onClick={() => setActiveTab('signals')}>
          <Signal className="size-4" />
          Signals
        </Button>
        <Button variant={activeTab === 'subscribers' ? 'primary' : 'outline'} onClick={() => setActiveTab('subscribers')}>
          <Users className="size-4" />
          Subscribers
        </Button>
        <Button variant={activeTab === 'audit' ? 'primary' : 'outline'} onClick={() => setActiveTab('audit')}>
          <ScrollText className="size-4" />
          Audit trail
        </Button>
      </div>

      {activeTab === 'overview' ? (
        <Card className="rounded-2xl border-border/70 p-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-xl border border-border/60 bg-surface/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted">Exchange</p>
              <p className="mt-2 text-sm text-main">{data.detail.exchangeId ?? 'Unset'}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-surface/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted">Risk level</p>
              <p className="mt-2 text-sm text-main">{data.detail.riskLevel ?? 'Unset'}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-surface/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted">Active subscribers</p>
              <p className="mt-2 text-sm text-main">{activeSubscribers.length}</p>
            </div>
          </div>
        </Card>
      ) : null}

      {activeTab === 'signals' ? (
        <Card className="overflow-hidden rounded-2xl border-border/70">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-surface-strong text-[11px] uppercase tracking-[0.14em] text-muted">
                <tr>
                  <th className="px-4 py-3">Signal</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Symbol</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {data.signals.map((signal) => (
                  <tr key={signal.signalId} className="hover:bg-surface/80">
                    <td className="px-4 py-3 font-mono text-xs text-main">{signal.signalId}</td>
                    <td className="px-4 py-3 text-main">{signal.action ?? 'Unknown'}</td>
                    <td className="px-4 py-3 text-main">{signal.symbol ?? 'Unknown'}</td>
                    <td className="px-4 py-3">
                      <Badge variant={signal.status === 'FAILED' ? 'error' : signal.status === 'DELIVERED' ? 'success' : 'outline'}>
                        {signal.status ?? 'UNKNOWN'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">
                      {signal.generatedTimestamp ? new Date(signal.generatedTimestamp).toLocaleString() : 'Unknown'}
                    </td>
                  </tr>
                ))}
                {!data.signals.length ? (
                  <tr>
                    <td className="px-4 py-10 text-center text-sm text-muted" colSpan={5}>
                      No signals found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}

      {activeTab === 'subscribers' ? (
        <Card className="overflow-hidden rounded-2xl border-border/70">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-surface-strong text-[11px] uppercase tracking-[0.14em] text-muted">
                <tr>
                  <th className="px-4 py-3">Subscriber</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Executor</th>
                  <th className="px-4 py-3">Lifecycle</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {data.subscribers.items.map((subscriber) => (
                  <tr key={subscriber.userSubscriptionId} className="hover:bg-surface/80">
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <p className="text-sm text-main">{subscriber.username ?? subscriber.userId}</p>
                        <p className="text-[11px] font-mono text-muted">{subscriber.userId}</p>
                        <p className="text-[11px] text-muted">{subscriber.email ?? 'No email'}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={subscriber.status === 'ACTIVE' ? 'success' : subscriber.status === 'CANCELED' ? 'error' : 'outline'}>
                        {subscriber.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={subscriber.executorConnected ? 'success' : 'warning'}>
                        {subscriber.executorConnected ? 'Connected' : 'Disconnected'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">
                      {subscriber.cancellationReason ? subscriber.cancellationReason : subscriber.startDate ? new Date(subscriber.startDate).toLocaleString() : 'Unknown'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <Button
                          variant={subscriber.status === 'ACTIVE' ? 'destructive' : 'outline'}
                          size="sm"
                          disabled={subscriber.status !== 'ACTIVE'}
                          onClick={() => setCancelTarget(subscriber)}
                        >
                          <ShieldAlert className="size-4" />
                          Force cancel
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!data.subscribers.items.length ? (
                  <tr>
                    <td className="px-4 py-10 text-center text-sm text-muted" colSpan={5}>
                      No subscribers found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}

      {activeTab === 'audit' ? (
        <Card className="overflow-hidden rounded-2xl border-border/70">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-surface-strong text-[11px] uppercase tracking-[0.14em] text-muted">
                <tr>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Target</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {data.auditEvents.items.map((event) => (
                  <tr key={event.adminAuditEventId} className="hover:bg-surface/80">
                    <td className="px-4 py-3 font-medium text-main">{event.action}</td>
                    <td className="px-4 py-3 text-xs text-muted">
                      {event.targetType} - {event.targetId}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">{event.reason ?? 'No reason stored'}</td>
                    <td className="px-4 py-3 text-xs text-muted">
                      {event.createdAt ? new Date(event.createdAt).toLocaleString() : 'Unknown'}
                    </td>
                  </tr>
                ))}
                {!data.auditEvents.items.length ? (
                  <tr>
                    <td className="px-4 py-10 text-center text-sm text-muted" colSpan={4}>
                      No audit events found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}

      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Update bot status</DialogTitle>
            <DialogDescription>Change the lifecycle state for {data.detail.name}.</DialogDescription>
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
                <span className="block text-xs text-muted">Recommended when pausing or deleting a bot.</span>
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

      <AdminReasonDialog
        open={!!cancelTarget}
        title="Force cancel subscription"
        description={`Cancel the active subscription for ${cancelTarget?.username ?? cancelTarget?.userId ?? 'this trader'}.`}
        confirmLabel="Cancel subscription"
        onOpenChange={(open) => {
          if (!open) setCancelTarget(null);
        }}
        onSubmit={submitCancel}
        defaultReason=""
      />
    </div>
  );
}
