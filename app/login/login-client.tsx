'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { SiteHeader } from '../../components/marketing/site-header';
import { SiteFooter } from '../../components/marketing/site-footer';

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
      const response = await fetch(LOGIN_ROUTE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ username: trimmedIdentifier, password }),
      });

      const payload = await response.json().catch(() => ({}));

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
      setFormError('Login service is temporarily unavailable.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden shell-grid bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_46%),radial-gradient(circle_at_80%_10%,rgba(56,189,248,0.12),transparent_34%),#050810] text-white animate-fade-in">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(148,163,184,0.12),transparent_55%)]" />

      {/* Embedded Header */}
      <SiteHeader isAuthenticated={false} />

      {/* Main Form container vertically centered */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-12 md:py-16">
        <section className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr] items-stretch">

          {/* Left supportive brand and value proposition card */}
          <article className="rounded-3xl border border-[rgba(148,163,184,0.16)] bg-[rgba(8,13,22,0.65)] p-8 md:p-10 backdrop-blur-xl flex flex-col justify-between shadow-[0_24px_60px_rgba(0,0,0,0.4)]">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-semibold">Marcus Trading Ecosystem</p>
              <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white md:text-3xl leading-snug">
                Next-Gen Algorithmic Trading
              </h1>
              <p className="mt-4 text-sm text-muted leading-relaxed">
                Unlock professional quantitative execution, real-time portfolio intelligence, and secure API bot operations in a unified workspace.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[rgba(148,163,184,0.12)] bg-[rgba(10,15,30,0.45)] p-5 hover:border-[rgba(16,185,129,0.25)] transition-all duration-300">
                <div className="flex items-center gap-2 text-emerald-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="text-xs uppercase tracking-[0.14em] font-semibold text-white">Institutional Security</p>
                </div>
                <p className="mt-2 text-xs text-muted leading-relaxed">
                  Enterprise session encryption, secure MFA authorization, and isolated API-key strategies safeguard your trades.
                </p>
              </div>

              <div className="rounded-2xl border border-[rgba(148,163,184,0.12)] bg-[rgba(10,15,30,0.45)] p-5 hover:border-[rgba(16,185,129,0.25)] transition-all duration-300">
                <div className="flex items-center gap-2 text-emerald-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <p className="text-xs uppercase tracking-[0.14em] font-semibold text-white">Low-Latency Execution</p>
                </div>
                <p className="mt-2 text-xs text-muted leading-relaxed">
                  Execute strategies with direct-to-exchange routing, zero execution lags, and live telemetry.
                </p>
              </div>
            </div>
          </article>

          {/* Right actual login card */}
          <article className="rounded-3xl border border-[rgba(148,163,184,0.22)] bg-[rgba(6,10,18,0.85)] p-8 md:p-10 shadow-[0_30px_70px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col justify-center">
            <h2 className="text-2xl font-semibold tracking-tight text-white">Welcome back</h2>
            <p className="mt-2 text-sm text-muted">Use your Marcus credentials to access the terminal.</p>

            {errorMessage ? (
              <div className="mt-5 rounded-xl border border-[rgba(244,63,94,0.4)] bg-[rgba(127,29,29,0.35)] px-4 py-3 text-sm text-red-200 flex items-center gap-2 animate-pulse">
                <svg className="w-5 h-5 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            ) : null}

            {formError ? (
              <div className="mt-5 rounded-xl border border-[rgba(244,63,94,0.4)] bg-[rgba(127,29,29,0.35)] px-4 py-3 text-sm text-red-200 flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{formError}</span>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.14em] font-medium text-muted">Username or email</span>
                <input
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="duchung02st@gmail.com"
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  className="w-full rounded-xl border border-[rgba(148,163,184,0.35)] bg-[#060a12] px-4 py-3 text-sm text-white outline-none transition-all duration-200 placeholder:text-muted focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.14em] font-medium text-muted">Password</span>
                <input
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-[rgba(148,163,184,0.35)] bg-[#060a12] px-4 py-3 text-sm text-white outline-none transition-all duration-200 placeholder:text-muted focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl cta-primary px-4 py-3.5 text-sm font-semibold active:scale-[0.98] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70 shadow-[0_4px_12px_rgba(16,185,129,0.35)] hover:shadow-[0_6px_16px_rgba(16,185,129,0.5)] cursor-pointer"
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <p className="mt-6 text-xs text-muted text-center flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
              <span>Don&apos;t have an account? <Link href="/register" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">Sign up</Link></span>
            </p>
          </article>
        </section>
      </main>

      {/* Embedded Footer */}
      <SiteFooter />
    </div>
  );
}