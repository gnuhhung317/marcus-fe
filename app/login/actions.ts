'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { loginWithCredentials } from '../../lib/contracts/client';

const isProduction = process.env.NODE_ENV === 'production';

function normalizeNextPath(value: FormDataEntryValue | null) {
  if (typeof value !== 'string') {
    return '/terminal';
  }

  if (!value.startsWith('/')) {
    return '/terminal';
  }

  if (!value.startsWith('/terminal')) {
    return '/terminal';
  }

  return value;
}

export async function loginAction(formData: FormData) {
  const username = String(formData.get('username') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const nextPath = normalizeNextPath(formData.get('next'));

  if (!username || !password) {
    redirect(`/login?error=missing_credentials&next=${encodeURIComponent(nextPath)}`);
  }

  try {
    const session = await loginWithCredentials({ username, password });

    if (!session.accessToken || !session.refreshToken) {
      redirect(`/login?error=invalid_credentials&next=${encodeURIComponent(nextPath)}`);
    }

    const cookieStore = cookies();

    cookieStore.set('marcus_access_token', session.accessToken, {
      sameSite: 'lax',
      secure: isProduction,
      maxAge: session.accessTokenExpiresInSeconds,
      path: '/',
    });

    cookieStore.set('marcus_refresh_token', session.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      maxAge: session.refreshTokenExpiresInSeconds,
      path: '/',
    });

    cookieStore.set('marcus_role', session.role || 'TRADER', {
      sameSite: 'lax',
      secure: isProduction,
      maxAge: session.accessTokenExpiresInSeconds,
      path: '/',
    });

    cookieStore.set('marcus_username', session.username || username, {
      sameSite: 'lax',
      secure: isProduction,
      maxAge: session.accessTokenExpiresInSeconds,
      path: '/',
    });

    redirect(nextPath);
  } catch {
    redirect(`/login?error=invalid_credentials&next=${encodeURIComponent(nextPath)}`);
  }
}
