'use client';

import { memo, useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import { EmptyStateCard, ErrorStateCard, LoadingStateCard } from '@/components/shared/api-state';
import { useToast } from '@/components/providers/toast-provider';
import { useAdminBotMutations } from '@/lib/hooks/use-admin-mutations';
import { useAdminBotsQuery } from '@/lib/hooks/use-admin-queries';
import type { AdminBotRow, AdminPage } from '@/lib/contracts/types';
import type { AdminBotsQueryParams } from '@/lib/validations/admin.schema';
import { AdminBotStatusDialog } from './admin-bot-status-dialog';
import { AdminBotsFilterBar } from './admin-bots-filter-bar';
import { AdminBotsTable } from './admin-bots-table';
import { AdminPagination } from './admin-pagination';

interface AdminBotsClientProps {
  initialData: AdminPage<AdminBotRow>;
  filters: AdminBotsQueryParams;
}

interface AdminBotsContentProps extends AdminBotsClientProps {
  onChangeStatus: (bot: Pick<AdminBotRow, 'botId' | 'name' | 'status'>) => void;
}

const AdminBotsContent = memo(function AdminBotsContent({
  initialData,
  filters,
  onChangeStatus,
}: AdminBotsContentProps) {
  const t = useTranslations('Admin.Bots');
  const query = useAdminBotsQuery(filters, initialData);
  const bots = query.data ?? initialData;

  if (query.isLoading && !query.data) {
    return <LoadingStateCard title={t('state.loadingTitle')} message={t('state.loadingMessage')} />;
  }

  if (query.error && !query.data) {
    return (
      <ErrorStateCard
        title={t('state.errorTitle')}
        message={query.error instanceof Error ? query.error.message : t('state.errorMessage')}
        onAction={() => void query.refetch()}
      />
    );
  }

  if (bots.items.length === 0) {
    return (
      <div className="space-y-6">
        <AdminBotsFilterBar filters={filters} totalElements={bots.totalElements} />
        <EmptyStateCard title={t('state.emptyTitle')} message={t('state.emptyMessage')} />
        <AdminPagination page={bots.page} pageSize={bots.size} totalElements={bots.totalElements} hasNext={bots.hasNext} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminBotsFilterBar filters={filters} totalElements={bots.totalElements} />

      <AdminBotsTable data={bots} onChangeStatus={onChangeStatus} />

      <AdminPagination
        page={bots.page}
        pageSize={bots.size}
        totalElements={bots.totalElements}
        hasNext={bots.hasNext}
      />
    </div>
  );
});

export function AdminBotsClient({ initialData, filters }: AdminBotsClientProps) {
  const { pushToast } = useToast();
  const t = useTranslations('Admin.Bots');
  const { updateStatus } = useAdminBotMutations();
  const [statusTarget, setStatusTarget] = useState<Pick<AdminBotRow, 'botId' | 'name' | 'status'> | null>(null);

  const handleChangeStatus = useCallback((bot: Pick<AdminBotRow, 'botId' | 'name' | 'status'>) => {
    setStatusTarget(bot);
  }, []);

  return (
    <>
      <AdminBotsContent
        initialData={initialData}
        filters={filters}
        onChangeStatus={handleChangeStatus}
      />

      <AdminBotStatusDialog
        open={statusTarget !== null}
        bot={statusTarget}
        onOpenChange={(open) => {
          if (!open) setStatusTarget(null);
        }}
        onSubmit={async ({ status, reason, cancelActiveSubscriptions }) => {
          if (!statusTarget) return;

          await updateStatus.mutateAsync({
            botId: statusTarget.botId,
            status,
            reason,
            cancelActiveSubscriptions,
          });

          pushToast({
            title: t('toast.statusUpdatedTitle'),
            message: statusTarget.name,
            tone: 'success',
          });
        }}
      />
    </>
  );
}
