'use client';

import { memo, useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import { EmptyStateCard, ErrorStateCard, LoadingStateCard } from '@/components/shared/api-state';
import { useToast } from '@/components/providers/toast-provider';
import { useAdminUserMutations } from '@/lib/hooks/use-admin-mutations';
import { useAdminUsersQuery } from '@/lib/hooks/use-admin-queries';
import type { AdminPage, AdminUserRow } from '@/lib/contracts/types';
import type { AdminUsersQueryParams } from '@/lib/validations/admin.schema';
import { AdminPagination } from './admin-pagination';
import { AdminUserBanDialog } from './admin-user-ban-dialog';
import { AdminUserRoleDialog } from './admin-user-role-dialog';
import { AdminUsersFilterBar } from './admin-users-filter-bar';
import { AdminUsersTable } from './admin-users-table';

interface AdminUsersClientProps {
  initialData: AdminPage<AdminUserRow>;
  filters: AdminUsersQueryParams;
}

interface AdminUsersContentProps extends AdminUsersClientProps {
  onEditRole: (user: AdminUserRow) => void;
  onToggleBan: (user: AdminUserRow) => void;
}

const AdminUsersContent = memo(function AdminUsersContent({
  initialData,
  filters,
  onEditRole,
  onToggleBan,
}: AdminUsersContentProps) {
  const t = useTranslations('Admin.Users');
  const query = useAdminUsersQuery(filters, initialData);
  const users = query.data ?? initialData;

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

  if (users.items.length === 0) {
    return (
      <div className="space-y-6">
        <AdminUsersFilterBar filters={filters} totalElements={users.totalElements} />
        <EmptyStateCard
          title={t('state.emptyTitle')}
          message={t('state.emptyMessage')}
        />
        <AdminPagination page={users.page} pageSize={users.size} totalElements={users.totalElements} hasNext={users.hasNext} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminUsersFilterBar filters={filters} totalElements={users.totalElements} />

      <AdminUsersTable
        data={users}
        onEditRole={onEditRole}
        onToggleBan={onToggleBan}
      />

      <AdminPagination
        page={users.page}
        pageSize={users.size}
        totalElements={users.totalElements}
        hasNext={users.hasNext}
      />
    </div>
  );
});

export function AdminUsersClient({ initialData, filters }: AdminUsersClientProps) {
  const { pushToast } = useToast();
  const t = useTranslations('Admin.Users');
  const tRoles = useTranslations('Common.roles');
  const { updateRole, updateBan } = useAdminUserMutations();
  const [roleTarget, setRoleTarget] = useState<AdminUserRow | null>(null);
  const [banTarget, setBanTarget] = useState<AdminUserRow | null>(null);

  const handleEditRole = useCallback((user: AdminUserRow) => {
    setRoleTarget(user);
  }, []);

  const handleToggleBan = useCallback((user: AdminUserRow) => {
    setBanTarget(user);
  }, []);

  return (
    <>
      <AdminUsersContent
        initialData={initialData}
        filters={filters}
        onEditRole={handleEditRole}
        onToggleBan={handleToggleBan}
      />

      <AdminUserRoleDialog
        open={roleTarget !== null}
        user={roleTarget}
        onOpenChange={(open) => {
          if (!open) setRoleTarget(null);
        }}
        onSubmit={async ({ role, reason }) => {
          if (!roleTarget) return;

          await updateRole.mutateAsync({ userId: roleTarget.userId, role, reason });
          pushToast({
            title: t('toast.roleUpdatedTitle'),
            message: t('toast.roleUpdatedMessage', {
              username: roleTarget.username,
              role: tRoles(role),
            }),
            tone: 'success',
          });
        }}
      />
      <AdminUserBanDialog
        open={banTarget !== null}
        user={banTarget}
        onOpenChange={(open) => {
          if (!open) setBanTarget(null);
        }}
        onSubmit={async (reason) => {
          if (!banTarget) return;

          await updateBan.mutateAsync({
            userId: banTarget.userId,
            banned: !banTarget.banned,
            reason,
          });

          pushToast({
            title: banTarget.banned ? t('toast.userUnbannedTitle') : t('toast.userBannedTitle'),
            message: banTarget.username,
            tone: 'success',
          });
        }}
      />
    </>
  );
}
