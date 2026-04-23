'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

function getErrorMessage(error?: string) {
  if (error === 'missing_credentials') {
    return 'Please enter both username/email and password.';
  }

  if (error === 'invalid_credentials') {
    return 'Login failed. Please check your credentials and try again.';
  }

  if (error === 'service_unavailable') {
    return 'Login service is temporarily unavailable.';
  }

  return undefined;
}

interface LoginClientProps {
  initialNextPath: string;
  initialError?: string;
}

const LOGIN_ROUTE = '/api/auth/login';

export default function LoginClient({ initialNextPath, initialError }: LoginClientProps) {
  const router = useRouter();
  const errorMessage = getErrorMessage(initialError);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | undefined>(undefined);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedIdentifier = identifier.trim();

    if (!trimmedIdentifier || !password) {
      setFormError('Please enter both username/email and password.');
      return;
    }

    setIsSubmitting(true);
    setFormError(undefined);

    try {
      console.info('[login] submitting', { identifier: trimmedIdentifier, nextPath: initialNextPath });

      const response = await fetch(LOGIN_ROUTE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ username: trimmedIdentifier, password }),
      });

      const payload = await response.json().catch(() => ({}));
      console.info('[login] response', { status: response.status, payload });

      if (!response.ok) {
        if (response.status === 401) {
          setFormError('Invalid username/email or password.');
          return;
        }

        setFormError(payload?.message || `Login failed with status ${response.status}.`);
        return;
      }

      if (!payload?.accessToken || !payload?.refreshToken) {
        setFormError(payload?.message || 'Login completed but authentication tokens were not issued.');
        return;
      }

      router.replace(initialNextPath);
    } catch (error) {
      console.error('[login] request failed', error);
      setFormError('Login service is temporarily unavailable.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_46%),radial-gradient(circle_at_80%_10%,rgba(56,189,248,0.12),transparent_34%),#050810] px-4 py-12 text-white">
      <section className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-3xl border border-[rgba(148,163,184,0.2)] bg-[rgba(8,13,22,0.7)] p-7 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Marcus Trading Terminal</p>
          <h1 className="mt-3 text-4xl font-semibold text-white md:text-5xl">Sign in to continue</h1>
          <p className="mt-3 text-sm text-muted">Access marketplace subscriptions, portfolio controls, and operator tooling in one secured workspace.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[rgba(15,23,42,0.72)] p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">Protected API</p>
              <p className="mt-2 text-sm text-white">Bearer token is attached automatically after login.</p>
            </div>
            <div className="rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[rgba(15,23,42,0.72)] p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">Role Gating</p>
              <p className="mt-2 text-sm text-white">Navigation and terminal routes are filtered by your role.</p>
            </div>
          </div>
        </article>

        <article className="rounded-3xl border border-[rgba(148,163,184,0.22)] bg-[rgba(6,10,18,0.82)] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.42)]">
          <h2 className="text-2xl font-semibold text-white">Welcome back</h2>
          <p className="mt-2 text-sm text-muted">Use your Marcus username or email and password.</p>

          {errorMessage ? (
            <p className="mt-4 rounded-xl border border-[rgba(244,63,94,0.4)] bg-[rgba(127,29,29,0.35)] px-4 py-3 text-sm text-red-100">{errorMessage}</p>
          ) : null}

          {formError ? (
            <p className="mt-4 rounded-xl border border-[rgba(244,63,94,0.4)] bg-[rgba(127,29,29,0.35)] px-4 py-3 text-sm text-red-100">{formError}</p>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <label className="block space-y-2">
              <span className="text-xs uppercase tracking-[0.14em] text-muted">Username or email</span>
              <input
                name="username"
                type="text"
                required
                autoComplete="username"
                placeholder="duchung02st@gmail.com"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                className="w-full rounded-xl border border-[rgba(148,163,184,0.22)] bg-[rgba(15,23,42,0.72)] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-muted focus:border-[rgba(16,185,129,0.52)]"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-xs uppercase tracking-[0.14em] text-muted">Password</span>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-[rgba(148,163,184,0.22)] bg-[rgba(15,23,42,0.72)] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-muted focus:border-[rgba(16,185,129,0.52)]"
              />
            </label>

            <button type="submit" disabled={isSubmitting} className="w-full rounded-xl cta-primary px-4 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70">
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-4 text-xs text-muted">
            Need public content first? <Link href="/" className="text-white underline underline-offset-4">Go to home</Link>
          </p>
        </article>
      </section>
    </main>
  );
}