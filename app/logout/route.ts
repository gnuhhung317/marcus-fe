import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const cookieStore = cookies();

  cookieStore.delete('marcus_access_token');
  cookieStore.delete('marcus_refresh_token');
  cookieStore.delete('marcus_role');
  cookieStore.delete('marcus_username');

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
  const proto = request.headers.get('x-forwarded-proto') || 'http';
  const baseUrl = `${proto}://${host}`;

  return NextResponse.redirect(new URL('/login', baseUrl));
}
