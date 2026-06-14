'use client';

interface DeveloperOnboardingStateProps {
  onRegister?: () => void;
}

export function DeveloperOnboardingState({ onRegister }: DeveloperOnboardingStateProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-8 sm:p-12 shadow-[var(--shadow-soft)] relative overflow-hidden flex flex-col items-center justify-center text-center max-w-4xl mx-auto my-6">
      
      {/* Centered Graphic Icon - Clean Terminal Window */}
      <div className="w-16 h-16 rounded-xl bg-positive/10 border border-positive/20 flex items-center justify-center relative mb-8">
        <svg className="w-8 h-8 text-positive animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <h2 className="text-xl font-bold text-white tracking-tight mb-2 uppercase">No Bots Provisioned</h2>
      <p className="text-xs text-slate-400 max-w-lg mb-8 leading-relaxed">
        Connect your automated trading system, scripts, or TradingView Pine Script alerts to the Marcus Trading signal router. Provision a new bot to receive your API credentials.
      </p>

      {/* Onboarding Steps Timeline */}
      <div className="grid gap-6 md:grid-cols-3 max-w-3xl w-full text-left mb-10 border-t border-white/5 pt-8 font-mono">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-positive/10 text-[9px] font-bold text-positive border border-positive/20">1</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Bot Metadata</h3>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
            Specify your exchange venue (Binance, Bybit, etc.) and custom execution pair.
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-positive/10 text-[9px] font-bold text-positive border border-positive/20">2</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Issue Secrets</h3>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
            Retrieve a cryptographically signed API key and display secret.
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-positive/10 text-[9px] font-bold text-positive border border-positive/20">3</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Post Signals</h3>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
            Configure your algorithmic strategy to stream JSON signals to our webhooks.
          </p>
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
        Register Your First Bot
      </button>
    </div>
  );
}
