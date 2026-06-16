'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/lib/navigation';
import { ChevronLeft, ChevronRight, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { getVisibleTerminalSections, type TerminalNavItem } from '@/components/terminal/terminal-nav';
import { useSidebarState } from '@/lib/hooks/use-sidebar-state';

function isTerminalLinkActive(pathname: string, href: string) {
  return pathname === href;
}

function TerminalNavLink({
  item,
  collapsed,
  active,
  t,
}: {
  item: TerminalNavItem;
  collapsed: boolean;
  active: boolean;
  t: any;
}) {
  const label = t(`nav.${item.labelKey}`);
  const link = (
    <Button
      asChild
      variant="ghost"
      size="sm"
      className={cn(
        'group w-full shrink-0 justify-start border-l-2 border-l-transparent transition-all duration-200',
        collapsed && 'lg:w-10 lg:justify-center lg:px-0',
        active ? 'border-positive bg-positive/10 text-positive' : 'text-muted hover:bg-surface hover:text-main'
      )}
    >
      <Link href={item.href as any} aria-current={active ? 'page' : undefined} aria-label={label}>
        <item.icon className="size-4 shrink-0" />
        <span className={cn('min-w-0 truncate', collapsed && 'lg:sr-only')}>{label}</span>
      </Link>
    </Button>
  );

  if (!collapsed) {
    return link;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right" align="center">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

function TerminalSidebarSection({
  labelKey,
  items,
  collapsed,
  pathname,
  t,
}: {
  labelKey: string;
  items: readonly TerminalNavItem[];
  collapsed: boolean;
  pathname: string;
  t: any;
}) {
  const label = t(`nav.${labelKey}`);
  return (
    <section className="space-y-2">
      <p className={cn('px-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted', collapsed && 'lg:sr-only')}>
        {label}
      </p>
      <nav className="space-y-1" aria-label={label}>
        {items.map((item) => (
          <TerminalNavLink key={item.href} item={item} collapsed={collapsed} active={isTerminalLinkActive(pathname, item.href)} t={t} />
        ))}
      </nav>
    </section>
  );
}

export function TerminalSidebar({ role }: { role: string }) {
  const t = useTranslations('Terminal');
  const pathname = usePathname();
  const { isCollapsed, toggleCollapsed } = useSidebarState();
  const sections = getVisibleTerminalSections(role);

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'flex w-full flex-col border-b border-border/60 bg-canvas/80 backdrop-blur-xl lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r lg:overflow-y-auto',
          isCollapsed && 'lg:w-16'
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border/60 px-3 py-3">
          <div className={cn('flex min-w-0 items-center gap-3', isCollapsed && 'lg:justify-center')}>
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-positive">
              <Terminal className="size-4" />
            </div>
            <div className={cn('min-w-0', isCollapsed && 'lg:sr-only')}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">{t('sidebar.navigation')}</p>
              <p className="truncate text-sm font-medium text-main">Navigation</p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn('hidden shrink-0 border-border/70 bg-surface/60 text-main hover:bg-surface lg:inline-flex')}
            onClick={toggleCollapsed}
            aria-label={isCollapsed ? t('sidebar.expand') : t('sidebar.collapse')}
          >
            {isCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </Button>
        </div>

        <div className="flex flex-col gap-5 px-3 py-3 lg:flex-1 lg:overflow-y-auto">
          {sections.map((section) => (
            <TerminalSidebarSection
              key={section.labelKey}
              labelKey={section.labelKey}
              items={section.items}
              collapsed={isCollapsed}
              pathname={pathname}
              t={t}
            />
          ))}
        </div>
      </aside>
    </TooltipProvider>
  );
}
