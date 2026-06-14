'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBotMutations } from '@/lib/hooks/use-bot-mutations';
import { BotProvisioningCredentials } from '@/lib/contracts/types';
import { registerBotSchema, type RegisterBotFormValues } from '@/lib/validations/bot.schema';

interface RegisterBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBotCreated?: (botId: string) => void;
}

export function RegisterBotModal({ isOpen, onClose, onBotCreated }: RegisterBotModalProps) {
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
          setSubmitError('Unable to generate bot credentials. Please retry.');
        }
      });
    } catch {
      setSubmitError('Unable to generate bot credentials. Please retry.');
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
      <div 
        className="absolute inset-0 bg-black/75 transition-opacity duration-300"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-lg overflow-hidden rounded-lg border border-border bg-surface p-6 sm:p-8 shadow-2xl transition-all duration-300 scale-100 max-h-[90vh] flex flex-col font-mono">

        <header className="relative flex items-center justify-between pb-5 border-b border-border font-sans">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-positive">Signal Gateway</span>
            <h3 className="text-lg font-bold text-white tracking-tight mt-1">
              {credentials ? 'Credentials Generated' : 'Register New Webhook Bot'}
            </h3>
          </div>
          {!credentials && (
            <button 
              onClick={handleClose}
              className="rounded p-1.5 text-slate-400 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </header>

        <div className="relative mt-6 overflow-y-auto pr-1 flex-1">
          {!credentials ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 font-sans">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bot Name</label>
                <input
                  type="text"
                  placeholder="e.g. BTC_BREAKOUT_BOT"
                  className="w-full rounded border border-border bg-surface px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-primary focus:outline-none transition-all font-mono"
                  {...register('botName')}
                />
                {errors.botName && (
                  <p className="mt-1 text-xs text-negative font-mono">{errors.botName.message}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Exchange Venue</label>
                  <select
                    className="w-full rounded border border-border bg-surface px-4 py-3 text-sm text-white focus:border-primary focus:outline-none transition-all font-sans"
                    {...register('exchange')}
                  >
                    <option value="BINANCE">Binance</option>
                    <option value="BYBIT">Bybit</option>
                    <option value="OKX">OKX</option>
                  </select>
                  {errors.exchange && (
                    <p className="mt-1 text-xs text-negative font-mono">{errors.exchange.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Trading Pair</label>
                  <input
                    type="text"
                    placeholder="BTC/USDT"
                    className="w-full rounded border border-border bg-surface px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-primary focus:outline-none transition-all font-mono"
                    {...register('tradingPair')}
                  />
                  {errors.tradingPair && (
                    <p className="mt-1 text-xs text-negative font-mono">{errors.tradingPair.message}</p>
                  )}
                </div>
              </div>

              {submitError && (
                <div className="rounded border border-negative/20 bg-negative/5 p-3 text-xs text-negative font-mono">
                  {submitError}
                </div>
              )}

              <div className="pt-4 border-t border-border flex items-center justify-end gap-3 font-sans">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded border border-primary bg-primary text-black px-5 py-2 text-xs font-bold hover:bg-primary/95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Provisioning...
                    </>
                  ) : (
                    'Provision Credentials'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="rounded border border-warning/20 bg-warning/5 p-4 flex gap-3 font-sans">
                <svg className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-warning uppercase tracking-wider">Warning: One-Time Secret</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    For security reasons, your **Signing Secret** will not be accessible once this window is closed. Please copy and store it securely immediately.
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="flex justify-between items-center mb-1 font-sans">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Bot ID</span>
                  <button 
                    onClick={() => handleCopy('botId', credentials.botId)}
                    className="text-[10px] font-bold text-positive hover:text-positive transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {copiedField === 'botId' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="w-full rounded border border-border bg-surface px-4 py-2.5 text-xs text-white select-all break-all pr-12">
                  {credentials.botId}
                </div>
              </div>

              <div className="relative group">
                <div className="flex justify-between items-center mb-1 font-sans">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Public API Key</span>
                  <button 
                    onClick={() => handleCopy('apiKey', credentials.apiKey)}
                    className="text-[10px] font-bold text-positive hover:text-positive transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {copiedField === 'apiKey' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="w-full rounded border border-border bg-surface px-4 py-2.5 text-xs text-white select-all break-all pr-12">
                  {credentials.apiKey}
                </div>
              </div>

              <div className="relative group">
                <div className="flex justify-between items-center mb-1 font-sans">
                  <span className="text-[9px] font-bold text-positive uppercase tracking-wider">Signing Secret (rawSecret)</span>
                  <button 
                    onClick={() => handleCopy('rawSecret', credentials.rawSecret)}
                    className="text-[10px] font-bold text-positive hover:text-positive transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {copiedField === 'rawSecret' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="w-full rounded border border-positive/30 bg-positive/5 px-4 py-3 text-xs text-positive select-all break-all pr-12">
                  {credentials.rawSecret}
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end font-sans">
                <button
                  onClick={handleDone}
                  className="rounded bg-positive px-5 py-2.5 text-xs font-bold text-black hover:bg-positive/90 transition-all cursor-pointer uppercase tracking-wider"
                >
                  Done & Connect Bot
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
