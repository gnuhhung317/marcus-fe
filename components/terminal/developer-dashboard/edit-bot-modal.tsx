'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { updateBotMetadata } from '@/lib/contracts/client';
import { DeveloperBotDetail } from '@/lib/contracts/types';
import { registerBotSchema, type RegisterBotFormValues } from '@/lib/validations/bot.schema';
import { Form, FormField } from '@/components/ui/form-primitive';

interface EditBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  bot: DeveloperBotDetail;
}

export function EditBotModal({ isOpen, onClose, bot }: EditBotModalProps) {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: RegisterBotFormValues) => {
      return updateBotMetadata(bot.botId, {
        botName: data.botName,
        description: data.description || '',
        exchange: data.exchange,
        tradingPair: data.tradingPair,
      });
    },
    onSuccess: () => {
      router.refresh();
      onClose();
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 cursor-pointer"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface-strong p-8 shadow-[var(--shadow-soft)] backdrop-blur-2xl transition-all duration-300 scale-100 flex flex-col">
        
        <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-primary-soft blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 h-48 w-48 rounded-full bg-info-soft blur-3xl pointer-events-none" />

        <header className="relative flex items-center justify-between pb-5 border-b border-border">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-positive font-semibold">Config Management</span>
            <h3 className="text-xl font-bold text-white tracking-tight mt-1">
              Edit Bot Configuration
            </h3>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <Form<RegisterBotFormValues>
          schema={registerBotSchema}
          onSubmit={(data) => mutation.mutate(data)}
          defaultValues={{
            botName: bot.botName,
            description: bot.description || '',
            exchange: (bot.exchange as any) || 'BINANCE',
            tradingPair: bot.tradingPair || 'BTC/USDT',
          }}
          className="relative mt-6 space-y-5 flex-1"
        >
          {({ register, formState: { errors } }) => (
            <>
              <FormField label="Bot Name" error={errors.botName?.message}>
                <input
                  type="text"
                  placeholder="e.g. BTC_BREAKOUT_BOT"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-positive/50 focus:outline-none focus:ring-1 focus:ring-[var(--primary-soft)] transition-all font-mono"
                  {...register('botName')}
                />
              </FormField>

              <FormField label="Description" error={errors.description?.message}>
                <textarea
                  placeholder="e.g. Algorithmic grid bot running custom Python webhook alerts."
                  rows={3}
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-positive/50 focus:outline-none focus:ring-1 focus:ring-[var(--primary-soft)] transition-all resize-none"
                  {...register('description')}
                />
              </FormField>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Exchange Venue" error={errors.exchange?.message}>
                  <select
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-white focus:border-positive/50 focus:outline-none focus:ring-1 focus:ring-[var(--primary-soft)] transition-all"
                    {...register('exchange')}
                  >
                    <option value="BINANCE">Binance</option>
                    <option value="BYBIT">Bybit</option>
                    <option value="OKX">OKX</option>
                  </select>
                </FormField>

                <FormField label="Trading Pair" error={errors.tradingPair?.message}>
                  <input
                    type="text"
                    placeholder="BTC/USDT"
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-positive/50 focus:outline-none focus:ring-1 focus:ring-[var(--primary-soft)] transition-all font-mono"
                    {...register('tradingPair')}
                  />
                </FormField>
              </div>

              {mutation.isError && (
                <div className="rounded-xl border border-negative/25 bg-negative-soft p-3 text-xs text-negative">
                  {mutation.error.message}
                </div>
              )}

              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl px-5 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="inline-flex items-center justify-center gap-2 rounded-xl cta-primary px-6 py-2.5 text-xs font-bold text-cta-on-primary hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed cursor-pointer"
                >
                  {mutation.isPending ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Updating...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </>
          )}
        </Form>
      </div>
    </div>
  );
}
