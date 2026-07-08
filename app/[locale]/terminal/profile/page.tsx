import { getTranslations } from 'next-intl/server';
import { getCurrentUserProfile } from '@/lib/contracts/client';
import { updateProfileAction } from './actions';

interface ProfilePageProps {
  searchParams?: {
    status?: string;
  };
}

function statusBanner(status?: string) {
  if (status === 'profile_updated') {
    return { kind: 'success', message: 'success' };
  }

  if (status === 'profile_failed') {
    return { kind: 'error', message: 'error' };
  }

  return null;
}

export default async function TerminalProfilePage({ searchParams }: ProfilePageProps) {
  const t = await getTranslations('TerminalProfile');
  const tRoles = await getTranslations('Common.roles');
  const profile = await getCurrentUserProfile();
  const canManageAccount = profile.role !== 'GUEST';
  const banner = statusBanner(searchParams?.status);

  return (
    <div className="space-y-8">
      {banner ? (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            banner.kind === 'success'
              ? 'border-positive/42 bg-positive-soft text-positive'
              : 'border-negative/40 bg-negative-soft text-negative'
          }`}
        >
          {t(banner.message)}
        </div>
      ) : null}

      <section className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">{t('profile')}</p>
            <h2 className="mt-3 text-2xl font-semibold text-main">{t('basicInfo')}</h2>
          </div>
          <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">
            {t('role', { role: tRoles(profile.role as any) })}
          </span>
        </div>

        <form action={updateProfileAction} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="glass rounded-xl p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">{t('username')}</p>
            <input
              type="text"
              name="username"
              defaultValue={profile.username}
              className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-main outline-none"
              disabled={!canManageAccount}
            />
          </label>

          <label className="glass rounded-xl p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">{t('email')}</p>
            <input
              type="email"
              name="email"
              defaultValue={profile.email}
              className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-main outline-none"
              disabled={!canManageAccount}
            />
          </label>

          <div className="sm:col-span-2 flex flex-col gap-3">
            <button
              type="submit"
              className="rounded-xl cta-primary px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!canManageAccount}
            >
              {t('save')}
            </button>
            {!canManageAccount ? (
              <p className="text-xs text-muted">{t('guestLocked')}</p>
            ) : null}
          </div>
        </form>
      </section>

      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">{t('identity')}</p>
          <h1 className="mt-3 text-4xl font-semibold text-main">{profile.username}</h1>
          <p className="mt-2 text-sm text-muted">{t('uid', { userId: profile.userId })}</p>
          <p className="mt-1 text-sm text-muted">{t('identitySummary', { email: profile.email, role: tRoles(profile.role as any) })}</p>
        </div>
      </header>
    </div>
  );
}
