import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { refreshWithToken } from '../../../../lib/api/http';

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

    const nextResponse = NextResponse.json(
      {
        accessToken: session.accessToken,
        role: session.role,
        username: session.username,
      },
      { status: 200 },
    );

    nextResponse.cookies.set('marcus_access_token', session.accessToken, {
      sameSite: 'lax',
      secure: isProduction,
      maxAge: session.accessTokenExpiresInSeconds,
      path: '/',
    });

    nextResponse.cookies.set('marcus_refresh_token', session.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      maxAge: session.refreshTokenExpiresInSeconds,
      path: '/',
    });

    nextResponse.cookies.set('marcus_role', session.role || 'TRADER', {
      sameSite: 'lax',
      secure: isProduction,
      maxAge: session.accessTokenExpiresInSeconds,
      path: '/',
    });

    nextResponse.cookies.set('marcus_username', session.username || 'trader', {
      sameSite: 'lax',
      secure: isProduction,
      maxAge: session.accessTokenExpiresInSeconds,
      path: '/',
    });

    return nextResponse;
  } catch {
    const nextResponse = NextResponse.json({ error: 'refresh_failed' }, { status: 401 });

    nextResponse.cookies.delete('marcus_access_token');
    nextResponse.cookies.delete('marcus_refresh_token');
    nextResponse.cookies.delete('marcus_role');
    nextResponse.cookies.delete('marcus_username');

    return nextResponse;
  }
}
