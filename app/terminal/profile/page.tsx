import { getProfilePageData } from '@/lib/contracts/client';
import { createApiKeyAction, revokeApiKeyAction, updatePreferencesAction } from './actions';

interface ProfilePageProps {
  searchParams?: {
    status?: string;
  };
}

function statusBanner(status?: string) {
  if (status === 'preferences_updated') {
    return { kind: 'success', message: 'Preferences updated successfully.' };
  }

  if (status === 'apikey_created') {
    return { kind: 'success', message: 'New API key has been created.' };
  }

  if (status === 'apikey_revoked') {
    return { kind: 'success', message: 'API key revoked successfully.' };
  }

  if (status === 'preferences_failed') {
    return { kind: 'error', message: 'Failed to update preferences. Please try again.' };
  }

  if (status === 'apikey_create_failed') {
    return { kind: 'error', message: 'Failed to create API key. Please try again.' };
  }

  if (status === 'apikey_revoke_failed') {
    return { kind: 'error', message: 'Failed to revoke API key. Please try again.' };
  }

  return null;
}

export default async function TerminalProfilePage({ searchParams }: ProfilePageProps) {
  const { profile, preferences, apiKeys, loginActivities } = await getProfilePageData();
  const canManageAccount = profile.role !== 'GUEST';
  const banner = statusBanner(searchParams?.status);

  return (
    <div className="space-y-8">
      {banner ? (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            banner.kind === 'success'
              ? 'border-[rgba(16,185,129,0.42)] bg-[rgba(6,78,59,0.35)] text-[rgba(209,250,229,0.98)]'
              : 'border-[rgba(244,63,94,0.4)] bg-[rgba(127,29,29,0.35)] text-[rgba(254,226,226,0.98)]'
          }`}
        >
          {banner.message}
        </div>
      ) : null}

      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Profile</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">{profile.username}</h1>
          <p className="mt-2 text-sm text-muted">UID: {profile.userId}</p>
          <p className="mt-1 text-sm text-muted">{profile.email} · Role {profile.role}</p>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-xl border border-[rgba(148,163,184,0.32)] px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canManageAccount}
          >
            Export Logs
          </button>
          <button className="rounded-xl cta-primary px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60" disabled={!canManageAccount}>
            Security Check
          </button>
        </div>
      </header>

      <section className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Current Role</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">{profile.role}</h2>
          <p className="mt-3 text-sm text-muted">Security settings and API access controls for this Marcus terminal identity.</p>
          <button
            className="mt-6 rounded-xl border border-[rgba(132,162,191,0.3)] px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canManageAccount}
          >
            Manage Access
          </button>
        </article>

        <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">API Key Management</h2>
            <form action={createApiKeyAction} className="flex items-center gap-2">
              <input
                type="text"
                name="label"
                placeholder="Key label"
                className="w-36 rounded-lg border border-[rgba(148,163,184,0.22)] bg-[rgba(15,23,42,0.72)] px-3 py-1.5 text-xs text-white outline-none placeholder:text-muted"
                disabled={!canManageAccount}
              />
              <button
                type="submit"
                className="rounded-lg border border-[rgba(148,163,184,0.3)] px-3 py-1 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!canManageAccount}
              >
                New Key
              </button>
            </form>
          </div>
          <p className="mt-2 text-xs text-muted">{apiKeys.length} stored keys · session timeout {preferences.sessionTimeoutMinutes}m</p>
          <div className="mt-5 space-y-3">
            {apiKeys.map((key) => (
              <div key={key.id} className="rounded-xl border border-[rgba(132,162,191,0.2)] bg-[rgba(6,10,18,0.55)] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{key.label}</p>
                    <p className="mt-1 text-sm text-muted">{key.maskedKey}</p>
                    <p className="mt-2 text-xs text-muted">Created {new Date(key.createdAt).toLocaleDateString()}</p>
                  </div>
                  <form action={revokeApiKeyAction}>
                    <input type="hidden" name="apiKeyId" value={key.id} />
                    <button
                      type="submit"
                      className="rounded-lg border border-[rgba(244,63,94,0.38)] px-3 py-1.5 text-xs font-semibold text-[rgba(254,226,226,0.95)] disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!canManageAccount}
                    >
                      Revoke
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
          <h2 className="text-2xl font-semibold text-white">Account Preferences</h2>
          <form action={updatePreferencesAction} className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="rounded-xl border border-[rgba(148,163,184,0.22)] bg-[rgba(15,23,42,0.72)] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-muted">Timezone</p>
              <input
                type="text"
                name="timezone"
                defaultValue={preferences.timezone}
                className="mt-2 w-full rounded-lg border border-[rgba(148,163,184,0.22)] bg-[rgba(2,6,23,0.55)] px-3 py-2 text-sm text-white outline-none"
                disabled={!canManageAccount}
              />
            </label>

            <label className="rounded-xl border border-[rgba(148,163,184,0.22)] bg-[rgba(15,23,42,0.72)] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-muted">Base Currency</p>
              <input
                type="text"
                name="baseCurrency"
                defaultValue={preferences.baseCurrency}
                className="mt-2 w-full rounded-lg border border-[rgba(148,163,184,0.22)] bg-[rgba(2,6,23,0.55)] px-3 py-2 text-sm text-white outline-none"
                disabled={!canManageAccount}
              />
            </label>

            <label className="rounded-xl border border-[rgba(148,163,184,0.22)] bg-[rgba(15,23,42,0.72)] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-muted">Session Timeout (minutes)</p>
              <input
                type="number"
                name="sessionTimeoutMinutes"
                min={5}
                max={240}
                defaultValue={preferences.sessionTimeoutMinutes}
                className="mt-2 w-full rounded-lg border border-[rgba(148,163,184,0.22)] bg-[rgba(2,6,23,0.55)] px-3 py-2 text-sm text-white outline-none"
                disabled={!canManageAccount}
              />
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-[rgba(148,163,184,0.22)] bg-[rgba(15,23,42,0.72)] p-4">
              <input
                type="checkbox"
                name="emailNotifications"
                defaultChecked={preferences.emailNotifications}
                className="h-4 w-4"
                disabled={!canManageAccount}
              />
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-muted">Email Alerts</p>
                <p className="mt-1 text-sm font-medium text-white">Enable security and account notifications</p>
              </div>
            </label>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="rounded-xl cta-primary px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!canManageAccount}
              >
                Save Preferences
              </button>
            </div>
          </form>
        </article>

        <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
          <h2 className="text-2xl font-semibold text-white">Recent Login Activity</h2>
          <div className="mt-4 space-y-3">
            {loginActivities.map((activity) => (
              <div key={activity.id} className="rounded-xl border border-[rgba(132,162,191,0.2)] bg-[rgba(6,10,18,0.55)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{activity.device}</p>
                    <p className="mt-1 text-sm text-muted">{activity.location}</p>
                  </div>
                  <span className="rounded-full border border-[rgba(148,163,184,0.18)] px-2 py-1 text-[11px] text-muted">{activity.status}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
                  <span>{activity.ipMasked}</span>
                  <span>{new Date(activity.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
