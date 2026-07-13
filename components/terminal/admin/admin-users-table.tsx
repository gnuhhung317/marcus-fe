'use client';

import { PencilLine, ShieldAlert } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
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
  const t = useTranslations('Admin.Users.table');
  const tRoles = useTranslations('Common.roles');
  const tUserStatus = useTranslations('Common.userStatus');
  const tCommon = useTranslations('Common.labels');
  const formatter = useFormatter();

  return (
    <Card className="overflow-hidden rounded-2xl border-border/70">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-surface-strong text-[11px] uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="px-4 py-3">{t('user')}</th>
              <th className="px-4 py-3">{t('role')}</th>
              <th className="px-4 py-3">{t('banState')}</th>
              <th className="px-4 py-3">{t('meta')}</th>
              <th className="px-4 py-3 text-right">{t('actions')}</th>
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
                  <Badge variant={roleBadgeVariant(user.role)}>{tRoles(user.role)}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={banBadgeVariant(user.banned)}>{user.banned ? tUserStatus('banned') : tUserStatus('active')}</Badge>
                </td>
                <td className="px-4 py-3 text-xs text-muted">
                  {user.banned ? (
                    <div className="space-y-1">
                      <p>{user.banReason ?? t('noReasonStored')}</p>
                      <p>
                        {tCommon('by')}: {user.bannedByUserId ?? t('unknown')}
                      </p>
                    </div>
                  ) : (
                    <p>{user.createdAt ? formatter.dateTime(new Date(user.createdAt), { dateStyle: 'medium', timeStyle: 'short' }) : t('unknown')}</p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEditRole(user)}>
                      <PencilLine className="size-4" />
                      {t('roleButton')}
                    </Button>
                    <Button variant={user.banned ? 'secondary' : 'destructive'} size="sm" onClick={() => onToggleBan(user)}>
                      <ShieldAlert className="size-4" />
                      {user.banned ? t('unbanButton') : t('banButton')}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {!data.items.length ? (
              <tr>
                <td className="px-4 py-10 text-center text-sm text-muted" colSpan={5}>
                  {t('noUsersFound')}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
