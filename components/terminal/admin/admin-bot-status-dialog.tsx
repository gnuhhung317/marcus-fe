'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { FormField } from '@/components/ui/form-primitive';
import { Textarea } from '@/components/ui/textarea';
import type { AdminBotRow } from '@/lib/contracts/types';
import { ADMIN_BOT_STATUSES, isAdminBotStatus } from '@/lib/validations/admin.schema';

type AdminBotStatusTarget = Pick<AdminBotRow, 'botId' | 'name' | 'status'>;

interface AdminBotStatusDialogProps {
  open: boolean;
  bot: AdminBotStatusTarget | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: { status: AdminBotRow['status']; reason: string; cancelActiveSubscriptions: boolean }) => Promise<void>;
}

export function AdminBotStatusDialog({ open, bot, onOpenChange, onSubmit }: AdminBotStatusDialogProps) {
  const t = useTranslations('Admin.Bots.detail.statusDialog');
  const tStatus = useTranslations('Common.botStatus');
  const [status, setStatus] = useState<AdminBotRow['status']>('PAUSED');
  const [reason, setReason] = useState('');
  const [cancelActiveSubscriptions, setCancelActiveSubscriptions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    setStatus(bot?.status ?? 'PAUSED');
    setReason('');
    setCancelActiveSubscriptions(false);
    setError(null);
  }, [bot?.status, open]);

  const submit = async () => {
    const normalizedReason = reason.trim();
    if (!normalizedReason) {
      setError(t('requiredReason'));
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({ status, reason: normalizedReason, cancelActiveSubscriptions });
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
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description', { botName: bot?.name ?? t('selectedBot') })}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-6 py-5">
          <FormField label={t('statusLabel')}>
            <Select
              value={status}
              onChange={(event) => {
                if (isAdminBotStatus(event.target.value)) {
                  setStatus(event.target.value);
                }
              }}
            >
              {ADMIN_BOT_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {tStatus(item)}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label={t('reasonLabel')} error={error ?? undefined}>
            <Textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={4} />
          </FormField>

          <label className="flex items-start gap-3 rounded-xl border border-border/60 bg-surface/70 px-4 py-3 text-sm text-main">
            <input
              type="checkbox"
              checked={cancelActiveSubscriptions}
              onChange={(event) => setCancelActiveSubscriptions(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-border bg-surface text-primary"
            />
            <span>
              {t('cancelActiveSubscriptions')}
              <span className="block text-xs text-muted">{t('cancelActiveSubscriptionsHint')}</span>
            </span>
          </label>

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
          <Button onClick={() => void submit()} isLoading={isSubmitting} type="button">
            {t('submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
