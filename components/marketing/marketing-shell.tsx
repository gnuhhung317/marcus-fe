import { ReactNode } from 'react';
import { SiteFooter } from './site-footer';
import { SiteHeader } from './site-header';

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden shell-grid">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(148,163,184,0.12),transparent_55%)]" />
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-5 py-10 md:px-8">{children}</main>
      <SiteFooter />
    </div>
  );
}
