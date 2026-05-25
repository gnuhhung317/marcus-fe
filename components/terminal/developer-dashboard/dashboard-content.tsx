'use client';

import { useState } from 'react';
import { BotDetailCard } from './bot-detail-card';
import { DeveloperBotList } from './developer-bot-list';
import { RegisterBotModal } from './register-bot-modal';
import { BotGridCard } from './bot-grid-card';
import { BotIntegrationHealth, DeveloperBotSummary, DeveloperBotDetail, DeveloperSignalItem, DeveloperSubscriptionSummary } from '@/lib/contracts/types';

interface DashboardContentProps {
  bots: DeveloperBotSummary[];
  activeBot: DeveloperBotDetail | null;
  subscriptions: DeveloperSubscriptionSummary[];
  integrationHealth: BotIntegrationHealth | null;
  signals: DeveloperSignalItem[];
  isSwitching?: boolean;
}

export function DashboardContent({ bots, activeBot, subscriptions, integrationHealth, signals, isSwitching = false }: DashboardContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasBots = bots && bots.length > 0;

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedExchange, setSelectedExchange] = useState<string>('ALL');

  // Fleet overview statistics calculations
  const totalBotsCount = bots.length;
  const activeBotsCount = bots.filter((b) => b.status === 'ACTIVE').length;
  const pausedBotsCount = bots.filter((b) => b.status === 'PAUSED').length;
  const errorBotsCount = bots.filter((b) => b.status === 'ERROR').length;

  // Dynamically extract unique exchanges from provisioned bots
  const uniqueExchanges = Array.from(new Set(bots.map((b) => b.exchange).filter(Boolean))) as string[];

  // Filtered bots list for Grid view
  const filteredBots = bots.filter((bot) => {
    const matchesSearch = 
      bot.botName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.botId.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = selectedStatus === 'ALL' || bot.status === selectedStatus;
    
    const matchesExchange = 
      selectedExchange === 'ALL' || 
      (bot.exchange && bot.exchange.toUpperCase() === selectedExchange.toUpperCase());

    return matchesSearch && matchesStatus && matchesExchange;
  });

  return (
    <div className="relative space-y-8 min-h-screen">
      {/* Header */}
      <header className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--panel-border)] pb-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">Developer Console</p>
          <h1 className="mt-2 text-3xl font-extrabold text-white tracking-tight">Developer Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">Provision bots, validate webhooks, and monitor delivery health.</p>
        </div>
        {hasBots && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-shrink-0 inline-flex items-center justify-center gap-2 rounded-xl cta-primary px-5 py-2.5 text-sm font-bold text-cta-on-primary transition-colors cursor-pointer"
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
        <div className="glass-strong rounded-2xl p-8 sm:p-12 shadow-[var(--shadow-soft)] relative overflow-hidden flex flex-col items-center justify-center text-center max-w-4xl mx-auto my-6 border border-[var(--panel-border)]">

          {/* Centered Graphic Icon - Clean Terminal Window (No motherboard/chip graphics) */}
          <div className="w-20 h-20 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-center shadow-[var(--shadow-soft)] relative mb-8">
            <svg className="w-10 h-10 text-emerald-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight mb-3">No Bots Provisioned</h2>
          <p className="text-slate-400 max-w-lg mb-8 text-sm leading-relaxed">
            Connect your automated trading system, scripts, or TradingView Pine Script alerts to the Marcus Trading signal router. Provision a new bot to receive your API credentials.
          </p>

          {/* Onboarding Steps Timeline */}
          <div className="grid gap-6 md:grid-cols-3 max-w-3xl w-full text-left mb-10 border-t border-[var(--panel-border)] pt-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--primary-soft)] text-[10px] font-bold text-emerald-400 border border-[var(--primary-soft)]">1</span>
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
            className="inline-flex items-center justify-center gap-2 rounded-xl cta-primary px-6 py-3 text-sm font-bold text-cta-on-primary transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Register Your First Bot
          </button>
        </div>
      ) : activeBot === null ? (
        /* PANORAMIC BIRD'S-EYE VIEW / GRID VIEW OF ALL BOTS */
        <div className="space-y-8 animate-fade-in">
          {/* Highly Premium Fleet Stats Overview */}
          <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Fleet Size */}
            <div className="group relative rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-5 shadow-[var(--shadow-soft)] hover:border-slate-500/30 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Fleet Size</p>
                  <p className="mt-2.5 text-3xl font-black text-white tracking-tight">{totalBotsCount}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-500/5 border border-slate-500/10 flex items-center justify-center text-slate-400 group-hover:text-slate-200 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-3 font-semibold flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-slate-500" />
                Total provisioned instances
              </p>
            </div>

            {/* Card 2: Active Status */}
            <div className="group relative rounded-2xl border border-emerald-500/10 bg-gradient-to-br from-[var(--panel)] to-emerald-950/[0.03] p-5 shadow-[var(--shadow-soft)] hover:border-emerald-500/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/[0.01] rounded-full blur-xl pointer-events-none" />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Active Status</p>
                  <p className="mt-2.5 text-3xl font-black text-emerald-400 tracking-tight">{activeBotsCount}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/10 transition-all duration-300">
                  <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <p className="text-[10px] text-emerald-500/85 mt-3 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Broadcasting live signals
              </p>
            </div>

            {/* Card 3: Paused Instances */}
            <div className="group relative rounded-2xl border border-amber-500/10 bg-gradient-to-br from-[var(--panel)] to-amber-950/[0.03] p-5 shadow-[var(--shadow-soft)] hover:border-amber-500/30 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-500">Paused Instances</p>
                  <p className="mt-2.5 text-3xl font-black text-amber-400 tracking-tight">{pausedBotsCount}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/10 transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-[10px] text-amber-500/85 mt-3 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Standby queue status
              </p>
            </div>

            {/* Card 4: System Faults */}
            <div className={`group relative rounded-2xl border p-5 shadow-[var(--shadow-soft)] transition-all duration-300 ${
              errorBotsCount > 0 
                ? 'border-rose-500/30 bg-gradient-to-br from-[var(--panel)] to-rose-950/10' 
                : 'border-[var(--panel-border)] bg-[var(--panel)] hover:border-rose-500/20'
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${errorBotsCount > 0 ? 'text-rose-400' : 'text-slate-500'}`}>
                    System Faults
                  </p>
                  <p className={`mt-2.5 text-3xl font-black tracking-tight ${errorBotsCount > 0 ? 'text-rose-400' : 'text-white'}`}>
                    {errorBotsCount}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  errorBotsCount > 0
                    ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400 animate-bounce'
                    : 'bg-slate-500/5 border border-slate-500/10 text-slate-400 group-hover:text-rose-400'
                }`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <p className={`text-[10px] mt-3 font-semibold flex items-center gap-1.5 ${errorBotsCount > 0 ? 'text-rose-400' : 'text-slate-500'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${errorBotsCount > 0 ? 'bg-rose-400 animate-ping' : 'bg-slate-500'}`} />
                {errorBotsCount > 0 ? 'Urgent attention required' : 'All systems operational'}
              </p>
            </div>
          </div>

          {/* Search & Filters Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] shadow-[var(--shadow-soft)]">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search by bot name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 bg-slate-950/40 rounded-xl border border-white/5 focus:border-emerald-500/50 focus:outline-none transition-colors"
              />
            </div>

            {/* Selection Dropdowns */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Status Select */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-slate-950/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50 cursor-pointer transition-colors"
                >
                  <option value="ALL" className="bg-slate-950">All Statuses</option>
                  <option value="ACTIVE" className="bg-slate-950">Active Only</option>
                  <option value="PAUSED" className="bg-slate-950">Paused Only</option>
                  <option value="ERROR" className="bg-slate-950">Errors Only</option>
                  <option value="CREATED" className="bg-slate-950">Created Only</option>
                </select>
              </div>

              {/* Venue Select */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Venue:</span>
                <select
                  value={selectedExchange}
                  onChange={(e) => setSelectedExchange(e.target.value)}
                  className="bg-slate-950/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50 cursor-pointer transition-colors"
                >
                  <option value="ALL" className="bg-slate-950">All Venues</option>
                  {uniqueExchanges.map((ex) => (
                    <option key={ex} value={ex.toUpperCase()} className="bg-slate-950">
                      {ex}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Active Filters */}
              {(searchQuery || selectedStatus !== 'ALL' || selectedExchange !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedStatus('ALL');
                    setSelectedExchange('ALL');
                  }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-bold px-2 py-1 transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Bot Card Grid */}
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--panel-border)] pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Router Fleet Overview</h2>
              <span className="text-[10px] text-slate-500 font-mono">Select a card to view console telemetry & credentials</span>
            </div>

            {filteredBots.length === 0 ? (
              <div className="text-center py-16 rounded-2xl border border-dashed border-white/10 bg-slate-950/20 max-w-md mx-auto my-4">
                <svg className="w-8 h-8 text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-xs text-slate-400">No routers match your active search filter settings.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedStatus('ALL');
                    setSelectedExchange('ALL');
                  }}
                  className="mt-3 inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-bold transition-colors cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredBots.map((bot) => (
                  <BotGridCard key={bot.botId} bot={bot} />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Single Bot Detail view (Full Width for distraction-free focus) */
        <main className="w-full min-w-0 relative max-w-7xl mx-auto">
          <BotDetailCard
            bot={activeBot}
            subscriptions={subscriptions}
            integrationHealth={integrationHealth}
            signals={signals}
            isSwitching={isSwitching}
          />
        </main>
      )}

      {/* Slide-over/Dialog Modal */}
      <RegisterBotModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
