'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { useFeatureFlag } from '@/lib/hooks/useFeatureFlag';
import { SiteHeader } from '@/components/marketing/site-header';

const terminalNav = [
  { href: '/terminal/marketplace', label: 'Marketplace', roles: ['TRADER', 'OPERATOR', 'ADMIN'] },
  { href: '/terminal/leaderboard', label: 'Leaderboard', roles: ['TRADER', 'OPERATOR', 'ADMIN'] },
  { href: '/terminal/strategies', label: 'Strategies', roles: ['OPERATOR', 'ADMIN'] },
  { href: '/terminal/create-bot', label: 'Create Bot', roles: ['OPERATOR', 'ADMIN'] },
  { href: '/terminal/paper-trading', label: 'Paper Trading', roles: ['OPERATOR', 'ADMIN'] },
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
    case '/terminal/strategies':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      );
    case '/terminal/create-bot':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case '/terminal/paper-trading':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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

export function TerminalShell({ children, role }: { children: ReactNode; role: string }) {
  const pathname = usePathname();
  const dashboardV2Enabled = useFeatureFlag('dashboard-v2');
  const visibleNav = terminalNav.filter((item) => isAllowedRole(role, item.roles));

  const tradingDeskNav = visibleNav.filter(
    (item) =>
      item.href === '/terminal/marketplace' ||
      item.href === '/terminal/leaderboard' ||
      item.href === '/terminal/strategies'
  );

  const executionNav = visibleNav.filter(
    (item) =>
      item.href === '/terminal/create-bot' ||
      item.href === '/terminal/paper-trading' ||
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
            ? 'bg-[var(--primary-soft)] text-[var(--positive)] border-l-2 border-[var(--positive)] rounded-l-none pl-3'
            : 'text-muted hover:bg-[var(--panel)] hover:text-white'
        }`}
      >
        <span className={active ? 'text-[var(--positive)]' : 'text-slate-400 group-hover:text-white transition-colors'}>
          {getIcon(item.href)}
        </span>
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,var(--primary-soft),transparent_50%),var(--bg-0)] text-white">
      <SiteHeader isAuthenticated role={role} />
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-6 px-4 py-4 lg:grid-cols-[240px_1fr] lg:px-6">
        <aside className="glass h-fit rounded-2xl p-4 lg:sticky lg:top-4 flex flex-col gap-6">
          {/* Workspace Info Connection */}
          <div className="flex items-center justify-between border-b border-[var(--panel-border)] pb-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400">Terminal Connected</span>
            </div>
          </div>

          <div className="px-1 -mt-2">
            <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500 font-semibold">Active Workspace</p>
            <h3 className="text-sm font-semibold text-slate-200 mt-1 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Marcus Algo Desk
            </h3>
          </div>

          {/* Dashboards Section */}
          {isAllowedRole(role, ['TRADER', 'OPERATOR', 'ADMIN']) && (
            <div className="space-y-2">
              <p className="px-3.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Dashboards</p>
              <nav className="space-y-1">
                <Link
                  href="/terminal/decision"
                  className={`group flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                    pathname === '/terminal/decision'
                      ? 'bg-[var(--primary-soft)] text-[var(--positive)] border-l-2 border-[var(--positive)] rounded-l-none pl-3'
                        : 'text-muted hover:bg-[var(--panel)] hover:text-white'
                  }`}
                >
                  <span className={pathname === '/terminal/decision' ? 'text-[var(--positive)]' : 'text-slate-400 group-hover:text-white transition-colors'}>
                    {getIcon('/terminal/decision')}
                  </span>
                  <span className="flex items-center gap-1.5 flex-1 justify-between">
                    <span>Decision Dashboard</span>
                    {dashboardV2Enabled && <span className="text-[9px] bg-positive/10 border border-positive/20 text-positive px-1 py-0.5 rounded font-bold font-mono">P1</span>}
                  </span>
                </Link>

                <Link
                  href="/terminal/monitoring"
                  className={`group flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                    pathname === '/terminal/monitoring'
                      ? 'bg-[var(--primary-soft)] text-[var(--positive)] border-l-2 border-[var(--positive)] rounded-l-none pl-3'
                      : 'text-muted hover:bg-[var(--panel)] hover:text-white'
                  }`}
                >
                  <span className={pathname === '/terminal/monitoring' ? 'text-[var(--positive)]' : 'text-slate-400 group-hover:text-white transition-colors'}>
                    {getIcon('/terminal/monitoring')}
                  </span>
                  <span className="flex items-center gap-1.5 flex-1 justify-between">
                    <span>Monitoring</span>
                    <span className="text-[9px] bg-slate-800 border border-slate-700 text-slate-400 px-1 py-0.5 rounded font-bold font-mono">P2</span>
                  </span>
                </Link>
              </nav>
            </div>
          )}

          {/* Trading Desk Section */}
          {tradingDeskNav.length > 0 && (
            <div className="space-y-2">
              <p className="px-3.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Trading Desk</p>
              <nav className="space-y-1">{tradingDeskNav.map(renderLink)}</nav>
            </div>
          )}

          {/* Execution & Simulation Section */}
          {executionNav.length > 0 && (
            <div className="space-y-2">
              <p className="px-3.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Execution & Sim</p>
              <nav className="space-y-1">{executionNav.map(renderLink)}</nav>
            </div>
          )}

          {/* Account Section */}
          {accountNav.length > 0 && (
            <div className="space-y-2">
              <p className="px-3.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Settings</p>
              <nav className="space-y-1">{accountNav.map(renderLink)}</nav>
            </div>
          )}

          {/* System & Engine Status Card */}
          <div className="mt-auto pt-4 border-t border-[var(--panel-border)] space-y-3">
            <div className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] p-3.5 shadow-sm backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">System Core</span>
                <span className="flex h-2 w-2 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Trading Core:</span>
                  <span className="font-mono text-emerald-400 font-semibold">Active</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Node Latency:</span>
                  <span className="font-mono text-emerald-400">18ms</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Active Node:</span>
                  <span className="font-mono text-slate-300">SG-CORE-02</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[var(--panel-border)] flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-mono">v1.4.2</span>
                <span className="text-slate-400">Role: <span className="text-emerald-400 font-mono font-bold">{role}</span></span>
              </div>
            </div>
          </div>
        </aside>
        <div className="glass-strong min-h-[84vh] rounded-2xl border border-[var(--panel-border)] p-5 md:p-7">{children}</div>
      </div>
    </div>
  );
}
