'use client';

import { useState } from 'react';
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

export function AdminUsersClient({ initialData, filters }: AdminUsersClientProps) {
  const { pushToast } = useToast();
  const query = useAdminUsersQuery(filters, initialData);
  const { updateRole, updateBan } = useAdminUserMutations();
  const [roleTarget, setRoleTarget] = useState<AdminUserRow | null>(null);
  const [banTarget, setBanTarget] = useState<AdminUserRow | null>(null);

  const users = query.data ?? initialData;

  if (query.isLoading && !query.data) {
    return <LoadingStateCard title="Loading users" message="Fetching the latest admin user list." />;
  }

  if (query.error && !query.data) {
    return (
      <ErrorStateCard
        title="Users unavailable"
        message={query.error instanceof Error ? query.error.message : 'Unable to load users right now.'}
        actionLabel="Retry"
        onAction={() => void query.refetch()}
      />
    );
  }

  if (users.items.length === 0) {
    return (
      <div className="space-y-6">
        <AdminUsersFilterBar filters={filters} totalElements={users.totalElements} />
        <EmptyStateCard
          title="No users found"
          message="Try adjusting the search, role, or ban filters."
        />
        <AdminPagination
          page={users.page}
          pageSize={users.size}
          totalElements={users.totalElements}
          hasNext={users.hasNext}
          itemLabel="users"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminUsersFilterBar filters={filters} totalElements={users.totalElements} />

      <AdminUsersTable
        data={users}
        onEditRole={(user) => setRoleTarget(user)}
        onToggleBan={(user) => setBanTarget(user)}
      />

      <AdminPagination
        page={users.page}
        pageSize={users.size}
        totalElements={users.totalElements}
        hasNext={users.hasNext}
        itemLabel="users"
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
            title: 'Role updated',
            message: `${roleTarget.username} is now ${role}.`,
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
            title: banTarget.banned ? 'User unbanned' : 'User banned',
            message: banTarget.username,
            tone: 'success',
          });
        }}
      />
    </div>
  );
}
