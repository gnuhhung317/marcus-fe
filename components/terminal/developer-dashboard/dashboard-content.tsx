'use client';

import { useState } from 'react';
import { BotDetailCard } from './bot-detail-card';
import { DeveloperBotList } from './developer-bot-list';
import { RegisterBotModal } from './register-bot-modal';
import { DeveloperBotSummary, DeveloperBotDetail, DeveloperSubscriptionSummary } from '../../../lib/contracts/types';

interface DashboardContentProps {
  bots: DeveloperBotSummary[];
  activeBot: DeveloperBotDetail | null;
  subscriptions: DeveloperSubscriptionSummary[];
}

export function DashboardContent({ bots, activeBot, subscriptions }: DashboardContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasBots = bots && bots.length > 0;

  return (
    <div className="relative space-y-8 min-h-screen">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-emerald-500/[0.02] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/[0.01] rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">Developer Console</p>
          <h1 className="mt-2 text-3xl font-extrabold text-white tracking-tight">Developer Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">Manage your API integrations, provision webhook bots, and monitor signal channels in real-time.</p>
        </div>
        {hasBots && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-2.5 text-sm font-bold text-black hover:bg-emerald-300 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-[0_0_24px_rgba(52,211,153,0.2)]"
          >
            <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Register New Bot
          </button>
        )}
      </header>

      {/* Main Content */}
      {!hasBots ? (
        /* Empty State / Onboarding Workspace */
        <div className="glass-strong rounded-2xl p-8 sm:p-12 shadow-[var(--shadow-soft)] relative overflow-hidden flex flex-col items-center justify-center text-center max-w-4xl mx-auto my-6 border border-white/5">
          {/* Decorative glowing background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-82 h-82 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Centered Graphic Icon */}
          <div className="w-20 h-20 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_24px_rgba(16,185,129,0.06)] relative mb-8">
            <svg className="w-10 h-10 text-emerald-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight mb-3">No Webhook Bots Registered</h2>
          <p className="text-slate-400 max-w-lg mb-8 text-sm leading-relaxed">
            Connect your automated trading system, scripts, or TradingView Pine Script alerts to the Marcus Trading signal router. Provision a new bot to receive your API credentials.
          </p>

          {/* Onboarding Steps Timeline */}
          <div className="grid gap-6 md:grid-cols-3 max-w-3xl w-full text-left mb-10 border-t border-white/5 pt-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">1</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Bot Metadata</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Specify your exchange venue (Binance, Bybit, etc.) and custom execution pair.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">2</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Issue Secrets</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Retrieve a cryptographically signed API key and display secret.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">3</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Post Signals</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Configure your algorithmic strategy to stream JSON signals to our webhooks.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 py-3 text-sm font-bold text-black hover:bg-emerald-300 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-[0_0_24px_rgba(52,211,153,0.2)]"
          >
            <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Register Your First Bot
          </button>
        </div>
      ) : (
        /* Two-column layout */
        <div className="grid gap-6 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr] items-start">
          <aside className="w-full lg:sticky lg:top-8">
            <DeveloperBotList bots={bots} activeBotId={activeBot?.botId || ''} />
          </aside>
          <main className="w-full min-w-0">
            {activeBot && (
              <BotDetailCard bot={activeBot} subscriptions={subscriptions} />
            )}
          </main>
        </div>
      )}

      {/* Slide-over/Dialog Modal */}
      <RegisterBotModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
