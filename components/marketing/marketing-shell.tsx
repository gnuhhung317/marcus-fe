import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { hasAuthenticatedSession, normalizeRole } from '@/lib/auth/session-state';
import { SiteFooter } from './site-footer';
import { SiteHeader } from './site-header';

export async function MarketingShell({ children }: { children: ReactNode }) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('marcus_access_token')?.value;
  const refreshToken = cookieStore.get('marcus_refresh_token')?.value;
  const role = cookieStore.get('marcus_role')?.value;
  const username = cookieStore.get('marcus_username')?.value;
  const normalizedRole = normalizeRole(role);
  const isAuthenticated = hasAuthenticatedSession({ accessToken, refreshToken, role });

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden shell-grid bg-background text-main">
      <SiteHeader isAuthenticated={isAuthenticated} role={normalizedRole} username={username} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-10 md:px-8">{children}</main>
      <SiteFooter />
    </div>
  );
}
