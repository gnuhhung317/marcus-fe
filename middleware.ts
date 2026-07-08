import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { hasAuthenticatedSession, normalizeRole } from '@/lib/auth/session-state';
import { getApiBaseUrl } from '@/lib/config/env';

const locales = ['en', 'vi'];
const defaultLocale = 'en';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

interface RefreshSessionResponse {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiresInSeconds?: number;
  refreshTokenExpiresInSeconds?: number;
  role?: string;
  username?: string;
}

function isRedirectResponse(response: NextResponse) {
  return response.status >= 300 && response.status < 400 && response.headers.has('location');
}

async function refreshSession(refreshToken: string) {
  const response = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
    cache: 'no-store',
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json().catch(() => null)) as RefreshSessionResponse | null;
  if (!payload?.accessToken || !payload?.refreshToken) {
    return null;
  }

  return payload;
}

function clearSessionCookies(response: NextResponse) {
  response.cookies.delete('marcus_access_token');
  response.cookies.delete('marcus_refresh_token');
  response.cookies.delete('marcus_role');
  response.cookies.delete('marcus_username');
}

function applySessionCookies(response: NextResponse, payload: RefreshSessionResponse, isSecure: boolean) {
  response.cookies.set('marcus_access_token', payload.accessToken!, {
    httpOnly: false,
    sameSite: 'lax',
    secure: isSecure,
    maxAge: Number(payload.accessTokenExpiresInSeconds ?? 3600),
    path: '/',
  });

  response.cookies.set('marcus_refresh_token', payload.refreshToken!, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isSecure,
    maxAge: Number(payload.refreshTokenExpiresInSeconds ?? 604800),
    path: '/',
  });

  response.cookies.set('marcus_role', String(payload.role ?? 'TRADER'), {
    httpOnly: false,
    sameSite: 'lax',
    secure: isSecure,
    maxAge: Number(payload.refreshTokenExpiresInSeconds ?? 604800),
    path: '/',
  });

  response.cookies.set('marcus_username', String(payload.username ?? 'Trader'), {
    httpOnly: false,
    sameSite: 'lax',
    secure: isSecure,
    maxAge: Number(payload.refreshTokenExpiresInSeconds ?? 604800),
    path: '/',
  });
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const search = request.nextUrl.search;

  const response = intlMiddleware(request);
  if (isRedirectResponse(response)) {
    return response;
  }

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1') || host.includes('192.168.');
  const proto = isLocalhost ? 'http' : 'https';
  const baseUrl = `${proto}://${host}`;

  const accessToken = request.cookies.get('marcus_access_token')?.value;
  const refreshToken = request.cookies.get('marcus_refresh_token')?.value;
  const role = request.cookies.get('marcus_role')?.value;
  const normalizedRole = normalizeRole(role);
  const hasAuthenticatedUser = hasAuthenticatedSession({ accessToken, refreshToken, role });

  const segments = pathname.split('/');
  const locale = locales.includes(segments[1]) ? segments[1] : defaultLocale;
  const pathWithoutLocale = locales.includes(segments[1]) ? `/${segments.slice(2).join('/')}` : pathname;

  const matchesRoute = (route: string) => pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`);

  const publicRoutes = ['/', '/login', '/register', '/logout'];
  const isPublicRoute = publicRoutes.some(matchesRoute);

  const protectedRoutes = ['/terminal', '/developer-console'];
  const isProtectedRoute = protectedRoutes.some(matchesRoute);

  const shouldRefreshProtectedSession = Boolean(!accessToken && refreshToken && normalizedRole && normalizedRole !== 'GUEST' && isProtectedRoute);

  if (shouldRefreshProtectedSession) {
    const refreshedSession = await refreshSession(refreshToken!);

    if (refreshedSession) {
      const refreshedResponse = NextResponse.redirect(new URL(request.url));
      applySessionCookies(refreshedResponse, refreshedSession, !isLocalhost);
      return refreshedResponse;
    }

    const nextPath = `${pathname}${search}`;
    const redirectResponse = NextResponse.redirect(new URL(`/${locale}/login?next=${encodeURIComponent(nextPath)}`, baseUrl));
    clearSessionCookies(redirectResponse);
    return redirectResponse;
  }

  if (!hasAuthenticatedUser) {
    if (isPublicRoute) {
      return response;
    }
    if (isProtectedRoute) {
      const nextPath = `${pathname}${search}`;
      return NextResponse.redirect(new URL(`/${locale}/login?next=${encodeURIComponent(nextPath)}`, baseUrl));
    }
    return response;
  }

  if (normalizedRole === 'GUEST') {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL(`/${locale}`, baseUrl));
    }
    return response;
  }

  if (pathWithoutLocale === '/') {
    return NextResponse.redirect(new URL(`/${locale}/terminal`, baseUrl));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.webp).*)',
  ],
};
