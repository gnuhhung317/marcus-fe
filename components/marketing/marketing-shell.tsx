import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { SiteFooter } from './site-footer';
import { SiteHeader } from './site-header';

export async function MarketingShell({ children }: { children: ReactNode }) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('marcus_access_token')?.value;
  const role = cookieStore.get('marcus_role')?.value;
  const username = cookieStore.get('marcus_username')?.value;

  return (
    <div className="relative min-h-screen overflow-hidden shell-grid bg-background text-main">
      <SiteHeader isAuthenticated={!!accessToken} role={role} username={username} />
      <main className="mx-auto w-full max-w-7xl px-5 py-10 md:px-8">{children}</main>
      <SiteFooter />
    </div>
  );
}
