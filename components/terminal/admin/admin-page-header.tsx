import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  action?: ReactNode;
}

export function AdminPageHeader({ title, description, backHref, action }: AdminPageHeaderProps) {
  const t = useTranslations('Common.actions');

  return (
    <div className="flex flex-col gap-4 border-b border-border/60 pb-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          {backHref ? (
            <Button asChild variant="ghost" size="icon" className="h-9 w-9">
              <Link href={backHref} aria-label={t('back')}>
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
          ) : null}
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold tracking-tight text-main">{title}</h1>
            {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
          </div>
        </div>
      </div>

      {action ? <div className={cn('shrink-0')}>{action}</div> : null}
    </div>
  );
}
