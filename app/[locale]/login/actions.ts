'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { loginWithCredentials } from '@/lib/contracts/client';

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
    const headersList = headers();
    const xForwardedProto = headersList.get('x-forwarded-proto');
    const referer = headersList.get('referer');
    const isSecure = xForwardedProto === 'https' || (referer ? referer.startsWith('https://') : false);

    cookieStore.set('marcus_access_token', session.accessToken, {
      httpOnly: false,
      sameSite: 'lax',
      secure: isSecure,
      maxAge: session.accessTokenExpiresInSeconds,
      path: '/',
    });

    cookieStore.set('marcus_refresh_token', session.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isSecure,
      maxAge: session.refreshTokenExpiresInSeconds,
      path: '/',
    });

    const sessionRole = session.role ?? 'TRADER';

    cookieStore.set('marcus_role', sessionRole, {
      httpOnly: false,
      sameSite: 'lax',
      secure: isSecure,
      maxAge: session.accessTokenExpiresInSeconds,
      path: '/',
    });

    cookieStore.set('marcus_username', session.username || username, {
      httpOnly: false,
      sameSite: 'lax',
      secure: isSecure,
      maxAge: session.accessTokenExpiresInSeconds,
      path: '/',
    });

    redirect(nextPath);
  } catch {
    redirect(`/login?error=invalid_credentials&next=${encodeURIComponent(nextPath)}`);
  }
}
