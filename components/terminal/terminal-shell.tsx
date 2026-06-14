'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { useFeatureFlag } from '@/lib/hooks/useFeatureFlag';
import { SiteHeader } from '@/components/marketing/site-header';
import { Card } from '@/components/ui/card';

const terminalNav = [
  { href: '/terminal/marketplace', label: 'Marketplace', roles: ['TRADER', 'OPERATOR', 'ADMIN'] },
  { href: '/terminal/leaderboard', label: 'Leaderboard', roles: ['TRADER', 'OPERATOR', 'ADMIN'] },
  { href: '/terminal/create-bot', label: 'Create Bot', roles: ['OPERATOR', 'ADMIN'] },
  { href: '/terminal/profile', label: 'Profile', roles: ['TRADER', 'DEVELOPER', 'OPERATOR', 'ADMIN'] },
  { href: '/terminal/developer-dashboard', label: 'Developer Dashboard', roles: ['DEVELOPER', 'OPERATOR', 'ADMIN'] },      
  { href: '/terminal/developer-console', label: 'Developer Console', roles: ['OPERATOR', 'ADMIN'] },
] as const;

function isAllowedRole(role: string, allowedRoles: readonly string[]) {
  return allowedRoles.includes(role);
}

function getIcon(href: string) {
  switch (href) {
    case '/terminal/decision':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      );
    case '/terminal/monitoring':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case '/terminal/marketplace':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      );
    case '/terminal/leaderboard':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /> 
        </svg>
      );
    case '/terminal/create-bot':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case '/terminal/profile':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    case '/terminal/developer-console':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    case '/terminal/developer-dashboard':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      );
  }
}

export function TerminalShell({ children, role, username }: { children: ReactNode; role: string; username?: string }) {    
  const pathname = usePathname();
  const dashboardV2Enabled = useFeatureFlag('dashboard-v2');
  const normalizedRole = role === 'USER' ? 'TRADER' : role;
  const visibleNav = terminalNav.filter((item) => isAllowedRole(normalizedRole, item.roles));

  const tradingDeskNav = visibleNav.filter(
    (item) =>
      item.href === '/terminal/marketplace' ||
      item.href === '/terminal/leaderboard'
  );

  const executionNav = visibleNav.filter(
    (item) =>
      item.href === '/terminal/create-bot' ||
      item.href === '/terminal/developer-dashboard' ||
      item.href === '/terminal/developer-console'
  );

  const accountNav = visibleNav.filter((item) => item.href === '/terminal/profile');

  const renderLink = (item: { href: string; label: string }) => {
    const active = pathname === item.href;
      return (
          <Link
        key={item.href}
        href={item.href}
        className={`group flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
          active
            ? 'bg-primary-soft text-positive border-l-2 border-positive rounded-l-none pl-3'    
            : 'text-muted hover:bg-surface hover:text-white'
        }`}
      >
        <span className={active ? 'text-positive' : 'text-muted group-hover:text-white transition-colors'}>       
          {getIcon(item.href)}
        </span>
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,var(--primary-soft),transparent_50%),var(--bg-canvas)] text-white">
      <SiteHeader isAuthenticated role={normalizedRole} username={username} />
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-6 px-4 py-4 lg:grid-cols-[240px_1fr] lg:px-6">    
        <aside className="lg:sticky lg:top-4 h-fit">
          <Card variant="glass" className="flex flex-col gap-5 p-4">
            <div className="h-px bg-border-base" />

            {/* Dashboards Section */}
            {isAllowedRole(normalizedRole, ['TRADER', 'OPERATOR', 'ADMIN']) && (
              <div className="space-y-2">
                <p className="px-3.5 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Dashboards</p>
                <nav className="space-y-1">
                  <Link
                    href="/terminal/decision"
                    className={`group flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                      pathname === '/terminal/decision'
                        ? 'bg-primary-soft text-positive border-l-2 border-positive rounded-l-none pl-3'
                          : 'text-muted hover:bg-surface hover:text-white'
                    }`}
                  >
                    <span className={pathname === '/terminal/decision' ? 'text-positive' : 'text-muted group-hover:text-white transition-colors'}>
                      {getIcon('/terminal/decision')}
                    </span>
                    <span className="flex items-center gap-1.5 flex-1 justify-between">
                      <span>Decision Dashboard</span>
                      {dashboardV2Enabled && <span className="text-[9px] bg-positive-soft border border-border text-positive px-1 py-0.5 rounded font-bold font-mono">P1</span>}
                    </span>
                  </Link>

                  <Link
                    href="/terminal/monitoring"
                    className={`group flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                      pathname === '/terminal/monitoring'
                        ? 'bg-primary-soft text-positive border-l-2 border-positive rounded-l-none pl-3'
                        : 'text-muted hover:bg-surface hover:text-white'
                    }`}
                  >
                    <span className={pathname === '/terminal/monitoring' ? 'text-positive' : 'text-muted group-hover:text-white transition-colors'}>
                      {getIcon('/terminal/monitoring')}
                    </span>
                    <span className="flex items-center gap-1.5 flex-1 justify-between">
                      <span>Monitoring</span>
                      <span className="text-[9px] bg-surface border border-border text-muted px-1 py-0.5 rounded font-bold font-mono">P2</span>
                    </span>
                  </Link>
                </nav>
              </div>
            )}

            {/* Trading Desk Section */}
            {tradingDeskNav.length > 0 && (
              <div className="space-y-2">
                <p className="px-3.5 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Trading Desk</p>
                <nav className="space-y-1">{tradingDeskNav.map(renderLink)}</nav>
              </div>
            )}

            {/* Execution & Simulation Section */}
            {executionNav.length > 0 && (
              <div className="space-y-2">
                <p className="px-3.5 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Execution & Sim</p>       
                <nav className="space-y-1">{executionNav.map(renderLink)}</nav>
              </div>
            )}

            {/* Account Section */}
            {accountNav.length > 0 && (
              <div className="space-y-2">
                <p className="px-3.5 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Settings</p>
                <nav className="space-y-1">{accountNav.map(renderLink)}</nav>
              </div>
            )}
          </Card>
        </aside>
        <div className="min-h-[84vh] p-0">
          {children}
        </div>
      </div>
    </div>
  );
}
