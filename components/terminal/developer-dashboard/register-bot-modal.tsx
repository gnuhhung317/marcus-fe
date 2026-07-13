'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useBotMutations } from '@/lib/hooks/use-bot-mutations';
import { BotProvisioningCredentials } from '@/lib/contracts/types';
import { createRegisterBotSchema, type RegisterBotFormValues } from '@/lib/validations/bot.schema';

interface RegisterBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBotCreated?: (botId: string) => void;
}

export function RegisterBotModal({ isOpen, onClose, onBotCreated }: RegisterBotModalProps) {
  const t = useTranslations('DeveloperDashboard.registerBot');
  const tValidation = useTranslations('Common.validation');
  const registerBotSchema = createRegisterBotSchema(tValidation);
  const [credentials, setCredentials] = useState<BotProvisioningCredentials | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const { registerBot } = useBotMutations();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterBotFormValues>({
    resolver: zodResolver(registerBotSchema),
    defaultValues: {
      botName: 'MARCUS_SIGNAL_BRIDGE',
      exchange: 'BINANCE',
      tradingPair: 'BTC/USDT',
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: RegisterBotFormValues) => {
    try {
      setSubmitError(null);
      registerBot.mutate(data, {
        onSuccess: (result) => {
          setCredentials(result);
        },
        onError: () => {
          setSubmitError(t('errors.generateFailed'));
        },
      });
    } catch {
      setSubmitError(t('errors.generateFailed'));
    }
  };

  const handleCopy = (field: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDone = () => {
    if (credentials?.botId) {
      onBotCreated?.(credentials.botId);
    }
    setCredentials(null);
    reset();
    onClose();
  };

  const handleClose = () => {
    if (!credentials) {
      reset();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-canvas/80 backdrop-blur-sm transition-opacity duration-300" onClick={handleClose} />

      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-lg border border-border bg-surface p-6 font-mono shadow-2xl transition-all duration-300 sm:p-8">
        <header className="relative flex items-center justify-between border-b border-border pb-5 font-sans">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-positive">{t('eyebrow')}</span>
            <h3 className="mt-1 text-lg font-bold tracking-tight text-main">
              {credentials ? t('credentialsGenerated') : t('title')}
            </h3>
          </div>
          {!credentials && (
            <button
              onClick={handleClose}
              className="cursor-pointer rounded p-1.5 text-muted transition-colors hover:bg-surface-strong hover:text-main"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </header>

        <div className="relative mt-6 flex-1 overflow-y-auto pr-1">
          {!credentials ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 font-sans">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">{t('form.botName')}</label>
                <input
                  type="text"
                  placeholder={t('form.botNamePlaceholder')}
                  className="w-full rounded border border-border bg-surface px-4 py-3 text-sm text-main placeholder:text-muted outline-none transition-all focus:border-primary font-mono"
                  {...register('botName')}
                />
                {errors.botName && <p className="mt-1 text-xs font-mono text-negative">{errors.botName.message}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">{t('form.exchange')}</label>
                  <select
                    className="w-full rounded border border-border bg-surface px-4 py-3 text-sm text-main outline-none transition-all focus:border-primary font-sans"
                    {...register('exchange')}
                  >
                    <option value="BINANCE">{t('venues.binance')}</option>
                    <option value="BYBIT">{t('venues.bybit')}</option>
                    <option value="OKX">{t('venues.okx')}</option>
                  </select>
                  {errors.exchange && <p className="mt-1 text-xs font-mono text-negative">{errors.exchange.message}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">{t('form.tradingPair')}</label>
                  <input
                    type="text"
                    placeholder={t('form.tradingPairPlaceholder')}
                    className="w-full rounded border border-border bg-surface px-4 py-3 text-sm text-main placeholder:text-muted outline-none transition-all focus:border-primary font-mono"
                    {...register('tradingPair')}
                  />
                  {errors.tradingPair && <p className="mt-1 text-xs font-mono text-negative">{errors.tradingPair.message}</p>}
                </div>
              </div>

              {submitError && <div className="rounded border border-negative/20 bg-negative/5 p-3 text-xs font-mono text-negative">{submitError}</div>}

              <div className="flex items-center justify-end gap-3 border-t border-border pt-4 font-sans">
                <button
                  type="button"
                  onClick={handleClose}
                  className="cursor-pointer rounded px-4 py-2 text-xs font-bold text-muted transition-colors hover:text-main"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer inline-flex items-center justify-center gap-2 rounded border border-primary bg-primary px-5 py-2 text-xs font-bold text-background transition-all hover:bg-primary/95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="h-4 w-4 -ml-1 mr-2 animate-spin text-background" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {t('provisioning')}
                    </>
                  ) : (
                    t('submit')
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex gap-3 rounded border border-warning/20 bg-warning/5 p-4 font-sans">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-warning">{t('warningTitle')}</h4>
                  <p className="text-[11px] leading-relaxed text-muted">
                    {t('warningBody')}
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="mb-1 flex items-center justify-between font-sans">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted">{t('botId')}</span>
                  <button
                    onClick={() => handleCopy('botId', credentials.botId)}
                    className="cursor-pointer flex items-center gap-1 text-[10px] font-bold text-positive transition-colors hover:text-positive/90"
                  >
                    {copiedField === 'botId' ? t('copied') : t('copy')}
                  </button>
                </div>
                <div className="w-full select-all break-all rounded border border-border bg-surface px-4 py-2.5 pr-12 text-xs text-main">
                  {credentials.botId}
                </div>
              </div>

              <div className="relative group">
                <div className="mb-1 flex items-center justify-between font-sans">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted">{t('apiKey')}</span>
                  <button
                    onClick={() => handleCopy('apiKey', credentials.apiKey)}
                    className="cursor-pointer flex items-center gap-1 text-[10px] font-bold text-positive transition-colors hover:text-positive/90"
                  >
                    {copiedField === 'apiKey' ? t('copied') : t('copy')}
                  </button>
                </div>
                <div className="w-full select-all break-all rounded border border-border bg-surface px-4 py-2.5 pr-12 text-xs text-main">
                  {credentials.apiKey}
                </div>
              </div>

              <div className="relative group">
                <div className="mb-1 flex items-center justify-between font-sans">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-positive">{t('rawSecret')}</span>
                  <button
                    onClick={() => handleCopy('rawSecret', credentials.rawSecret)}
                    className="cursor-pointer flex items-center gap-1 text-[10px] font-bold text-positive transition-colors hover:text-positive/90"
                  >
                    {copiedField === 'rawSecret' ? t('copied') : t('copy')}
                  </button>
                </div>
                <div className="w-full select-all break-all rounded border border-positive/30 bg-positive/5 px-4 py-3 pr-12 text-xs text-positive">
                  {credentials.rawSecret}
                </div>
              </div>

              <div className="flex items-center justify-end border-t border-border pt-4 font-sans">
                <button
                  onClick={handleDone}
                  className="cursor-pointer rounded bg-positive px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-background transition-all hover:bg-positive/90"
                >
                  {t('done')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
