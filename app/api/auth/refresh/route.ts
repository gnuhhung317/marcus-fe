import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { refreshWithToken } from '../../../../lib/contracts/client';

const isProduction = process.env.NODE_ENV === 'production';

export async function POST() {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get('marcus_refresh_token')?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: 'missing_refresh_token' }, { status: 401 });
  }

  try {
    const session = await refreshWithToken({ refreshToken });

    if (!session.accessToken || !session.refreshToken) {
      throw new Error('invalid_refresh_response');
    }

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

    cookieStore.set('marcus_username', session.username || 'trader', {
      sameSite: 'lax',
      secure: isProduction,
      maxAge: session.accessTokenExpiresInSeconds,
      path: '/',
    });

    return NextResponse.json({
      accessToken: session.accessToken,
      role: session.role,
      username: session.username,
    });
  } catch {
    cookieStore.delete('marcus_access_token');
    cookieStore.delete('marcus_refresh_token');
    cookieStore.delete('marcus_role');
    cookieStore.delete('marcus_username');

    return NextResponse.json({ error: 'refresh_failed' }, { status: 401 });
  }
}
