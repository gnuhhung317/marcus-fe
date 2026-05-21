import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Extract auth tokens from cookies
  const accessToken = request.cookies.get('marcus_access_token')?.value;
  const role = request.cookies.get('marcus_role')?.value;

  // Public routes (no auth required)
  const publicRoutes = ['/', '/login', '/register', '/logout'];
  const marketingRoutes = ['(marketing)'];

  // Check if current path is public
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route));
  const isMarketingRoute = marketingRoutes.some((route) => pathname.includes(route));

  // Routes that require authentication
  const protectedRoutes = ['/terminal', '/developer-console'];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // Case 1: User is NOT authenticated
  if (!accessToken || !role) {
    // Allow access to public routes and marketing
    if (isPublicRoute || isMarketingRoute) {
      return NextResponse.next();
    }

    // Redirect to login if trying to access protected route
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(pathname)}`, request.url));
    }

    // For root "/" or marketing paths, continue
    return NextResponse.next();
  }

  // Case 2: User IS authenticated
  // GUEST role can only access marketing and login
  if (role === 'GUEST') {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // TRADER, DEVELOPER, OPERATOR, ADMIN can access terminal
  if (role === 'TRADER' || role === 'DEVELOPER' || role === 'OPERATOR' || role === 'ADMIN') {
    // Redirect to terminal/marketplace if accessing root or marketing after login
    if (pathname === '/' || isMarketingRoute) {
      return NextResponse.redirect(new URL('/terminal/marketplace', request.url));
    }

    // Allow access to terminal routes
    if (isProtectedRoute) {
      return NextResponse.next();
    }

    return NextResponse.next();
  }

  // Default: continue as-is
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.webp).*)',
  ],
};
