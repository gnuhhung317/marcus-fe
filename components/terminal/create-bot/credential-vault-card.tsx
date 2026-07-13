import { useTranslations } from 'next-intl';
import { BotProvisioningCredentials } from '@/lib/contracts/types';

interface CredentialVaultCardProps {
  credentials: BotProvisioningCredentials | null;
}

function VaultValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-2 break-all font-mono text-sm text-main">{value}</p>
    </div>
  );
}

export function CredentialVaultCard({ credentials }: CredentialVaultCardProps) {
  const t = useTranslations('CreateBot.credentialVault');

  return (
    <article className="glass rounded-2xl p-6">
      <h2 className="font-display text-2xl text-main">{t('title')}</h2>

      {credentials ? (
        <>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <VaultValue label={t('botId')} value={credentials.botId} />
            <VaultValue label={t('apiKey')} value={credentials.apiKey} />
          </div>

          <div className="mt-4 rounded-xl border border-[var(--primary-soft)] bg-primary-soft p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-positive">{t('rawSecret')}</p>
            <p className="mt-2 break-all font-mono text-sm text-main">{credentials.rawSecret}</p>
            <p className="mt-2 text-xs text-muted">{t('warning')}</p>
          </div>
        </>
      ) : (
        <div className="mt-5 rounded-xl border border-border bg-surface p-4 text-sm text-muted">{t('empty')}</div>
      )}
    </article>
  );
}
