'use client';

import { memo, useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
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

interface AdminBotDetailContentProps extends AdminBotDetailClientProps {
  onUpdateStatus: () => void;
  onForceCancel: (subscriber: AdminBotDetailPageData['subscribers']['items'][number]) => void;
}

const AdminBotDetailContent = memo(function AdminBotDetailContent({
  botId,
  initialData,
  onUpdateStatus,
  onForceCancel,
}: AdminBotDetailContentProps) {
  const t = useTranslations('Admin.Bots.detail');
  const tRoot = useTranslations('Admin.Bots');
  const query = useAdminBotDetailQuery(botId, initialData);
  const [activeTab, setActiveTab] = useState<AdminBotDetailTab>('overview');
  const data = query.data ?? initialData;

  if (query.isLoading && !query.data) {
    return <LoadingStateCard title={tRoot('state.loadingTitle')} message={tRoot('state.loadingMessage')} />;
  }

  if (query.error && !query.data) {
    return (
      <ErrorStateCard
        title={tRoot('state.errorTitle')}
        message={query.error instanceof Error ? query.error.message : tRoot('state.errorMessage')}
        onAction={() => void query.refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <AdminBotDetailHeader data={data} onUpdateStatus={onUpdateStatus} />

      <AdminBotDetailTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'overview' ? <AdminBotOverviewTab data={data} /> : null}
      {activeTab === 'signals' ? <AdminBotSignalsTab signals={data.signals} /> : null}
      {activeTab === 'subscribers' ? (
        <AdminBotSubscribersTab
          subscribers={data.subscribers.items}
          onForceCancel={onForceCancel}
        />
      ) : null}
      {activeTab === 'audit' ? <AdminBotAuditTab auditEvents={data.auditEvents.items} /> : null}
    </div>
  );
});

export function AdminBotDetailClient({ botId, initialData }: AdminBotDetailClientProps) {
  const { pushToast } = useToast();
  const t = useTranslations('Admin.Bots.detail');
  const tRoot = useTranslations('Admin.Bots');
  const { updateStatus, forceCancelSubscription } = useAdminBotMutations();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<AdminBotDetailPageData['subscribers']['items'][number] | null>(null);

  const handleOpenStatusDialog = useCallback(() => {
    setStatusDialogOpen(true);
  }, []);

  const handleForceCancel = useCallback((subscriber: AdminBotDetailPageData['subscribers']['items'][number]) => {
    setCancelTarget(subscriber);
  }, []);

  return (
    <>
      <AdminBotDetailContent
        botId={botId}
        initialData={initialData}
        onUpdateStatus={handleOpenStatusDialog}
        onForceCancel={handleForceCancel}
      />

      <AdminBotStatusDialog
        open={statusDialogOpen}
        bot={initialData.detail}
        onOpenChange={(open) => setStatusDialogOpen(open)}
        onSubmit={async ({ status, reason, cancelActiveSubscriptions }) => {
          await updateStatus.mutateAsync({
            botId,
            status,
            reason,
            cancelActiveSubscriptions,
          });

          pushToast({
            title: tRoot('toast.statusUpdatedTitle'),
            message: initialData.detail.name,
            tone: 'success',
          });
        }}
      />

      <AdminReasonDialog
        open={cancelTarget !== null}
        title={t('reasonDialog.title')}
        description={t('reasonDialog.description', {
          subscriberName: cancelTarget?.username ?? cancelTarget?.userId ?? t('reasonDialog.selectedTrader'),
        })}
        confirmLabel={t('reasonDialog.confirm')}
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
            title: tRoot('toast.subscriptionCanceledTitle'),
            message: cancelTarget.username ?? cancelTarget.userId,
            tone: 'success',
          });
        }}
        defaultReason=""
      />
    </>
  );
}
