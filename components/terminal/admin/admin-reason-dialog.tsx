'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/ui/form-primitive';

interface AdminReasonDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (reason: string) => Promise<void> | void;
  destructive?: boolean;
  defaultReason?: string;
}

export function AdminReasonDialog({
  open,
  title,
  description,
  confirmLabel,
  onOpenChange,
  onSubmit,
  destructive = true,
  defaultReason = '',
}: AdminReasonDialogProps) {
  const t = useTranslations('Admin.Bots.detail.reasonDialog');
  const [reason, setReason] = useState(defaultReason);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setReason(defaultReason);
      setError(null);
    }
  }, [defaultReason, open]);

  const handleSubmit = async () => {
    const normalized = reason.trim();
    if (!normalized) {
      setError(t('requiredReason'));
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(normalized);
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
        <div>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="mt-1">{description}</DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-4 px-6 py-5">
          <FormField label={t('reasonLabel')} error={error ?? undefined} hint={t('hint')}>
            <Textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={4}
              placeholder={t('placeholder')}
            />
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
          <Button variant={destructive ? 'destructive' : 'primary'} isLoading={isSubmitting} onClick={handleSubmit} type="button">
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
