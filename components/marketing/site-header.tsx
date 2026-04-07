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

export function SiteHeader() {
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

        <div className="flex items-center gap-3">
          <Link
            href="/terminal"
            className="rounded-xl px-4 py-2 text-sm font-semibold cta-primary transition-colors duration-200"
          >
            Launch App
          </Link>
        </div>
      </div>
    </header>
  );
}
