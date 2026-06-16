'use client';

import { useEffect, useState } from 'react';
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
      setError('Reason is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(normalized);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
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
          <FormField label="Reason" error={error ?? undefined} hint="Required for audit history.">
            <Textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={4}
              placeholder="Enter the reason"
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
            Cancel
          </Button>
          <Button variant={destructive ? 'destructive' : 'primary'} isLoading={isSubmitting} onClick={handleSubmit} type="button">
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
