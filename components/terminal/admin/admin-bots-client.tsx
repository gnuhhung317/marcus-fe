'use client';

import { useState } from 'react';
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

export function AdminBotsClient({ initialData, filters }: AdminBotsClientProps) {
  const { pushToast } = useToast();
  const query = useAdminBotsQuery(filters, initialData);
  const { updateStatus } = useAdminBotMutations();
  const [statusTarget, setStatusTarget] = useState<Pick<AdminBotRow, 'botId' | 'name' | 'status'> | null>(null);

  const bots = query.data ?? initialData;

  if (query.isLoading && !query.data) {
    return <LoadingStateCard title="Loading bots" message="Fetching the latest admin bot list." />;
  }

  if (query.error && !query.data) {
    return (
      <ErrorStateCard
        title="Bots unavailable"
        message={query.error instanceof Error ? query.error.message : 'Unable to load bots right now.'}
        actionLabel="Retry"
        onAction={() => void query.refetch()}
      />
    );
  }

  if (bots.items.length === 0) {
    return (
      <div className="space-y-6">
        <AdminBotsFilterBar filters={filters} totalElements={bots.totalElements} />
        <EmptyStateCard
          title="No bots found"
          message="Try adjusting the search term, status, or developer filter."
        />
        <AdminPagination
          page={bots.page}
          pageSize={bots.size}
          totalElements={bots.totalElements}
          hasNext={bots.hasNext}
          itemLabel="bots"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminBotsFilterBar filters={filters} totalElements={bots.totalElements} />

      <AdminBotsTable data={bots} onChangeStatus={(bot) => setStatusTarget(bot)} />

      <AdminPagination
        page={bots.page}
        pageSize={bots.size}
        totalElements={bots.totalElements}
        hasNext={bots.hasNext}
        itemLabel="bots"
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
            title: 'Bot status updated',
            message: statusTarget.name,
            tone: 'success',
          });
        }}
      />
    </div>
  );
}
