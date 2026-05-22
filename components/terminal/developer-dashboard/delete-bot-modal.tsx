'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { deleteBot } from '@/lib/contracts/client';
import { DeveloperBotDetail } from '@/lib/contracts/types';

interface DeleteBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  bot: DeveloperBotDetail;
  activeSubscribersCount: number;
}

export function DeleteBotModal({ isOpen, onClose, bot, activeSubscribersCount }: DeleteBotModalProps) {
  const router = useRouter();
  const [confirmName, setConfirmName] = useState('');

  // Clear input when modal opens/closes or bot changes
  useEffect(() => {
    setConfirmName('');
  }, [isOpen, bot]);

  const mutation = useMutation({
    mutationFn: async () => {
      return deleteBot(bot.botId);
    },
    onSuccess: () => {
      onClose();
      // Route back to main dashboard page to select first remaining bot or empty state
      router.push('/terminal/developer-dashboard');
      router.refresh();
    },
  });

  if (!isOpen) return null;

  const isConfirmed = confirmName.trim() === bot.botName.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isConfirmed) {
      mutation.mutate();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300 cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[var(--negative-soft)] bg-[rgba(15,10,10,0.95)] p-8 shadow-[var(--shadow-soft)] backdrop-blur-2xl transition-all duration-300 scale-100 flex flex-col">
        
        {/* Glow effect */}
        <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-[var(--negative-soft)] blur-3xl pointer-events-none" />

        {/* Header */}
        <header className="relative flex items-center gap-3 pb-5 border-b border-white/5">
          <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 flex-shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-rose-500 font-semibold">Danger Zone</span>
            <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
              Delete Webhook Bot
            </h3>
          </div>
        </header>

        {/* Content body */}
        <form onSubmit={handleSubmit} className="relative mt-6 space-y-5 flex-1">
          <p className="text-xs text-slate-400 leading-relaxed">
            Are you sure you want to permanently delete <span className="text-white font-semibold font-mono">{bot.botName}</span>? This action is irreversible. All provisioned credentials and integration webhook paths will stop functioning immediately.
          </p>

          {activeSubscribersCount > 0 && (
            <div className="rounded-xl border border-rose-500/25 bg-rose-950/20 p-3.5 flex gap-2.5">
              <svg className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">Warning: Active Subscribers</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  This bot has **{activeSubscribersCount} active subscriber connection(s)**. Deleting it will disconnect those terminals instantly.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Type the bot name to confirm: <span className="text-rose-400 font-mono select-none">{bot.botName}</span>
            </label>
            <input
              type="text"
              required
              placeholder={bot.botName}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-rose-500/50 focus:outline-none focus:ring-1 focus:ring-rose-500/50 transition-all font-mono"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              autoComplete="off"
            />
          </div>

          {mutation.isError && (
            <div className="rounded-xl border border-[var(--negative-soft)] bg-[var(--negative-soft)] p-3 text-xs text-negative">
              {mutation.error instanceof Error ? mutation.error.message : 'Unable to delete bot. Please retry.'}
            </div>
          )}

          <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-5 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isConfirmed || mutation.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white px-6 py-2.5 text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-[0_0_12px_rgba(244,63,94,0.15)]"
            >
              {mutation.isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Deleting...
                </>
              ) : (
                'Permanently Delete'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
