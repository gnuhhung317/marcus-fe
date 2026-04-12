import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const cookieStore = cookies();

  cookieStore.delete('marcus_access_token');
  cookieStore.delete('marcus_refresh_token');
  cookieStore.delete('marcus_role');
  cookieStore.delete('marcus_username');

  return NextResponse.redirect(new URL('/login', request.url));
}
