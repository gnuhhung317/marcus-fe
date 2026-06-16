'use client';

import { PencilLine, ShieldAlert } from 'lucide-react';
import type { AdminPage, AdminUserRow } from '@/lib/contracts/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface AdminUsersTableProps {
  data: AdminPage<AdminUserRow>;
  onEditRole: (user: AdminUserRow) => void;
  onToggleBan: (user: AdminUserRow) => void;
}

function roleBadgeVariant(role: string) {
  if (role === 'ADMIN') return 'info';
  if (role === 'DEVELOPER') return 'success';
  return 'outline';
}

function banBadgeVariant(banned: boolean) {
  return banned ? 'destructive' : 'success';
}

export function AdminUsersTable({ data, onEditRole, onToggleBan }: AdminUsersTableProps) {
  return (
    <Card className="overflow-hidden rounded-2xl border-border/70">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-surface-strong text-[11px] uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Ban state</th>
              <th className="px-4 py-3">Meta</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {data.items.map((user) => (
              <tr key={user.userId} className="hover:bg-surface/80">
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <p className="font-medium text-main">{user.username}</p>
                    <p className="text-xs text-muted">{user.email}</p>
                    <p className="text-[11px] font-mono text-muted">{user.userId}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={roleBadgeVariant(user.role)}>{user.role}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={banBadgeVariant(user.banned)}>{user.banned ? 'Banned' : 'Active'}</Badge>
                </td>
                <td className="px-4 py-3 text-xs text-muted">
                  {user.banned ? (
                    <div className="space-y-1">
                      <p>{user.banReason ?? 'No reason stored'}</p>
                      <p>By: {user.bannedByUserId ?? 'Unknown'}</p>
                    </div>
                  ) : (
                    <p>{user.createdAt ? new Date(user.createdAt).toLocaleString() : 'Unknown'}</p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEditRole(user)}>
                      <PencilLine className="size-4" />
                      Role
                    </Button>
                    <Button variant={user.banned ? 'secondary' : 'destructive'} size="sm" onClick={() => onToggleBan(user)}>
                      <ShieldAlert className="size-4" />
                      {user.banned ? 'Unban' : 'Ban'}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {!data.items.length ? (
              <tr>
                <td className="px-4 py-10 text-center text-sm text-muted" colSpan={5}>
                  No users found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
