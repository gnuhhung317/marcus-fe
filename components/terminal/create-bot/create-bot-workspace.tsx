'use client';

import { useState } from 'react';
import { registerBotProvisioning } from '../../../lib/contracts/client';
import { BotProvisioningCredentials, RegisterBotInput } from '../../../lib/contracts/types';
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
          <RegisterBotFormCard
            values={formValues}
            isSubmitting={isSubmitting}
            submitError={submitError}
            onFieldChange={handleFieldChange}
            onSubmit={handleSubmit}
          />

          <CredentialVaultCard credentials={credentials} />

          <DeploySnippetCard formValues={formValues} credentials={credentials} />
        </div>
      </section>
    </div>
  );
}