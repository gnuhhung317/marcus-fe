'use client';

import { useState } from 'react';
import Link from 'next/link';
import { registerBotProvisioning } from '@/lib/contracts/client';
import { BotProvisioningCredentials, RegisterBotInput } from '@/lib/contracts/types';
import { CreateBotHeader } from './create-bot-header';
import { CredentialVaultCard } from './credential-vault-card';
import { DeploySnippetCard } from './deploy-snippet-card';
import { ProvisioningFlowPanel } from './provisioning-flow-panel';
import { RegisterBotFormCard } from './register-bot-form-card';

const initialFormValues: RegisterBotInput = {
  botName: 'MARCUS_SIGNAL_BRIDGE',
  exchange: 'BINANCE',
  tradingPair: 'BTC/USDT',
};

export function CreateBotWorkspace() {
  const [formValues, setFormValues] = useState<RegisterBotInput>(initialFormValues);
  const [credentials, setCredentials] = useState<BotProvisioningCredentials | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleFieldChange = <K extends keyof RegisterBotInput>(field: K, value: RegisterBotInput[K]) => {
    setFormValues((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = async () => {
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

  return (
    <div className="space-y-8">
      <CreateBotHeader />

      <section className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <ProvisioningFlowPanel />

        <div className="space-y-5">
          {!credentials ? (
            <RegisterBotFormCard
              values={formValues}
              isSubmitting={isSubmitting}
              submitError={submitError}
              onFieldChange={handleFieldChange}
              onSubmit={handleSubmit}
            />
          ) : (
            <>
              {/* Warnings and Security */}
              <div className="rounded-xl border border-[var(--warning-soft)] bg-[var(--warning-soft)] p-4 flex gap-3">
                <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-warning uppercase tracking-wider">Warning: One-Time Secret</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    For security reasons, your **Signing Secret** will not be accessible once you navigate away from this page. Please copy and store it securely immediately.
                  </p>
                </div>
              </div>

              <CredentialVaultCard credentials={credentials} />

              <DeploySnippetCard formValues={formValues} credentials={credentials} />

              <div className="flex justify-end pt-4">
                <Link
                  href={`/terminal/developer-dashboard/${credentials.botId}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl cta-primary px-6 py-3 text-sm font-bold text-cta-on-primary transition-all duration-200 hover:brightness-105 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Done & View Bot Console
                  <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}