'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

const terminalNav = [
  { href: '/terminal', label: 'Dashboard' },
  { href: '/terminal/marketplace', label: 'Marketplace' },
  { href: '/terminal/strategies', label: 'Strategies' },
  { href: '/terminal/create-bot', label: 'Create Bot' },
  { href: '/terminal/paper-trading', label: 'Paper Trading' },
  { href: '/terminal/profile', label: 'Profile' },
  { href: '/terminal/developer-console', label: 'Developer Console' },
  { href: '/terminal/leaderboard', label: 'Leaderboard' },
];

export function TerminalShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(148,163,184,0.14),transparent_45%),#050810] text-white">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-6 px-4 py-4 lg:grid-cols-[230px_1fr] lg:px-6">
        <aside className="glass h-fit rounded-2xl p-4 lg:sticky lg:top-4">
          <Link href="/" className="text-sm font-semibold tracking-[0.03em] text-white">
            Terminal v1.0
          </Link>
          <nav className="mt-6 space-y-1">
            {terminalNav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-xl px-3 py-2 text-sm transition-colors duration-200 ${
                    active
                      ? 'bg-[var(--primary-soft)] text-positive'
                      : 'text-muted hover:bg-[rgba(148,163,184,0.09)] hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 rounded-xl border border-[rgba(148,163,184,0.22)] bg-[rgba(8,13,22,0.55)] p-3">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted">Status</p>
            <p className="mt-2 text-sm text-positive">Secure Core Active</p>
          </div>
        </aside>
        <div className="glass-strong min-h-[84vh] rounded-2xl border border-[rgba(148,163,184,0.22)] p-5 md:p-7">{children}</div>
      </div>
    </div>
  );
}
