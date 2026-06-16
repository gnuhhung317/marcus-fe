import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { TerminalShell } from '@/components/terminal/terminal-shell';

export default async function TerminalLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('marcus_access_token')?.value;
  const role = cookieStore.get('marcus_role')?.value;
  const username = cookieStore.get('marcus_username')?.value;

  // Debug: log all cookie names present in this request
  const allCookieNames = cookieStore.getAll().map((c) => c.name);
  console.log('[TerminalLayout] cookies present:', allCookieNames, '| accessToken present:', !!accessToken, '| role:', role);

  if (!accessToken || !role || role === 'GUEST') {
    console.log('[TerminalLayout] REDIRECTING to login — missing accessToken or role');
    redirect('/login?next=/terminal');
  }

  return <TerminalShell role={role} username={username}>{children}</TerminalShell>;
}
