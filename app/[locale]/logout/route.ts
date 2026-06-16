import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

function clearAuthCookies() {
  const cookieStore = cookies();
  cookieStore.delete('marcus_access_token');
  cookieStore.delete('marcus_refresh_token');
  cookieStore.delete('marcus_role');
  cookieStore.delete('marcus_username');
}

export async function POST() {
  clearAuthCookies();
  return NextResponse.json({ success: true });
}

export async function GET(request: Request) {
  const isPrefetch = 
    request.headers.get('purpose') === 'prefetch' || 
    request.headers.get('x-purpose') === 'prefetch';

  if (isPrefetch) {
    return new NextResponse(null, { status: 204 });
  }

  clearAuthCookies();

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
  const proto = request.headers.get('x-forwarded-proto') || 'http';
  const baseUrl = `${proto}://${host}`;

  return NextResponse.redirect(new URL('/login?logged_out=1', baseUrl));
}
