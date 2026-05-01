"use client";

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const REGISTER_ROUTE = '/api/auth/register';

export default function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'USER' | 'DEVELOPER'>('USER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const emailRef = useRef<HTMLInputElement>(null);
  const displayNameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);

  function validateForm() {
    const trimmedEmail = email.trim();
    const trimmedDisplayName = displayName.trim();
    const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
    const hasStrongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);

    if (!trimmedDisplayName) {
      displayNameRef.current?.focus();
      return 'Display name is required.';
    }

    if (!hasEmail) {
      emailRef.current?.focus();
      return 'Please enter a valid email address.';
    }

    if (!hasStrongPassword) {
      passwordRef.current?.focus();
      return 'Password must be at least 8 characters and include uppercase, lowercase, and a number.';
    }

    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(REGISTER_ROUTE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ email: email.trim(), password, displayName: displayName.trim(), role }),
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(payload?.message || 'Registration failed.');
      }

      if (typeof payload?.next === 'string' && payload.next.startsWith('/')) {
        if (payload.next.startsWith('/login')) {
          setSuccessMessage('Account created successfully. Redirecting to login...');
        }

        router.push(payload.next);
        return;
      }

      setSuccessMessage('Account created successfully. Redirecting to login...');
      router.push('/login?registered=true&next=/terminal');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unexpected error.';
      setError(message);
      alertRef.current?.focus();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4" noValidate>
      {error ? (
        <div
          ref={alertRef}
          role="alert"
          tabIndex={-1}
          className="rounded-lg border border-[rgba(244,63,94,0.4)] bg-[rgba(127,29,29,0.35)] p-3 text-sm text-red-100"
        >
          {error}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-lg border border-[rgba(16,185,129,0.36)] bg-[rgba(6,78,59,0.35)] p-3 text-sm text-[rgba(209,250,229,0.95)]">
          {successMessage}
        </div>
      ) : null}

      <div>
        <label htmlFor="register-email" className="block text-sm font-medium text-white">Email</label>
        <input
          ref={emailRef}
          id="register-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          autoComplete="email"
          aria-describedby="register-email-hint"
          className="mt-1 block w-full rounded-md border border-[rgba(148,163,184,0.22)] bg-[rgba(15,23,42,0.72)] px-3 py-2 text-white shadow-sm outline-none transition-colors placeholder:text-muted focus:border-[rgba(16,185,129,0.52)]"
        />
        <p id="register-email-hint" className="mt-1 text-xs text-muted">Use a reachable email for account recovery.</p>
      </div>

      <div>
        <label htmlFor="register-role" className="block text-sm font-medium text-white">Account type</label>
        <select
          id="register-role"
          value={role}
          onChange={(e) => setRole(e.target.value as 'USER' | 'DEVELOPER')}
          className="mt-1 block w-full rounded-md border border-[rgba(148,163,184,0.22)] bg-[rgba(15,23,42,0.72)] px-3 py-2 text-white shadow-sm outline-none transition-colors focus:border-[rgba(16,185,129,0.52)]"
        >
          <option value="USER">User</option>
          <option value="DEVELOPER">Developer</option>
        </select>
        <p className="mt-1 text-xs text-muted">Select developer if you plan to publish bots or integrations.</p>
      </div>

      <div>
        <label htmlFor="register-display-name" className="block text-sm font-medium text-white">Display name</label>
        <input
          ref={displayNameRef}
          id="register-display-name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          type="text"
          required
          autoComplete="name"
          className="mt-1 block w-full rounded-md border border-[rgba(148,163,184,0.22)] bg-[rgba(15,23,42,0.72)] px-3 py-2 text-white shadow-sm outline-none transition-colors placeholder:text-muted focus:border-[rgba(16,185,129,0.52)]"
        />
      </div>

      <div>
        <label htmlFor="register-password" className="block text-sm font-medium text-white">Password</label>
        <input
          ref={passwordRef}
          id="register-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          aria-describedby="register-password-hint"
          className="mt-1 block w-full rounded-md border border-[rgba(148,163,184,0.22)] bg-[rgba(15,23,42,0.72)] px-3 py-2 text-white shadow-sm outline-none transition-colors placeholder:text-muted focus:border-[rgba(16,185,129,0.52)]"
        />
        <p id="register-password-hint" className="mt-1 text-xs text-muted">At least 8 chars, with upper/lowercase and a number.</p>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-md bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </div>
      <p className="text-xs text-muted">By creating an account, you agree to system access and audit policies.</p>
    </form>
  );
}
