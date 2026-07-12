import { getTranslations } from 'next-intl/server';
import { getCurrentUserProfile } from '@/lib/contracts/client';
import { changePasswordAction } from './actions';

interface ProfilePageProps {
  searchParams?: {
    status?: string;
  };
}

function statusBanner(status?: string) {
  if (status === 'password_updated' || status === 'profile_updated') {
    return { kind: 'success', message: 'success' };
  }

  if (status === 'password_mismatch') {
    return { kind: 'error', message: 'passwordMismatch' };
  }

  if (status === 'password_failed' || status === 'profile_failed') {
    return { kind: 'error', message: 'error' };
  }

  return null;
}

export default async function TerminalProfilePage({ searchParams }: ProfilePageProps) {
  const t = await getTranslations('TerminalProfile');
  const tRoles = await getTranslations('Common.roles');
  const profile = await getCurrentUserProfile();
  const canChangePassword = profile.role !== 'GUEST';
  const banner = statusBanner(searchParams?.status);
  const roleLabel = tRoles(profile.role as any);

  const accountDetails = [
    { label: t('username'), value: profile.username },
    { label: t('email'), value: profile.email },
    { label: t('uidLabel'), value: profile.userId },
    { label: t('roleLabel'), value: roleLabel },
  ];

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
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">{t('profile')}</p>
            <h1 className="mt-3 text-3xl font-semibold text-main">{profile.username}</h1>
            <p className="mt-2 text-sm text-muted">{t('identitySummary', { email: profile.email, role: roleLabel })}</p>
          </div>
          <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">
            {t('role', { role: roleLabel })}
          </span>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {accountDetails.map((item) => (
            <div key={item.label} className="glass rounded-xl border border-border/60 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-muted">{item.label}</p>
              <p className="mt-2 break-words text-sm font-medium text-main">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">{t('passwordSection')}</p>
          <h2 className="mt-3 text-2xl font-semibold text-main">{t('changePasswordTitle')}</h2>
          <p className="mt-2 text-sm text-muted">{t('changePasswordDescription')}</p>
        </div>

        <form action={changePasswordAction} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="glass rounded-xl p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">{t('currentPassword')}</p>
            <input
              type="password"
              name="currentPassword"
              autoComplete="current-password"
              className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-main outline-none"
              disabled={!canChangePassword}
            />
          </label>

          <label className="glass rounded-xl p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">{t('newPassword')}</p>
            <input
              type="password"
              name="newPassword"
              autoComplete="new-password"
              minLength={8}
              className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-main outline-none"
              disabled={!canChangePassword}
            />
            <p className="mt-2 text-xs text-muted">{t('passwordHint')}</p>
          </label>

          <label className="glass rounded-xl p-4 sm:col-span-2">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">{t('confirmPassword')}</p>
            <input
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              minLength={8}
              className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-main outline-none"
              disabled={!canChangePassword}
            />
          </label>

          <div className="sm:col-span-2 flex flex-col gap-3">
            <button
              type="submit"
              className="rounded-xl cta-primary px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!canChangePassword}
            >
              {t('changePassword')}
            </button>
            {!canChangePassword ? (
              <p className="text-xs text-muted">{t('guestPasswordLocked')}</p>
            ) : null}
          </div>
        </form>
      </section>
    </div>
  );
}
