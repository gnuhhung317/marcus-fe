'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerBotProvisioning } from '@/lib/contracts/client';
import { BotProvisioningCredentials, RegisterBotInput } from '@/lib/contracts/types';

interface RegisterBotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialFormValues: RegisterBotInput = {
  botName: 'MARCUS_SIGNAL_BRIDGE',
  exchange: 'BINANCE',
  tradingPair: 'BTC/USDT',
};

export function RegisterBotModal({ isOpen, onClose }: RegisterBotModalProps) {
  const router = useRouter();
  const [formValues, setFormValues] = useState<RegisterBotInput>(initialFormValues);
  const [credentials, setCredentials] = useState<BotProvisioningCredentials | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Clipboard states
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFieldChange = <K extends keyof RegisterBotInput>(field: K, value: RegisterBotInput[K]) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitError(null);
      setIsSubmitting(true);

      const result = await registerBotProvisioning(formValues);
      setCredentials(result);
    } catch {
      setSubmitError('Unable to generate bot credentials. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = (field: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDone = () => {
    if (credentials?.botId) {
      router.push(`/terminal/developer-dashboard?botId=${credentials.botId}`);
      router.refresh();
    }
    // Reset state & close
    setFormValues(initialFormValues);
    setCredentials(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={credentials ? undefined : onClose} // Prevent closing by backdrop click when credentials are shown
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--panel-border)] bg-[var(--panel-strong)] p-8 shadow-[var(--shadow-soft)] backdrop-blur-2xl transition-all duration-300 scale-100 max-h-[90vh] flex flex-col">
        
        {/* Glow effect */}
        <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-[var(--primary-soft)] blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 h-48 w-48 rounded-full bg-[var(--info-soft)] blur-3xl pointer-events-none" />

        {/* Header */}
        <header className="relative flex items-center justify-between pb-5 border-b border-[var(--panel-border)]">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-400">Signal Gateway</span>
            <h3 className="text-xl font-bold text-white tracking-tight mt-1">
              {credentials ? 'Credentials Generated' : 'Register New Webhook Bot'}
            </h3>
          </div>
          {!credentials && (
            <button 
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </header>

        {/* Content body */}
        <div className="relative mt-6 overflow-y-auto pr-1 flex-1">
          {!credentials ? (
            /* Form View */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Bot Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BTC_BREAKOUT_BOT"
                  className="w-full rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-[var(--primary-soft)] transition-all font-mono"
                  value={formValues.botName}
                  onChange={(e) => handleFieldChange('botName', e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Exchange Venue</label>
                  <select
                    className="w-full rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] px-4 py-3 text-sm text-white focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-[var(--primary-soft)] transition-all"
                    value={formValues.exchange}
                    onChange={(e) => handleFieldChange('exchange', e.target.value as RegisterBotInput['exchange'])}
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
                    value={formValues.tradingPair}
                    onChange={(e) => handleFieldChange('tradingPair', e.target.value)}
                  />
                </div>
              </div>

              {submitError && (
                <div className="rounded-xl border border-[var(--negative-soft)] bg-[var(--negative-soft)] p-3 text-xs text-negative">
                  {submitError}
                </div>
              )}

              <div className="pt-4 border-t border-[var(--panel-border)] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl px-5 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl cta-primary px-6 py-2.5 text-xs font-bold text-cta-on-primary hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
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
            /* Success & Vault display view */
            <div className="space-y-6">
              {/* Warnings and Security */}
              <div className="rounded-xl border border-[var(--warning-soft)] bg-[var(--warning-soft)] p-4 flex gap-3">
                <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-warning uppercase tracking-wider">Warning: One-Time Secret</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    For security reasons, your **Signing Secret** will not be accessible once this window is closed. Please copy and store it securely immediately.
                  </p>
                </div>
              </div>

              {/* Bot ID */}
              <div className="relative group">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bot ID</span>
                  <button 
                    onClick={() => handleCopy('botId', credentials.botId)}
                    className="text-[10px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                  >
                    {copiedField === 'botId' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="w-full rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] px-4 py-3 text-xs font-mono text-white select-all break-all pr-12">
                  {credentials.botId}
                </div>
              </div>

              {/* Public API Key */}
              <div className="relative group">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Public API Key</span>
                  <button 
                    onClick={() => handleCopy('apiKey', credentials.apiKey)}
                    className="text-[10px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                  >
                    {copiedField === 'apiKey' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="w-full rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] px-4 py-3 text-xs font-mono text-white select-all break-all pr-12">
                  {credentials.apiKey}
                </div>
              </div>

              {/* Raw Secret */}
              <div className="relative group">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Provisioning Signing Secret (rawSecret)</span>
                  <button 
                    onClick={() => handleCopy('rawSecret', credentials.rawSecret)}
                    className="text-[10px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                  >
                    {copiedField === 'rawSecret' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="w-full rounded-xl border border-[var(--primary-soft)] bg-[var(--primary-soft)] px-4 py-3.5 text-xs font-mono text-positive select-all break-all pr-12">
                  {credentials.rawSecret}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-end">
                <button
                  onClick={handleDone}
                  className="rounded-xl bg-emerald-400 px-6 py-2.5 text-xs font-bold text-black hover:bg-emerald-300 hover:scale-[1.02] active:scale-[0.98] transition-all"
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
