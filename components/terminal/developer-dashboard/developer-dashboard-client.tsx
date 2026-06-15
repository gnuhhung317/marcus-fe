'use client';

import { useState, useEffect } from 'react';
import { useDeveloperDashboard } from '@/lib/hooks/use-developer-dashboard';
import { FleetGridView } from './fleet-grid-view';
import { DeveloperOnboardingState } from './developer-onboarding-state';
import { DeveloperDashboardPageData } from '@/lib/contracts/types';
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

  const resolvedInitialData = selectedBotId === initialBotId ? initialData : undefined;

  const { data, optimisticallyUpdateBotStatus } = useDeveloperDashboard(selectedBotId, resolvedInitialData);

  const handleSelectBot = (botId: string | undefined) => {
    setSelectedBotId(botId);
    setViewMode('console');

    const nextUrl = botId ? `/terminal/developer-dashboard/${botId}` : '/terminal/developer-dashboard';
    window.history.pushState(null, '', nextUrl);
  };

  const handleBackToFleet = () => {
    setSelectedBotId(undefined);
    setViewMode('grid');
    window.history.pushState(null, '', '/terminal/developer-dashboard');
  };

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
        <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-main uppercase">Developer Dashboard</h1>
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
      <div className="mb-6 flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-main uppercase">Developer Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-lg border border-border bg-surface-strong p-1">
            <button
              onClick={() => {
                setViewMode('grid');
                setSelectedBotId(undefined);
                window.history.pushState(null, '', '/terminal/developer-dashboard');
              }}
              className={`rounded px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-positive text-background' : 'text-muted hover:text-main'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => {
                setViewMode('console');
                const nextUrl = selectedBotId ? `/terminal/developer-dashboard/${selectedBotId}` : '/terminal/developer-dashboard';
                window.history.pushState(null, '', nextUrl);
              }}
              className={`rounded px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'console' ? 'bg-positive text-background' : 'text-muted hover:text-main'
              }`}
            >
              Console View
            </button>
          </div>

          <button
            onClick={() => setIsRegisterOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg cta-primary px-4 py-2 text-xs font-bold text-cta-on-primary transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <svg className="h-4 w-4 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Register Bot
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <FleetGridView bots={bots} onBotStatusChange={optimisticallyUpdateBotStatus} onSelect={handleSelectBot} />
      ) : (
        <div className="grid min-h-[60vh] items-start gap-6 lg:grid-cols-[300px_1fr] animate-fade-in">
          <aside className="w-full lg:sticky lg:top-8">
            <DeveloperBotList
              bots={bots}
              activeBotId={selectedBotId}
              onSelectBot={handleSelectBot}
              onRegisterClick={() => setIsRegisterOpen(true)}
            />
          </aside>

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
                <div className="rounded-xl border border-border/40 bg-surface/40 p-12 text-center font-mono">
                  <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-border border-t-positive" />
                  <p className="text-xs text-muted">Loading bot console telemetry...</p>
                </div>
              )
            ) : (
              <div className="mx-auto my-6 max-w-2xl rounded-xl border border-border/40 bg-surface/40 p-12 text-center">
                <svg className="mx-auto mb-4 h-12 w-12 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                <h3 className="mb-2 font-mono text-sm font-bold uppercase tracking-wider text-main">Global Fleet Overview</h3>
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-surface-strong px-3 py-1 font-mono text-[10px] text-muted">
                  <span className="h-1.5 w-1.5 animate-ping rounded-full bg-positive" />
                  Fleet status: Nominal
                </div>
              </div>
            )}
          </main>
        </div>
      )}

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
