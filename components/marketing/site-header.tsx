'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/training', label: 'Training' },
  { href: '/market', label: 'Market' },
  { href: '/blog', label: 'Blog' },
  { href: '/research', label: 'Research' },
];

interface SiteHeaderProps {
  isAuthenticated?: boolean;
  role?: string;
  username?: string;
}

export function SiteHeader({ isAuthenticated, role, username }: SiteHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(132,162,191,0.2)] bg-[rgba(4,7,13,0.78)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="font-display text-lg tracking-tight text-white">
          Marcus Trading
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition-colors duration-200 ${
                  active ? 'text-white' : 'text-muted hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!isAuthenticated ? (
            <>
              <Link
                href="/register"
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  pathname === '/register' ? 'bg-[rgba(148,163,184,0.16)] text-white' : 'text-muted hover:text-white'
                }`}
              >
                Sign Up
              </Link>
              <Link
                href="/login?next=/terminal"
                className="rounded-xl px-4 py-2 text-sm font-semibold cta-primary transition-colors duration-200"
              >
                Launch App
              </Link>
            </>
          ) : (
            <>
              <span className="rounded-xl bg-[rgba(148,163,184,0.12)] px-3 py-2 text-sm text-muted">
                {username || 'Trader'} · {role}
              </span>
              <Link
                href="/terminal"
                className="rounded-xl px-4 py-2 text-sm font-semibold cta-primary transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link
                href="/logout"
                className="rounded-xl border border-[rgba(148,163,184,0.3)] px-4 py-2 text-sm text-white transition-colors hover:bg-[rgba(148,163,184,0.12)]"
              >
                Sign Out
              </Link>
            </>
          )}
        </div>

        <details className="relative md:hidden">
          <summary className="list-none cursor-pointer rounded-lg border border-[rgba(148,163,184,0.24)] px-3 py-2 text-xs uppercase tracking-[0.12em] text-white">
            Menu
          </summary>
          <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[rgba(148,163,184,0.2)] bg-[rgba(6,10,18,0.95)] p-3 shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                      active ? 'bg-[rgba(148,163,184,0.16)] text-white' : 'text-muted hover:bg-[rgba(148,163,184,0.08)] hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="my-2 h-px bg-[rgba(148,163,184,0.18)]" />
              {!isAuthenticated ? (
                <>
                  <Link href="/register" className="rounded-lg px-3 py-2 text-sm text-white hover:bg-[rgba(148,163,184,0.08)]">
                    Sign Up
                  </Link>
                  <Link href="/login?next=/terminal" className="rounded-lg cta-primary px-3 py-2 text-sm font-semibold text-center">
                    Launch App
                  </Link>
                </>
              ) : (
                <>
                  <span className="rounded-lg bg-[rgba(148,163,184,0.12)] px-3 py-2 text-xs text-muted">
                    {username || 'Trader'} · {role}
                  </span>
                  <Link href="/terminal" className="rounded-lg cta-primary px-3 py-2 text-sm font-semibold text-center">
                    Dashboard
                  </Link>
                  <Link href="/logout" className="rounded-lg border border-[rgba(148,163,184,0.3)] px-3 py-2 text-sm text-white hover:bg-[rgba(148,163,184,0.08)]">
                    Sign Out
                  </Link>
                </>
              )}
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}
