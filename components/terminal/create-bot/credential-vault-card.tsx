import { BotProvisioningCredentials } from '@/lib/contracts/types';

interface CredentialVaultCardProps {
  credentials: BotProvisioningCredentials | null;
}

function VaultValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-2 break-all font-mono text-sm text-white">{value}</p>
    </div>
  );
}

export function CredentialVaultCard({ credentials }: CredentialVaultCardProps) {
  return (
    <article className="glass rounded-2xl p-6">
      <h2 className="font-display text-2xl text-white">Credential Vault (One-Time Display)</h2>
      <p className="mt-2 text-sm text-muted">After creation, backend returns BotRegistrationResponse payload.</p>

      {credentials ? (
        <>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <VaultValue label="botId" value={credentials.botId} />
            <VaultValue label="apiKey" value={credentials.apiKey} />
          </div>

          <div className="mt-4 rounded-xl border border-[var(--primary-soft)] bg-[var(--primary-soft)] p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-positive">rawSecret</p>
            <p className="mt-2 break-all font-mono text-sm text-white">{credentials.rawSecret}</p>
            <p className="mt-2 text-xs text-muted">Store this immediately. It will not be shown again.</p>
          </div>
        </>
      ) : (
        <div className="mt-5 rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] p-4 text-sm text-muted">
          Create a bot to generate one-time credentials.
        </div>
      )}
    </article>
  );