import { NextResponse } from 'next/server';
import { clearAuthCookies } from '@/lib/auth/logout';

export async function POST() {
  const response = NextResponse.json({ success: true });
  clearAuthCookies(response);
  return response;
}

export async function GET(request: Request) {
  const isPrefetch = 
    request.headers.get('purpose') === 'prefetch' || 
    request.headers.get('x-purpose') === 'prefetch';

  if (isPrefetch) {
    return new NextResponse(null, { status: 204 });
  }

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
  const proto = request.headers.get('x-forwarded-proto') || 'http';
  const baseUrl = `${proto}://${host}`;
  const response = NextResponse.redirect(new URL('/login?logged_out=1', baseUrl));

  clearAuthCookies(response);
  return response;
}
