'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('Admin.Users.dialogs.ban');
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
      setError(t('requiredReason'));
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(normalizedReason);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{user?.banned ? t('titleUnban') : t('titleBan')}</DialogTitle>
          <DialogDescription>
            {user?.banned ? t('descriptionUnban') : t('descriptionBan')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-6 py-5">
          <FormField label={t('reasonLabel')} error={error ?? undefined} hint={t('hint')}>
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
            {t('cancel')}
          </Button>
          <Button variant={user?.banned ? 'secondary' : 'destructive'} onClick={() => void submit()} isLoading={isSubmitting} type="button">
            {user?.banned ? t('submitUnban') : t('submitBan')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
