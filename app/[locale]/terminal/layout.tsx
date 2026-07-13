import { cookies } from 'next/headers';
import { getLocale } from 'next-intl/server';
import { TerminalShell } from '@/components/terminal/terminal-shell';
import { redirect } from '@/lib/navigation';

export default async function TerminalLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('marcus_access_token')?.value;
  const role = cookieStore.get('marcus_role')?.value;
  const username = cookieStore.get('marcus_username')?.value;
  const locale = await getLocale();

  // Debug: log all cookie names present in this request
  const allCookieNames = cookieStore.getAll().map((c) => c.name);
  console.log('[TerminalLayout] cookies present:', allCookieNames, '| accessToken present:', !!accessToken, '| role:', role);

  if (!accessToken || !role || role === 'GUEST') {
    console.log('[TerminalLayout] REDIRECTING to login — missing accessToken or role');
    redirect({ href: '/login?next=/terminal', locale });
  }

  return <TerminalShell role={role ?? 'GUEST'} username={username ?? ''}>{children}</TerminalShell>;
}
