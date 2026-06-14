'use client';

import { useState, useEffect } from 'react';
import { useDeveloperDashboard } from '@/lib/hooks/use-developer-dashboard';
import { FleetGridView } from './fleet-grid-view';
import { DeveloperOnboardingState } from './developer-onboarding-state';
import { DeveloperDashboardPageData, DeveloperBotStatus } from '@/lib/contracts/types';
import { DeveloperBotList } from './developer-bot-list';
import { BotDetailCard } from './bot-detail-card';
import { RegisterBotModal } from './register-bot-modal';

interface DeveloperDashboardClientProps {
  initialData: DeveloperDashboardPageData;
  initialBotId?: string;
}

export function DeveloperDashboardClient({ initialData, initialBotId }: DeveloperDashboardClientProps) {
  const [selectedBotId, setSelectedBotId] = useState<string | undefined>(initialBotId);
  const [viewMode, setViewMode] = useState<'grid' | 'console'>(initialBotId ? 'console' : 'grid');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  // Use initialData as cache for the current selection if it matches the initial parameters
  const resolvedInitialData = (selectedBotId === initialBotId) ? initialData : undefined;

  const { data, optimisticallyUpdateBotStatus } = useDeveloperDashboard(
    selectedBotId,
    resolvedInitialData
  );

  // Sync URL pushState for SPA transitions
  const handleSelectBot = (botId: string | undefined) => {
    setSelectedBotId(botId);
    setViewMode('console');
    
    const nextUrl = botId 
      ? `/terminal/developer-dashboard/${botId}` 
      : `/terminal/developer-dashboard`;
    window.history.pushState(null, '', nextUrl);
  };

  const handleBackToFleet = () => {
    setSelectedBotId(undefined);
    setViewMode('grid');
    window.history.pushState(null, '', '/terminal/developer-dashboard');
  };

  // Sync state with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const match = path.match(/^\/terminal\/developer-dashboard\/(.+)$/);
      if (match) {
        setSelectedBotId(match[1]);
        setViewMode('console');
      } else {
        setSelectedBotId(undefined);
        setViewMode('grid');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Smooth bot switching transition trigger
  useEffect(() => {
    if (selectedBotId) {
      setIsSwitching(true);
      const timer = setTimeout(() => setIsSwitching(false), 250);
      return () => clearTimeout(timer);
    }
  }, [selectedBotId]);

  const bots = data?.bots ?? initialData.bots ?? [];
  const hasBots = bots.length > 0;
  const activeBot = data?.activeBot || (selectedBotId === initialBotId ? initialData.activeBot : null);

  if (!hasBots) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4 mb-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase">Developer Dashboard</h1>
          </div>
        </div>
        <DeveloperOnboardingState onRegister={() => setIsRegisterOpen(true)} />
        <RegisterBotModal
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          onBotCreated={(botId) => {
            handleSelectBot(botId);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4 mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase">Developer Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Grid / Console View Toggle */}
          <div className="inline-flex rounded-lg border border-border bg-slate-900 p-1">
            <button
              onClick={() => {
                setViewMode('grid');
                setSelectedBotId(undefined);
                window.history.pushState(null, '', '/terminal/developer-dashboard');
              }}
              className={`rounded px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'grid' 
                  ? 'bg-positive text-black' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => {
                setViewMode('console');
                const nextUrl = selectedBotId 
                  ? `/terminal/developer-dashboard/${selectedBotId}` 
                  : `/terminal/developer-dashboard`;
                window.history.pushState(null, '', nextUrl);
              }}
              className={`rounded px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'console' 
                  ? 'bg-positive text-black' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Console View
            </button>
          </div>
          
          {/* Register New Bot Button */}
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg cta-primary px-4 py-2 text-xs font-bold text-cta-on-primary transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Register Bot
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === 'grid' ? (
        <FleetGridView
          bots={bots}
          onBotStatusChange={optimisticallyUpdateBotStatus}
          onSelect={handleSelectBot}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[300px_1fr] min-h-[60vh] items-start animate-fade-in">
          {/* Sidebar */}
          <aside className="w-full lg:sticky lg:top-8">
            <DeveloperBotList
              bots={bots}
              activeBotId={selectedBotId}
              onSelectBot={handleSelectBot}
              onRegisterClick={() => setIsRegisterOpen(true)}
            />
          </aside>

          {/* Details Pane */}
          <main className="w-full min-w-0">
            {selectedBotId ? (
              activeBot ? (
                <div className={`transition-opacity duration-200 ${isSwitching ? 'opacity-40' : 'opacity-100'}`}>
                  <BotDetailCard
                    bot={activeBot}
                    subscriptions={data?.subscriptions ?? []}
                    integrationHealth={data?.integrationHealth ?? null}
                    signals={data?.signals ?? []}
                    isSwitching={isSwitching}
                    onStatusChange={optimisticallyUpdateBotStatus}
                    onBackToFleet={handleBackToFleet}
                  />
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-surface p-12 text-center font-mono">
                  <div className="w-10 h-10 rounded-full border-2 border-t-positive border-border animate-spin mx-auto mb-4" />
                  <p className="text-xs text-slate-400">Loading bot console telemetry...</p>
                </div>
              )
            ) : (
              <div className="rounded-xl border border-border bg-surface p-12 text-center max-w-2xl mx-auto my-6">
                <svg className="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 font-mono">Global Fleet Overview</h3>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-950/60 px-3 py-1 text-[10px] text-slate-500 font-mono mt-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-positive animate-ping" />
                  Fleet status: Nominal
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* Register Bot Modal */}
      <RegisterBotModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onBotCreated={(botId) => {
          handleSelectBot(botId);
        }}
      />
    </div>
  );
}
