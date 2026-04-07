import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[rgba(132,162,191,0.16)] py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-4 px-5 md:flex-row md:items-center md:px-8">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
          2026 Marcus Trading Systems. Operational Intelligence Layer.
        </p>
        <div className="flex items-center gap-6 text-xs text-muted">
          <Link href="/research" className="transition-colors duration-200 hover:text-white">
            Research
          </Link>
          <Link href="/blog" className="transition-colors duration-200 hover:text-white">
            Blog
          </Link>
          <a href="#" className="transition-colors duration-200 hover:text-white">
            API Docs
          </a>
        </div>
      </div>
    </footer>
  );
}
