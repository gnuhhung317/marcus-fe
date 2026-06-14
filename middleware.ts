import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const search = request.nextUrl.search;

  // Construct base URL from headers to respect dynamic hostnames/IPs
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1') || host.includes('192.168.');
  const proto = isLocalhost ? 'http' : 'https';
  const baseUrl = `${proto}://${host}`;

  // Read auth cookies — presence check only, no validation/refresh here.
  // Token expiry & refresh is handled client-side via /api/auth/refresh.
  const accessToken = request.cookies.get('marcus_access_token')?.value;
  const role = request.cookies.get('marcus_role')?.value;
  const normalizedRole = role === 'USER' ? 'TRADER' : role;

  const matchesRoute = (route: string) => pathname === route || pathname.startsWith(`${route}/`);

  const publicRoutes = ['/', '/login', '/register', '/logout'];
  const isPublicRoute = publicRoutes.some(matchesRoute);

  const protectedRoutes = ['/terminal', '/developer-console'];
  const isProtectedRoute = protectedRoutes.some(matchesRoute);

  // Not authenticated → only allow public routes
  if (!accessToken || !normalizedRole) {
    if (isPublicRoute) {
      return NextResponse.next();
    }
    if (isProtectedRoute) {
      const nextPath = `${pathname}${search}`;
      return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(nextPath)}`, baseUrl));
    }
    return NextResponse.next();
  }

  // GUEST can only access marketing pages
  if (normalizedRole === 'GUEST') {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL('/', baseUrl));
    }
    return NextResponse.next();
  }

  // Authenticated users: redirect root → terminal
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/terminal/marketplace', baseUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.webp).*)',
  ],
};
