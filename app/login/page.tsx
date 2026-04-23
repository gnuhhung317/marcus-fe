import { Suspense } from 'react';
import LoginClient from './login-client';

interface LoginPageProps {
  searchParams?: {
    error?: string;
    next?: string;
  };
}

function normalizeNext(raw?: string) {
  if (!raw || !raw.startsWith('/terminal')) {
    return '/terminal';
  }

  return raw;
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <Suspense fallback={null}>
      <LoginClient initialError={searchParams?.error} initialNextPath={normalizeNext(searchParams?.next)} />
    </Suspense>
  );
}
