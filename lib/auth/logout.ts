import { NextResponse } from 'next/server';

const AUTH_COOKIE_NAMES = [
  'marcus_access_token',
  'marcus_refresh_token',
  'marcus_role',
  'marcus_username',
] as const;

export function clearAuthCookies(response: NextResponse) {
  AUTH_COOKIE_NAMES.forEach((name) => {
    response.cookies.delete(name);
  });
}
