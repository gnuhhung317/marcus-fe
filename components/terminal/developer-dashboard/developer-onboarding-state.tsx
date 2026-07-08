'use client';

import { useTranslations } from 'next-intl';

interface DeveloperOnboardingStateProps {
  onRegister?: () => void;
}

export function DeveloperOnboardingState({ onRegister }: DeveloperOnboardingStateProps) {
  const t = useTranslations('DeveloperDashboard.onboarding');

  return (
    <div className="rounded-xl border border-border bg-surface p-8 sm:p-12 shadow-[var(--shadow-soft)] relative overflow-hidden flex flex-col items-center justify-center text-center max-w-4xl mx-auto my-6">
      
      {/* Centered Graphic Icon - Clean Terminal Window */}
      <div className="w-16 h-16 rounded-xl bg-positive/10 border border-positive/20 flex items-center justify-center relative mb-8">
        <svg className="w-8 h-8 text-positive animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <h2 className="text-xl font-bold text-main tracking-tight mb-2 uppercase">{t('title')}</h2>
      <p className="text-xs text-muted max-w-lg mb-8 leading-relaxed">{t('description')}</p>

      {/* Onboarding Steps Timeline */}
      <div className="grid gap-6 md:grid-cols-3 max-w-3xl w-full text-left mb-10 border-t border-border/40 pt-8 font-mono">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-positive/10 text-[9px] font-bold text-positive border border-positive/20">1</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-main">{t('step1.title')}</h3>
          </div>
          <p className="text-[11px] text-muted leading-relaxed font-sans">{t('step1.description')}</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-positive/10 text-[9px] font-bold text-positive border border-positive/20">2</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-main">{t('step2.title')}</h3>
          </div>
          <p className="text-[11px] text-muted leading-relaxed font-sans">{t('step2.description')}</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-positive/10 text-[9px] font-bold text-positive border border-positive/20">3</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-main">{t('step3.title')}</h3>
          </div>
          <p className="text-[11px] text-muted leading-relaxed font-sans">{t('step3.description')}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onRegister}
        className="inline-flex items-center justify-center gap-2 rounded-xl cta-primary px-6 py-3 text-xs font-bold text-cta-on-primary transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
      >
        <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        {t('submit')}
      </button>
    </div>
  );
}
