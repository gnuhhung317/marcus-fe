"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form-primitive';
import { registerSchema, type RegisterFormValues } from '@/lib/validations/auth.schema';
import { setBrowserAccessToken } from '@/lib/api/http';

const REGISTER_ROUTE = '/api/auth/register';

export default function RegisterForm() {
  const t = useTranslations('Register.form');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function onSubmit(data: RegisterFormValues) {
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(REGISTER_ROUTE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          email: data.email.trim(),
          password: data.password,
          displayName: data.displayName.trim(),
          role: data.role,
        }),
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(payload?.message || t('errors.generic'));
      }

      if (typeof payload?.next === 'string' && payload.next.startsWith('/')) {
        if (payload?.accessToken) {
          setBrowserAccessToken(payload.accessToken);
        }

        if (payload.next.startsWith('/login')) {
          setSuccessMessage(t('success'));
        }

        window.location.replace(payload.next);
        return;
      }

      setSuccessMessage(t('success'));
      window.location.replace('/login?registered=true&next=/terminal');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('errors.generic');
      setError(message);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      {error ? (
        <div
          role="alert"
          className="rounded-lg border border-border bg-negative-soft p-3 text-sm text-negative"
        >
          {error}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-lg border border-border bg-positive-soft p-3 text-sm text-positive">
          {successMessage}
        </div>
      ) : null}

      <Form<RegisterFormValues>
        schema={registerSchema}
        onSubmit={onSubmit}
        defaultValues={{
          email: '',
          displayName: '',
          password: '',
          role: 'TRADER',
        }}
      >
        {({ register, formState: { errors, isSubmitting } }) => (
          <>
            <FormField label={t('email')} error={errors.email?.message} hint="Use a reachable email for account recovery.">
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-white outline-none focus:border-positive/50"
              />
            </FormField>

            <FormField label="Account type" error={errors.role?.message} hint="Select developer if you plan to publish bots or integrations.">
              <select
                {...register('role')}
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-white outline-none focus:border-positive/50"
              >
                <option value="TRADER">Trader</option>
                <option value="DEVELOPER">Developer</option>
              </select>
            </FormField>

            <FormField label={t('fullName')} error={errors.displayName?.message}>
              <input
                {...register('displayName')}
                type="text"
                autoComplete="name"
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-white outline-none focus:border-positive/50"
              />
            </FormField>

            <FormField label={t('password')} error={errors.password?.message} hint="At least 8 chars, with upper/lowercase and a number.">
              <input
                {...register('password')}
                type="password"
                autoComplete="new-password"
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-white outline-none focus:border-positive/50"
              />
            </FormField>

            <div className="pt-2">
              <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? t('submitting') : t('submit')}
              </Button>
            </div>
            <p className="text-xs text-muted">By creating an account, you agree to system access and audit policies.</p>
          </>
        )}
      </Form>
    </div>
  );
}
