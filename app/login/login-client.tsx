'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ArrowRight, LockKeyhole, Mail, ShieldCheck, Zap } from 'lucide-react';
import { SiteHeader } from '@/components/marketing/site-header';
import { SiteFooter } from '@/components/marketing/site-footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { loginSchema, type LoginFormValues } from '@/lib/validations/auth.schema';
import { clearBrowserAccessToken, setBrowserAccessToken } from '@/lib/api/http';

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
  initialLoggedOut?: boolean;
}

const LOGIN_ROUTE = '/api/auth/login';

export default function LoginClient({ initialNextPath, initialError, initialLoggedOut }: LoginClientProps) {
  const errorMessage = getErrorMessage(initialError);
  const [formError, setFormError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (initialLoggedOut) {
      clearBrowserAccessToken();
    }
  }, [initialLoggedOut]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setFormError(undefined);

    try {
      const response = await fetch(LOGIN_ROUTE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ username: data.username.trim(), password: data.password }),
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

      setBrowserAccessToken(payload.accessToken);
      window.location.replace(initialNextPath);
    } catch (error) {
      setFormError('Login service is temporarily unavailable.');
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden shell-grid bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.14),transparent_46%),radial-gradient(circle_at_80%_10%,hsl(var(--info)/0.10),transparent_34%),hsl(var(--background))] text-main">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--foreground)/0.08),transparent_55%)]" />

      <SiteHeader isAuthenticated={false} />

      <main className="relative z-10 flex flex-grow items-center justify-center px-4 py-12 md:py-16">
        <section className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr] items-stretch">
          <Card variant="glass-strong" className="flex flex-col justify-between p-8 md:p-10">
            <div>
              <Badge variant="success" className="border-primary/20 bg-primary-soft text-positive">
                Marcus Trading Ecosystem
              </Badge>
              <h1 className="mt-4 text-2xl font-semibold tracking-tight text-main md:text-3xl leading-snug">
                Next-Gen Algorithmic Trading
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Unlock professional quantitative execution, real-time portfolio intelligence, and secure API bot operations in a unified workspace.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/60 bg-surface/70 p-5 transition-colors duration-300 hover:border-primary/25">
                <div className="flex items-center gap-2 text-positive">
                  <ShieldCheck className="h-5 w-5" />
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-main">Institutional Security</p>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  Enterprise session encryption, secure MFA authorization, and isolated API-key bots safeguard your trades.
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-surface/70 p-5 transition-colors duration-300 hover:border-primary/25">
                <div className="flex items-center gap-2 text-info">
                  <Zap className="h-5 w-5" />
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-main">Low-Latency Execution</p>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  Execute bots with direct-to-exchange routing, zero execution lags, and live telemetry.
                </p>
              </div>
            </div>
          </Card>

          <Card variant="glass-strong" className="flex flex-col justify-center p-8 md:p-10">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-positive">Terminal Access</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-main">Welcome back</h2>
              <p className="mt-2 text-sm text-muted">Use your Marcus credentials to access the terminal.</p>
            </div>

            {errorMessage ? (
              <div className="mt-5 flex items-start gap-2 rounded-xl border border-negative/30 bg-negative-soft px-4 py-3 text-sm text-main">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-negative" />
                <span>{errorMessage}</span>
              </div>
            ) : null}

            {formError ? (
              <div className="mt-5 flex items-start gap-2 rounded-xl border border-negative/30 bg-negative-soft px-4 py-3 text-sm text-main">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-negative" />
                <span>{formError}</span>
              </div>
            ) : null}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
              <label className="block space-y-2">
                <span className="text-xs font-medium uppercase tracking-widest text-muted">Username or email</span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <Input
                    {...register('username')}
                    type="text"
                    required
                    autoComplete="username"
                    placeholder="duchung02st@gmail.com"
                    className="h-12 pl-10"
                  />
                </div>
                {errors.username ? <p className="mt-1 text-xs text-negative">{errors.username.message}</p> : null}
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-medium uppercase tracking-widest text-muted">Password</span>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <Input
                    {...register('password')}
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="h-12 pl-10"
                  />
                </div>
                {errors.password ? <p className="mt-1 text-xs text-negative">{errors.password.message}</p> : null}
              </label>

              <Button type="submit" className="h-12 w-full" isLoading={isSubmitting}>
                {isSubmitting ? 'Signing In...' : 'Sign In'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <p className="mt-6 flex flex-col items-center justify-center gap-2 text-center text-xs text-muted sm:flex-row sm:gap-3">
              <span>
                Don&apos;t have an account?{' '}
                <Button asChild variant="link" className="h-auto p-0 text-positive">
                  <Link href="/register">Sign up</Link>
                </Button>
              </span>
            </p>
          </Card>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
