'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { FormField } from '@/components/ui/form-primitive';
import { Textarea } from '@/components/ui/textarea';
import type { AdminUserRow } from '@/lib/contracts/types';
import { ADMIN_ASSIGNABLE_USER_ROLES, isAssignableAdminUserRole, type AdminAssignableUserRole } from '@/lib/validations/admin.schema';

interface AdminUserRoleDialogProps {
  open: boolean;
  user: AdminUserRow | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: { role: AdminAssignableUserRole; reason: string }) => Promise<void>;
}

function getDefaultRole(currentRole?: string): AdminAssignableUserRole {
  if (currentRole === 'TRADER') return 'DEVELOPER';
  return 'TRADER';
}

export function AdminUserRoleDialog({ open, user, onOpenChange, onSubmit }: AdminUserRoleDialogProps) {
  const [role, setRole] = useState<AdminAssignableUserRole>('TRADER');
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    setRole(getDefaultRole(user?.role));
    setReason('');
    setError(null);
  }, [open, user?.role]);

  const submit = async () => {
    const normalizedReason = reason.trim();
    if (!normalizedReason) {
      setError('Reason is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({ role, reason: normalizedReason });
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Change role</DialogTitle>
          <DialogDescription>Update the account role for {user?.username ?? 'selected user'}.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-6 py-5">
          <FormField label="Role">
            <Select
              value={role}
              onChange={(event) => {
                if (isAssignableAdminUserRole(event.target.value)) {
                  setRole(event.target.value);
                }
              }}
            >
              {ADMIN_ASSIGNABLE_USER_ROLES.map((item) => (
                <option key={item} value={item}>
                  {item === 'TRADER' ? 'Trader' : 'Developer'}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Reason" error={error ?? undefined}>
            <Textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={4} />
          </FormField>

          {error ? (
            <p className="text-sm text-negative" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
            Cancel
          </Button>
          <Button variant="primary" onClick={() => void submit()} isLoading={isSubmitting} type="button">
            Update role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
