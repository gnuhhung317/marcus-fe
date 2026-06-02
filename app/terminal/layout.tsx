import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { TerminalShell } from '@/components/terminal/terminal-shell';

export default async function TerminalLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('marcus_access_token')?.value;
  const role = cookieStore.get('marcus_role')?.value;
  const username = cookieStore.get('marcus_username')?.value;

  if (!accessToken || !role || role === 'GUEST') {
    redirect('/login?next=/terminal');
  }

  return <TerminalShell role={role} username={username}>{children}</TerminalShell>;
}
