import { getProfilePageData } from '../../../lib/contracts/client';

export default async function TerminalProfilePage() {
  const { profile, apiKeys } = await getProfilePageData();

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Profile</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">{profile.username}</h1>
          <p className="mt-2 text-sm text-muted">UID: {profile.userId}</p>
          <p className="mt-1 text-sm text-muted">{profile.email} · Role {profile.role}</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-xl border border-[rgba(148,163,184,0.32)] px-4 py-2 text-sm text-white">Export Logs</button>
          <button className="rounded-xl cta-primary px-4 py-2 text-sm font-semibold">Security Check</button>
        </div>
      </header>

      <section className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Current Role</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">{profile.role}</h2>
          <p className="mt-3 text-sm text-muted">Security settings and API access controls for this Marcus terminal identity.</p>
          <button className="mt-6 rounded-xl border border-[rgba(132,162,191,0.3)] px-4 py-2 text-sm text-white">Manage Access</button>
        </article>

        <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">API Key Management</h2>
            <button className="rounded-lg border border-[rgba(148,163,184,0.3)] px-3 py-1 text-sm text-white">New Key</button>
          </div>
          <div className="mt-5 space-y-3">
            {apiKeys.map((key) => (
              <div key={key.id} className="rounded-xl border border-[rgba(132,162,191,0.2)] bg-[rgba(6,10,18,0.55)] p-4">
                <p className="font-semibold text-white">{key.label}</p>
                <p className="mt-1 text-sm text-muted">{key.maskedKey}</p>
                <p className="mt-2 text-xs text-muted">Created {new Date(key.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
