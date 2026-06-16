'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, PencilLine, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-primitive';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/providers/toast-provider';
import { AdminPage, AdminUserRole, AdminUserRow } from '@/lib/contracts/types';
import { updateAdminUserBan, updateAdminUserRole } from '@/lib/services/admin.service';

interface AdminUsersClientProps {
  data: AdminPage<AdminUserRow>;
  filters: {
    query?: string;
    role?: string;
    banned?: string;
    page: number;
    size: number;
  };
}

function roleBadgeVariant(role: string) {
  if (role === 'ADMIN') return 'info';
  if (role === 'DEVELOPER') return 'success';
  return 'outline';
}

function banBadgeVariant(banned: boolean) {
  return banned ? 'destructive' : 'success';
}

export function AdminUsersClient({ data, filters }: AdminUsersClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { pushToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(filters.query ?? '');
  const [role, setRole] = useState(filters.role ?? '');
  const [banned, setBanned] = useState(filters.banned ?? '');

  const [roleDialogUser, setRoleDialogUser] = useState<AdminUserRow | null>(null);
  const [roleDialogRole, setRoleDialogRole] = useState<AdminUserRole>('TRADER');
  const [roleDialogReason, setRoleDialogReason] = useState('');
  const [roleDialogError, setRoleDialogError] = useState<string | null>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [roleSubmitting, setRoleSubmitting] = useState(false);

  const [banDialogUser, setBanDialogUser] = useState<AdminUserRow | null>(null);
  const [banDialogReason, setBanDialogReason] = useState('');
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [banSubmitting, setBanSubmitting] = useState(false);
  const [banDialogError, setBanDialogError] = useState<string | null>(null);

  useEffect(() => {
    setQuery(filters.query ?? '');
    setRole(filters.role ?? '');
    setBanned(filters.banned ?? '');
  }, [filters.banned, filters.query, filters.role]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(data.totalElements / data.size));
  }, [data.size, data.totalElements]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '0');
    params.set('size', String(filters.size));

    if (query.trim()) params.set('query', query.trim());
    else params.delete('query');

    if (role) params.set('role', role);
    else params.delete('role');

    if (banned) params.set('banned', banned);
    else params.delete('banned');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const openRoleDialog = (user: AdminUserRow) => {
    setRoleDialogUser(user);
    setRoleDialogRole((user.role === 'TRADER' ? 'DEVELOPER' : 'TRADER') as AdminUserRole);
    setRoleDialogReason('');
    setRoleDialogError(null);
    setRoleDialogOpen(true);
  };

  const submitRoleChange = async () => {
    if (!roleDialogUser) return;
    const normalizedReason = roleDialogReason.trim();
    if (!normalizedReason) {
      setRoleDialogError('Reason is required');
      return;
    }

    setRoleSubmitting(true);
    try {
      await updateAdminUserRole(roleDialogUser.userId, { role: roleDialogRole, reason: normalizedReason });
      pushToast({ title: 'Role updated', message: `${roleDialogUser.username} is now ${roleDialogRole}.`, tone: 'success' });
      setRoleDialogOpen(false);
      router.refresh();
    } catch (error) {
      setRoleDialogError(error instanceof Error ? error.message : 'Failed to update role');
    } finally {
      setRoleSubmitting(false);
    }
  };

  const openBanDialog = (user: AdminUserRow) => {
    setBanDialogUser(user);
    setBanDialogReason(user.banned ? user.banReason ?? '' : '');
    setBanDialogError(null);
    setBanDialogOpen(true);
  };

  const submitBanChange = async () => {
    if (!banDialogUser) return;
    const normalizedReason = banDialogReason.trim();
    if (!normalizedReason) {
      setBanDialogError('Reason is required');
      return;
    }

    setBanSubmitting(true);
    try {
      await updateAdminUserBan(banDialogUser.userId, { banned: !banDialogUser.banned, reason: normalizedReason });
      pushToast({
        title: banDialogUser.banned ? 'User unbanned' : 'User banned',
        message: banDialogUser.username,
        tone: 'success',
      });
      setBanDialogOpen(false);
      router.refresh();
    } catch (error) {
      setBanDialogError(error instanceof Error ? error.message : 'Failed to update ban state');
    } finally {
      setBanSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-border/70 p-4">
        <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr_0.8fr_auto]">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search username, email, or user id" />
          <Select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">All roles</option>
            <option value="ADMIN">Admin</option>
            <option value="TRADER">Trader</option>
            <option value="DEVELOPER">Developer</option>
          </Select>
          <Select value={banned} onChange={(e) => setBanned(e.target.value)}>
            <option value="">All users</option>
            <option value="true">Banned</option>
            <option value="false">Active</option>
          </Select>
          <Button onClick={applyFilters} isLoading={isPending}>Filter</Button>
        </div>
      </Card>

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
                      <Button variant="outline" size="sm" onClick={() => openRoleDialog(user)}>
                        <PencilLine className="size-4" />
                        Role
                      </Button>
                      <Button variant={user.banned ? 'secondary' : 'destructive'} size="sm" onClick={() => openBanDialog(user)}>
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

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">
          Page {data.page + 1} of {totalPages} · {data.totalElements} users
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

      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Change role</DialogTitle>
            <DialogDescription>
              Update the account role for {roleDialogUser?.username ?? 'selected user'}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-6 py-5">
            <FormField label="Role">
              <Select value={roleDialogRole} onChange={(e) => setRoleDialogRole(e.target.value as AdminUserRole)}>
                <option value="TRADER">Trader</option>
                <option value="DEVELOPER">Developer</option>
              </Select>
            </FormField>
            <FormField label="Reason" error={roleDialogError ?? undefined}>
              <Textarea value={roleDialogReason} onChange={(e) => setRoleDialogReason(e.target.value)} rows={4} />
            </FormField>
            {roleDialogError ? (
              <p className="text-sm text-negative" role="alert">
                {roleDialogError}
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>Cancel</Button>
            <Button isLoading={roleSubmitting} onClick={submitRoleChange}>Update role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{banDialogUser?.banned ? 'Unban user' : 'Ban user'}</DialogTitle>
            <DialogDescription>
              {banDialogUser?.banned ? 'Restore account access with a reason.' : 'Block account access with a reason.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-6 py-5">
            <FormField label="Reason" error={banDialogError ?? undefined} hint="Required for audit history.">
              <Textarea value={banDialogReason} onChange={(e) => setBanDialogReason(e.target.value)} rows={4} />
            </FormField>
            {banDialogError ? (
              <p className="text-sm text-negative" role="alert">
                {banDialogError}
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setBanDialogOpen(false)}>Cancel</Button>
            <Button variant={banDialogUser?.banned ? 'secondary' : 'destructive'} isLoading={banSubmitting} onClick={submitBanChange}>
              {banDialogUser?.banned ? 'Unban user' : 'Ban user'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
