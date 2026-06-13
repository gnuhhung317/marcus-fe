'use client';

import { useState } from 'react';
import Link from 'next/link';
import { registerBotProvisioning } from '@/lib/contracts/client';
import { BotProvisioningCredentials } from '@/lib/contracts/types';
import { RegisterBotFormValues } from '@/lib/validations/bot.schema';
import { CreateBotHeader } from './create-bot-header';
import { CredentialVaultCard } from './credential-vault-card';
import { DeploySnippetCard } from './deploy-snippet-card';
import { ProvisioningFlowPanel } from './provisioning-flow-panel';
import { RegisterBotFormCard } from './register-bot-form-card';

export function CreateBotWorkspace() {
  const [credentials, setCredentials] = useState<BotProvisioningCredentials | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [lastFormValues, setLastFormValues] = useState<RegisterBotFormValues | null>(null);

  const handleSubmit = async (values: RegisterBotFormValues) => {
    try {
      setSubmitError(null);
      setCredentials(null);
      setIsSubmitting(true);
      setLastFormValues(values);

      const result = await registerBotProvisioning({
        botName: values.botName,
        exchange: values.exchange,
        tradingPair: values.tradingPair,
      });
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
              isSubmitting={isSubmitting}
              submitError={submitError}
              onSubmit={handleSubmit}
            />
          ) : (
            <>
              <div className="flex gap-3 rounded-xl border border-[var(--semantic-warning-soft)] bg-warning-soft p-4">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-warning">Warning: One-Time Secret</h4>
                  <p className="text-[11px] leading-relaxed text-slate-400">
                    For security reasons, your **Signing Secret** will not be accessible once you navigate away from this page.
                    Please copy and store it securely immediately.
                  </p>
                </div>
              </div>

              <CredentialVaultCard credentials={credentials} />

              {lastFormValues && (
                <DeploySnippetCard formValues={lastFormValues} credentials={credentials} />
              )}

              <div className="flex justify-end pt-4">
                <Link
                  href={`/terminal/developer-dashboard/${credentials.botId}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl cta-primary px-6 py-3 text-sm font-bold text-cta-on-primary transition-all duration-200 hover:scale-[1.02] hover:brightness-105 active:scale-[0.98]"
                >
                  Done & View Bot Console
                  <svg className="h-4 w-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
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
