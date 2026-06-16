import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'vi'];
const defaultLocale = 'en';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

function isRedirectResponse(response: NextResponse) {
  return response.status >= 300 && response.status < 400 && response.headers.has('location');
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const search = request.nextUrl.search;

  // 1. Run intlMiddleware to handle locale prefixing
  const response = intlMiddleware(request);

  // If intlMiddleware redirected to add or normalize a locale prefix, return it immediately.
  if (isRedirectResponse(response)) {
    return response;
  }

  // 2. Auth Logic
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1') || host.includes('192.168.');
  const proto = isLocalhost ? 'http' : 'https';
  const baseUrl = `${proto}://${host}`;

  const accessToken = request.cookies.get('marcus_access_token')?.value;
  const role = request.cookies.get('marcus_role')?.value;
  const normalizedRole = role === 'USER' ? 'TRADER' : role;

  // Extract locale from pathname (e.g., /en/login -> en)
  const segments = pathname.split('/');
  const locale = locales.includes(segments[1]) ? segments[1] : defaultLocale;
  const pathWithoutLocale = locales.includes(segments[1]) ? `/${segments.slice(2).join('/')}` : pathname;

  const matchesRoute = (route: string) => pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`);

  const publicRoutes = ['/', '/login', '/register', '/logout'];
  const isPublicRoute = publicRoutes.some(matchesRoute);

  const protectedRoutes = ['/terminal', '/developer-console'];
  const isProtectedRoute = protectedRoutes.some(matchesRoute);

  // Not authenticated → only allow public routes
  if (!accessToken || !normalizedRole) {
    if (isPublicRoute) {
      return response;
    }
    if (isProtectedRoute) {
      const nextPath = `${pathname}${search}`;
      return NextResponse.redirect(new URL(`/${locale}/login?next=${encodeURIComponent(nextPath)}`, baseUrl));
    }
    return response;
  }

  // GUEST can only access marketing pages
  if (normalizedRole === 'GUEST') {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL(`/${locale}`, baseUrl));
    }
    return response;
  }

  // Authenticated users: redirect root → terminal
  if (pathWithoutLocale === '/') {
    return NextResponse.redirect(new URL(`/${locale}/terminal`, baseUrl));
  }

  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - API routes
    // - _next (static files)
    // - file extensions (e.g. .svg, .png)
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.webp).*)',
  ],
};
