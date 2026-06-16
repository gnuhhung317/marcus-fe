'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ArrowRight, LockKeyhole, Mail, ShieldCheck, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SiteHeader } from '@/components/marketing/site-header';
import { SiteFooter } from '@/components/marketing/site-footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { loginSchema, type LoginFormValues } from '@/lib/validations/auth.schema';
import { clearBrowserAccessToken, setBrowserAccessToken } from '@/lib/api/http';

interface LoginClientProps {
  initialNextPath: string;
  initialError?: string;
  initialLoggedOut?: boolean;
}

const LOGIN_ROUTE = '/api/auth/login';

export default function LoginClient({ initialNextPath, initialError, initialLoggedOut }: LoginClientProps) {
  const t = useTranslations('Login');
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const getErrorMessage = (error?: string) => {
    if (error === 'missing_credentials') {
      return t('errors.missingCredentials');
    }
  
    if (error === 'invalid_credentials') {
      return t('errors.invalidCredentials');
    }
  
    if (error === 'service_unavailable') {
      return t('errors.serviceUnavailable');
    }
  
    return undefined;
  };

  const errorMessage = getErrorMessage(initialError);

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
          setFormError(t('errors.invalidUserPass'));
          return;
        }

        setFormError(payload?.message || t('errors.genericFail', { status: response.status }));
        return;
      }

      if (!payload?.accessToken || !payload?.refreshToken) {
        setFormError(payload?.message || t('errors.noTokens'));
        return;
      }

      setBrowserAccessToken(payload.accessToken);
      window.location.replace(initialNextPath);
    } catch (error) {
      setFormError(t('errors.serviceUnavailable'));
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden shell-grid bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.14),transparent_46%),radial-gradient(circle_at_80%_10%,hsl(var(--info)/0.10),transparent_34%),hsl(var(--background))] text-main">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--foreground)/0.08),transparent_55%)]" />

      <SiteHeader isAuthenticated={false} />

      <main className="relative z-10 flex flex-grow items-center justify-center px-4 py-12 md:py-16">
        <section className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr] items-stretch">
          <Card variant="glass-strong" className="flex flex-col justify-between p-8 md:p-10">
            <div className="flex flex-col gap-4">
              <Badge variant="success">
                {t('ecosystem')}
              </Badge>
              <h1 className="text-2xl font-semibold leading-snug tracking-tight text-main md:text-3xl">
                {t('headline')}
              </h1>
              <p className="text-sm leading-relaxed text-muted">
                {t('description')}
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/60 bg-surface/70 p-5 transition-colors duration-300 hover:border-primary/25">
                <div className="flex items-center gap-2 text-positive">
                  <ShieldCheck className="h-5 w-5" />
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-main">{t('securityTitle')}</p>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {t('securityDesc')}
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-surface/70 p-5 transition-colors duration-300 hover:border-primary/25">
                <div className="flex items-center gap-2 text-info">
                  <Zap className="h-5 w-5" />
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-main">{t('latencyTitle')}</p>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {t('latencyDesc')}
                </p>
              </div>
            </div>
          </Card>

          <Card variant="glass-strong" className="flex flex-col justify-center p-8 md:p-10">
            <div className="flex flex-col gap-2">
              <p className="text-xs uppercase tracking-[0.18em] text-positive">{t('terminalAccess')}</p>
              <h2 className="text-2xl font-semibold tracking-tight text-main">{t('welcomeBack')}</h2>
              <p className="text-sm text-muted">{t('instructions')}</p>
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

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-5">
              <label className="flex flex-col gap-2">
                <span className="text-xs font-medium uppercase tracking-widest text-muted">{t('usernameOrEmail')}</span>
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

              <label className="flex flex-col gap-2">
                <span className="text-xs font-medium uppercase tracking-widest text-muted">{t('Auth.password')}</span>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <Input
                    {...register('password')}
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="********"
                    className="h-12 pl-10"
                  />
                </div>
                {errors.password ? <p className="mt-1 text-xs text-negative">{errors.password.message}</p> : null}
              </label>

              <Button type="submit" className="h-12 w-full" isLoading={isSubmitting}>
                {isSubmitting ? t('signingIn') : t('signIn')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <p className="mt-6 flex flex-col items-center justify-center gap-2 text-center text-xs text-muted sm:flex-row sm:gap-3">
              <span>
                {t('noAccount')}{' '}
                <Button asChild variant="link" className="h-auto p-0 text-positive">
                  <Link href="/register">{t('signUp')}</Link>
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
