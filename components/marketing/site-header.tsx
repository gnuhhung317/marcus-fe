'use client';

import type { MouseEvent } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/lib/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { cn } from '@/lib/utils';
import brandLogo from '@/assets/images/marcustradingvn-Photoroom.png';

interface SiteHeaderProps {
  isAuthenticated?: boolean;
  role?: string;
  username?: string;
}

function formatRole(role?: string): string {
  if (!role) return '';

  const map: Record<string, string> = {
    ADMIN: 'Admin',
    USER: 'Trader',
    TRADER: 'Trader',
    DEVELOPER: 'Developer',
    OPERATOR: 'Operator',
  };

  return map[role.toUpperCase()] ?? role;
}

export function SiteHeader({ isAuthenticated, role, username }: SiteHeaderProps) {
  const t = useTranslations('Common');
  const pathname = usePathname();
  const router = useRouter();
  const focusClass =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background';

  const navItems = [
    { href: '/', label: t('home') },
    { href: '/training', label: 'Training' },
    { href: '/market', label: 'Market' },
    { href: '/blog', label: 'Blog' },
    { href: '/research', label: 'Research' },
  ];

  const handleLogout = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout failed:', err);
    }

    if (typeof window !== 'undefined') {
      localStorage.removeItem('marcus_access_token');
      localStorage.removeItem('marcus_refresh_token');
      localStorage.removeItem('marcus_role');
      localStorage.removeItem('marcus_username');
    }

    router.push('/login?logged_out=1');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" aria-label="Marcus Trading home" className={cn('inline-flex items-center gap-2 text-lg text-main', focusClass)}>
          <Image
            src={brandLogo}
            alt="Marcus Trading logo"
            width={32}
            height={32}
            className="size-8 rounded-md object-contain"
            priority
          />
          <span className="font-display">Marcus Trading</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                size="sm"
                className={cn('h-9 px-3 text-sm', active ? 'text-main' : 'text-muted')}
              >
                <Link href={item.href as any} aria-current={active ? 'page' : undefined} className={focusClass}>
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          {!isAuthenticated ? (
            <>
              <Button
                asChild
                variant="outline"
                size="sm"
                className={cn('h-9 px-4 text-sm', pathname === '/register' ? 'border-border bg-surface text-main' : '')}
              >
                <Link href="/register" aria-label="Open registration" className={focusClass}>
                  {t('register')}
                </Link>
              </Button>
              <Button asChild size="sm" className="h-9 px-4 text-sm">
                <Link href="/login?next=/terminal" aria-label="Sign in" className={focusClass}>
                  {t('login')}
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Badge variant="outline" className="rounded-xl px-3 py-2 text-[11px] uppercase tracking-[0.12em]">
                {username ?? formatRole(role)}
              </Badge>
              <Button asChild size="sm" className="h-9 px-4 text-sm">
                <Link href="/terminal" aria-label="Go to dashboard" className={focusClass}>
                  Dashboard
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="h-9 px-4 text-sm" onClick={handleLogout} aria-label="Sign out">
                {t('logout')}
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitcher />
          <details className="relative">
            <summary
              aria-label="Open menu"
              className={cn('list-none cursor-pointer rounded-lg border border-border/60 px-3 py-2 text-xs uppercase tracking-[0.12em] text-main', focusClass)}
            >
              Menu
            </summary>
            <Card variant="glass-strong" className="absolute right-0 mt-2 w-56 p-3 shadow-[var(--shadow-soft)]">
              <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Button
                      key={item.href}
                      asChild
                      variant="ghost"
                      size="sm"
                      className={cn('h-9 w-full justify-start px-3 text-sm', active ? 'text-main' : 'text-muted')}
                    >
                      <Link href={item.href as any} aria-current={active ? 'page' : undefined} className={focusClass}>
                        {item.label}
                      </Link>
                    </Button>
                  );
                })}

                <div className="my-2 h-px bg-border/60" />

                {!isAuthenticated ? (
                  <>
                    <Button asChild variant="outline" size="sm" className="h-9 w-full justify-start px-3 text-sm">
                      <Link href="/register" aria-label="Open registration" className={focusClass}>
                        {t('register')}
                      </Link>
                    </Button>
                    <Button asChild size="sm" className="h-9 w-full justify-start px-3 text-sm">
                      <Link href="/login?next=/terminal" aria-label="Sign in" className={focusClass}>
                        {t('login')}
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Badge variant="outline" className="rounded-lg px-3 py-2 text-xs uppercase tracking-[0.12em]">
                      {username ?? formatRole(role)}
                    </Badge>
                    <Button asChild size="sm" className="h-9 w-full justify-start px-3 text-sm">
                      <Link href="/terminal" aria-label="Go to dashboard" className={focusClass}>
                        Dashboard
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 w-full justify-start px-3 text-sm" onClick={handleLogout} aria-label="Sign out">
                      {t('logout')}
                    </Button>
                  </>
                )}
              </nav>
            </Card>
          </details>
        </div>
      </div>
    </header>
  );
}
