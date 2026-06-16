'use client';

import { useLocale } from 'next-intl';
import { Languages } from 'lucide-react';
import { usePathname, useRouter } from '@/lib/navigation';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function onLocaleChange(nextLocale: string) {
    router.replace(pathname, { locale: nextLocale as 'en' | 'vi' });
  }

  return (
    <label className="inline-flex h-9 items-center gap-2 rounded-xl border border-border/40 bg-surface/50 px-3 text-sm text-main transition-colors hover:bg-surface/80">
      <Languages className="h-4 w-4 text-muted" />
      <select
        value={locale}
        onChange={(event) => onLocaleChange(event.target.value)}
        className="bg-transparent text-sm outline-none"
        aria-label="Language"
      >
        <option value="en">English</option>
        <option value="vi">Tiếng Việt</option>
      </select>
    </label>
  );
}
