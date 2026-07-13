'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useBotMutations } from '@/lib/hooks/use-bot-mutations';
import { DeveloperBotDetail } from '@/lib/contracts/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface DeleteBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  bot: DeveloperBotDetail;
  activeSubscribersCount: number;
}

export function DeleteBotModal({ isOpen, onClose, bot, activeSubscribersCount }: DeleteBotModalProps) {
  const router = useRouter();
  const t = useTranslations('DeveloperDashboard.deleteModal');
  const [confirmName, setConfirmName] = useState('');
  const { removeBot } = useBotMutations();

  useEffect(() => {
    setConfirmName('');
  }, [isOpen, bot.botId, bot.botName]);

  if (!isOpen) return null;

  const isConfirmed = confirmName.trim() === bot.botName.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfirmed) return;

    removeBot.mutate(bot.botId, {
      onSuccess: () => {
        onClose();
        router.push('/terminal/developer-dashboard');
        router.refresh();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-negative/20 bg-negative-soft text-negative">
              <Trash2 className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-negative">{t('dangerZone')}</p>
              <DialogTitle>{t('title')}</DialogTitle>
              <DialogDescription>{t('description')}</DialogDescription>
            </div>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-lg text-muted hover:bg-surface hover:text-main">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          <p className="text-sm leading-relaxed text-muted">
            {t('confirmPrompt', { botName: bot.botName })}
          </p>

          {activeSubscribersCount > 0 ? (
            <div className="flex gap-3 rounded-xl border border-warning/20 bg-warning-soft px-4 py-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
              <div className="space-y-1">
                <Badge variant="warning" className="rounded-lg px-2.5 py-1 text-[10px]">
                  {t('activeSubscribersBadge')}
                </Badge>
                <p className="text-xs leading-relaxed text-muted">
                  {t('activeSubscribersMessage', { count: activeSubscribersCount })}
                </p>
              </div>
            </div>
          ) : null}

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted">
              {t('typeNamePrompt')} <span className="select-none font-mono text-negative">{bot.botName}</span>
            </label>
            <Input
              type="text"
              required
              placeholder={bot.botName}
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              autoComplete="off"
              className="font-mono"
            />
          </div>

          {removeBot.isError ? (
            <div className="rounded-xl border border-negative/20 bg-negative-soft px-3 py-3 text-xs text-negative">
              {removeBot.error.message}
            </div>
          ) : null}

          <DialogFooter className="px-0 pb-0">
            <Button type="button" variant="outline" onClick={onClose} className="h-10 px-4 text-xs font-bold uppercase tracking-wider">
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              variant="danger"
              isLoading={removeBot.isPending}
              disabled={!isConfirmed}
              className="h-10 px-5 text-xs font-bold uppercase tracking-wider"
            >
              {t('confirm')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
