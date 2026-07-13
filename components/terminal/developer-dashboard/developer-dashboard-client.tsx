'use client';

import { memo, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useDeveloperDashboard } from '@/lib/hooks/use-developer-dashboard';
import { DeveloperDashboardPageData } from '@/lib/contracts/types';
import { DeveloperOnboardingState } from './developer-onboarding-state';
import { FleetGridView } from './fleet-grid-view';
import { RegisterBotModal } from './register-bot-modal';

interface DeveloperDashboardClientProps {
  initialData: DeveloperDashboardPageData;
}

interface DeveloperFleetContentProps {
  initialData: DeveloperDashboardPageData;
  onRegister: () => void;
}

const DeveloperFleetContent = memo(function DeveloperFleetContent({
  initialData,
  onRegister,
}: DeveloperFleetContentProps) {
  const router = useRouter();
  const t = useTranslations('DeveloperDashboard');
  const { data, optimisticallyUpdateBotStatus } = useDeveloperDashboard(undefined, initialData);
  const bots = data?.bots ?? initialData.bots ?? [];
  const hasBots = bots.length > 0;
  const firstBotId = bots[0]?.botId;

  if (!hasBots) {
    return (
      <div className="space-y-6">
        <div className="mb-6 flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold uppercase tracking-tight text-main">{t('title')}</h1>
          </div>
          <button
            onClick={onRegister}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg cta-primary px-4 py-2 text-xs font-bold text-cta-on-primary transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <svg className="h-4 w-4 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {t('registerBotButton')}
          </button>
        </div>
        <DeveloperOnboardingState onRegister={onRegister} />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="mb-6 flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-tight text-main">{t('title')}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-lg border border-border bg-surface-strong p-1">
            <button
              type="button"
              className="rounded bg-positive px-3 py-1.5 text-xs font-bold text-background transition-all cursor-default"
            >
              {t('view.grid')}
            </button>
            <button
              type="button"
              onClick={() => {
                if (firstBotId) {
                  router.push(`/terminal/developer-dashboard/${firstBotId}`);
                }
              }}
              className="rounded px-3 py-1.5 text-xs font-bold text-muted transition-all hover:text-main cursor-pointer"
              disabled={!firstBotId}
            >
              {t('view.console')}
            </button>
          </div>

          <button
            onClick={onRegister}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg cta-primary px-4 py-2 text-xs font-bold text-cta-on-primary transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <svg className="h-4 w-4 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {t('registerBotButton')}
          </button>
        </div>
      </div>

      <FleetGridView
        bots={bots}
        onBotStatusChange={optimisticallyUpdateBotStatus}
        onSelect={(botId) => router.push(`/terminal/developer-dashboard/${botId}`)}
      />
    </div>
  );
});

export function DeveloperDashboardClient({ initialData }: DeveloperDashboardClientProps) {
  const router = useRouter();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const handleOpenRegister = useCallback(() => {
    setIsRegisterOpen(true);
  }, []);

  const handleCloseRegister = useCallback(() => {
    setIsRegisterOpen(false);
  }, []);

  const handleBotCreated = useCallback(
    (botId: string) => {
      setIsRegisterOpen(false);
      router.push(`/terminal/developer-dashboard/${botId}`);
    },
    [router]
  );

  return (
    <>
      <DeveloperFleetContent initialData={initialData} onRegister={handleOpenRegister} />
      <RegisterBotModal
        isOpen={isRegisterOpen}
        onClose={handleCloseRegister}
        onBotCreated={handleBotCreated}
      />
    </>
  );
}
