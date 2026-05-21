import { NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/lib/config/env';

const isProduction = process.env.NODE_ENV === 'production';

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload) {
    return NextResponse.json({ message: 'Invalid request payload.' }, { status: 400 });
  }

  try {
    const apiBaseUrl = getApiBaseUrl();
    const response = await fetch(`${apiBaseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const body = await response.json().catch(() => ({}));

    const responsePayload = {
      ...body,
      next:
        body?.accessToken && body?.refreshToken
          ? '/terminal?onboard=true'
          : '/login?registered=true&next=/terminal',
    };

    const nextResponse = NextResponse.json(responsePayload, { status: response.status });

    if (response.ok && body?.accessToken && body?.refreshToken) {
      nextResponse.cookies.set('marcus_access_token', String(body.accessToken), {
        sameSite: 'lax',
        secure: isProduction,
        maxAge: Number(body?.accessTokenExpiresInSeconds ?? 3600),
        path: '/',
      });

      nextResponse.cookies.set('marcus_refresh_token', String(body.refreshToken), {
        httpOnly: true,
        sameSite: 'lax',
        secure: isProduction,
        maxAge: Number(body?.refreshTokenExpiresInSeconds ?? 604800),
        path: '/',
      });

      nextResponse.cookies.set('marcus_role', String(body?.role ?? 'TRADER'), {
        sameSite: 'lax',
        secure: isProduction,
        maxAge: Number(body?.accessTokenExpiresInSeconds ?? 3600),
        path: '/',
      });

      nextResponse.cookies.set('marcus_username', String(body?.username ?? body?.displayName ?? payload?.displayName ?? 'Trader'), {
        sameSite: 'lax',
        secure: isProduction,
        maxAge: Number(body?.accessTokenExpiresInSeconds ?? 3600),
        path: '/',
      });
    }

    return nextResponse;
  } catch {
    return NextResponse.json(
      { message: 'Registration service is not available yet. Please contact support or use an existing account.' },
      { status: 503 }
    );
  }
}
