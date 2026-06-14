'use client';

import { ReactNode } from 'react';
import { SiteHeader } from '@/components/marketing/site-header';
import { TerminalSidebar } from '@/components/terminal/terminal-sidebar';

export function TerminalShell({ children, role, username }: { children: ReactNode; role: string; username?: string }) {
  const normalizedRole = role === 'USER' ? 'TRADER' : role;

  return (
    <div className="min-h-screen bg-canvas text-main">
      <SiteHeader isAuthenticated role={normalizedRole} username={username} />
      <div className="flex w-full min-w-0 flex-col lg:flex-row">
        <TerminalSidebar role={normalizedRole} />
        <main className="min-w-0 flex-1 px-4 py-4 lg:px-6 lg:py-6">{children}</main>
      </div>
    </div>
  );
}
