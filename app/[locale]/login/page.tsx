import { cookies } from 'next/headers';
import { Suspense } from 'react';
import { hasAuthenticatedSession, normalizeRole } from '@/lib/auth/session-state';
import LoginClient from './login-client';

interface LoginPageProps {
  searchParams?: {
    error?: string;
    next?: string;
    logged_out?: string;
  };
}

const locales = ['en', 'vi'] as const;

function normalizeNext(raw?: string) {
  if (!raw) {
    return '/terminal';
  }

  try {
    const parsed = new URL(raw, 'http://localhost');
    const localePrefixedTerminalPath = new RegExp(`^/(?:${locales.join('|')})/terminal(?:/.*)?$`);

    if (parsed.pathname.startsWith('/terminal') || localePrefixedTerminalPath.test(parsed.pathname)) {
      return raw;
    }
  } catch {
    // Fall through to the default terminal route when the provided next value is malformed.
  }

  return '/terminal';
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('marcus_access_token')?.value;
  const refreshToken = cookieStore.get('marcus_refresh_token')?.value;
  const role = cookieStore.get('marcus_role')?.value;
  const username = cookieStore.get('marcus_username')?.value;

  return (
    <Suspense fallback={null}>
      <LoginClient
        initialError={searchParams?.error}
        initialIsAuthenticated={hasAuthenticatedSession({ accessToken, refreshToken, role })}
        initialLoggedOut={searchParams?.logged_out === '1'}
        initialNextPath={normalizeNext(searchParams?.next)}
        initialRole={normalizeRole(role)}
        initialUsername={username}
      />
    </Suspense>
  );
}
