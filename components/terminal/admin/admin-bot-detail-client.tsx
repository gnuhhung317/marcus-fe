'use client';

import { useState } from 'react';
import { ErrorStateCard, LoadingStateCard } from '@/components/shared/api-state';
import { useToast } from '@/components/providers/toast-provider';
import { useAdminBotMutations } from '@/lib/hooks/use-admin-mutations';
import { useAdminBotDetailQuery } from '@/lib/hooks/use-admin-queries';
import type { AdminBotDetailPageData } from '@/lib/contracts/types';
import { AdminReasonDialog } from './admin-reason-dialog';
import { AdminBotAuditTab } from './admin-bot-audit-tab';
import { AdminBotDetailHeader } from './admin-bot-detail-header';
import { AdminBotDetailTab, AdminBotDetailTabs } from './admin-bot-detail-tabs';
import { AdminBotOverviewTab } from './admin-bot-overview-tab';
import { AdminBotSignalsTab } from './admin-bot-signals-tab';
import { AdminBotStatusDialog } from './admin-bot-status-dialog';
import { AdminBotSubscribersTab } from './admin-bot-subscribers-tab';

interface AdminBotDetailClientProps {
  botId: string;
  initialData: AdminBotDetailPageData;
}

export function AdminBotDetailClient({ botId, initialData }: AdminBotDetailClientProps) {
  const { pushToast } = useToast();
  const query = useAdminBotDetailQuery(botId, initialData);
  const { updateStatus, forceCancelSubscription } = useAdminBotMutations();
  const [activeTab, setActiveTab] = useState<AdminBotDetailTab>('overview');
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<AdminBotDetailPageData['subscribers']['items'][number] | null>(null);

  const data = query.data ?? initialData;

  if (query.isLoading && !query.data) {
    return <LoadingStateCard title="Loading bot detail" message="Fetching audit, signals, and subscriber data." />;
  }

  if (query.error && !query.data) {
    return (
      <ErrorStateCard
        title="Bot detail unavailable"
        message={query.error instanceof Error ? query.error.message : 'Unable to load this bot right now.'}
        actionLabel="Retry"
        onAction={() => void query.refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <AdminBotDetailHeader data={data} onUpdateStatus={() => setStatusDialogOpen(true)} />

      <AdminBotDetailTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'overview' ? <AdminBotOverviewTab data={data} /> : null}
      {activeTab === 'signals' ? <AdminBotSignalsTab signals={data.signals} /> : null}
      {activeTab === 'subscribers' ? (
        <AdminBotSubscribersTab
          subscribers={data.subscribers.items}
          onForceCancel={(subscriber) => setCancelTarget(subscriber)}
        />
      ) : null}
      {activeTab === 'audit' ? <AdminBotAuditTab auditEvents={data.auditEvents.items} /> : null}

      <AdminBotStatusDialog
        open={statusDialogOpen}
        bot={data.detail}
        onOpenChange={(open) => setStatusDialogOpen(open)}
        onSubmit={async ({ status, reason, cancelActiveSubscriptions }) => {
          await updateStatus.mutateAsync({
            botId,
            status,
            reason,
            cancelActiveSubscriptions,
          });

          pushToast({
            title: 'Bot status updated',
            message: data.detail.name,
            tone: 'success',
          });
        }}
      />

      <AdminReasonDialog
        open={cancelTarget !== null}
        title="Force cancel subscription"
        description={`Cancel the active subscription for ${cancelTarget?.username ?? cancelTarget?.userId ?? 'this trader'}.`}
        confirmLabel="Cancel subscription"
        onOpenChange={(open) => {
          if (!open) setCancelTarget(null);
        }}
        onSubmit={async (reason) => {
          if (!cancelTarget) return;

          await forceCancelSubscription.mutateAsync({
            botId,
            userSubscriptionId: cancelTarget.userSubscriptionId,
            reason,
          });

          pushToast({
            title: 'Subscription canceled',
            message: cancelTarget.username ?? cancelTarget.userId,
            tone: 'success',
          });
        }}
        defaultReason=""
      />
    </div>
  );
}
