'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { updateBotMetadata } from '@/lib/contracts/client';
import { DeveloperBotDetail } from '@/lib/contracts/types';

interface EditBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  bot: DeveloperBotDetail;
}

export function EditBotModal({ isOpen, onClose, bot }: EditBotModalProps) {
  const router = useRouter();
  const [botName, setBotName] = useState(bot.botName);
  const [description, setDescription] = useState(bot.description || '');
  const [exchange, setExchange] = useState<'BINANCE' | 'BYBIT' | 'OKX'>((bot.exchange as any) || 'BINANCE');
  const [tradingPair, setTradingPair] = useState(bot.tradingPair || 'BTC/USDT');

  useEffect(() => {
    setBotName(bot.botName);
    setDescription(bot.description || '');
    setExchange((bot.exchange as any) || 'BINANCE');
    setTradingPair(bot.tradingPair || 'BTC/USDT');
  }, [bot]);

  const mutation = useMutation({
    mutationFn: async () => {
      return updateBotMetadata(bot.botId, {
        botName,
        description,
        exchange,
        tradingPair,
      });
    },
    onSuccess: () => {
      router.refresh();
      onClose();
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--panel-border)] bg-[var(--panel-strong)] p-8 shadow-[var(--shadow-soft)] backdrop-blur-2xl transition-all duration-300 scale-100 flex flex-col">
        
        {/* Glow effect */}
        <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-[var(--primary-soft)] blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 h-48 w-48 rounded-full bg-[var(--info-soft)] blur-3xl pointer-events-none" />

        {/* Header */}
        <header className="relative flex items-center justify-between pb-5 border-b border-[var(--panel-border)]">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-400 font-semibold">Config Management</span>
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

        {/* Content body */}
        <form onSubmit={handleSubmit} className="relative mt-6 space-y-5 flex-1">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Bot Name</label>
            <input
              type="text"
              required
              placeholder="e.g. BTC_BREAKOUT_BOT"
              className="w-full rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-[var(--primary-soft)] transition-all font-mono"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</label>
            <textarea
              placeholder="e.g. Algorithmic grid bot running custom Python webhook alerts."
              rows={3}
              className="w-full rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-[var(--primary-soft)] transition-all resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Exchange Venue</label>
              <select
                className="w-full rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] px-4 py-3 text-sm text-white focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-[var(--primary-soft)] transition-all"
                value={exchange}
                onChange={(e) => setExchange(e.target.value as any)}
              >
                <option value="BINANCE">Binance</option>
                <option value="BYBIT">Bybit</option>
                <option value="OKX">OKX</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Trading Pair</label>
              <input
                type="text"
                required
                placeholder="BTC/USDT"
                className="w-full rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-[var(--primary-soft)] transition-all font-mono"
                value={tradingPair}
                onChange={(e) => setTradingPair(e.target.value)}
              />
            </div>
          </div>

          {mutation.isError && (
            <div className="rounded-xl border border-[var(--negative-soft)] bg-[var(--negative-soft)] p-3 text-xs text-negative">
              {mutation.error instanceof Error ? mutation.error.message : 'Unable to update bot configuration. Please retry.'}
            </div>
          )}

          <div className="pt-4 border-t border-[var(--panel-border)] flex items-center justify-end gap-3">
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
        </form>
      </div>
    </div>
  );
}
