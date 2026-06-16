'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-primitive';
import { Textarea } from '@/components/ui/textarea';
import type { AdminUserRow } from '@/lib/contracts/types';

interface AdminUserBanDialogProps {
  open: boolean;
  user: AdminUserRow | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (reason: string) => Promise<void>;
}

export function AdminUserBanDialog({ open, user, onOpenChange, onSubmit }: AdminUserBanDialogProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    setReason(user?.banned ? user.banReason ?? '' : '');
    setError(null);
  }, [open, user?.banReason, user?.banned]);

  const submit = async () => {
    const normalizedReason = reason.trim();
    if (!normalizedReason) {
      setError('Reason is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(normalizedReason);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ban state');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{user?.banned ? 'Unban user' : 'Ban user'}</DialogTitle>
          <DialogDescription>
            {user?.banned ? 'Restore account access with a reason.' : 'Block account access with a reason.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-6 py-5">
          <FormField label="Reason" error={error ?? undefined} hint="Required for audit history.">
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
          <Button variant={user?.banned ? 'secondary' : 'destructive'} onClick={() => void submit()} isLoading={isSubmitting} type="button">
            {user?.banned ? 'Unban user' : 'Ban user'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
