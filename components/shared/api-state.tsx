import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ApiStateCardProps {
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function LoadingStateCard({ title, message }: Pick<ApiStateCardProps, 'title' | 'message'>) {
  return (
    <Card variant="glass-strong" className="p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">Loading</p>
      <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-muted">{message}</p>
      <div className="mt-4 h-2 w-2/3 animate-pulse rounded-full bg-border" />
    </Card>
  );
}

export function ErrorStateCard({ title, message, actionLabel = 'Retry', onAction, actionHref }: ApiStateCardProps) {       
  return (
    <Card variant="glass-strong" className="p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-negative">Error</p>
      <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-negative">{message}</p>
      <div className="mt-4">
        {actionHref ? (
          <Button variant="outline" size="sm" asChild>
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
}

// Note: I added asChild support to Button above, wait, I didn't. I'll need to add it if I want to use Link.
// Or just wrap Link inside Button if Button is just a div/span, but my Button is a button element.
// I'll update Button to support asChild (Radix-like) or just provide an Anchor variant.

export function EmptyStateCard({ title, message, actionLabel, actionHref }: Omit<ApiStateCardProps, 'onAction'>) {
  return (
    <Card variant="glass-strong" className="p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">Empty</p>
      <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-muted">{message}</p>
      {actionLabel && actionHref && (
        <div className="mt-4">
          <Button variant="outline" size="sm" asChild>
             <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        </div>
      )}
    </Card>
  );
}

interface DashboardSkeletonCardProps {
  title?: string;
  lines?: number;
}

export function DashboardSkeletonCard({ title = 'Loading dashboard block', lines = 4 }: DashboardSkeletonCardProps) {      
  return (
    <Card variant="glass-strong" className="p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">Loading</p>
      <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
      <div className="mt-4 space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={`${title}-${index}`}
            className={`h-3 animate-pulse rounded-full bg-border ${index === lines - 1 ? 'w-2/3' : 'w-full'}`}
          />
        ))}
      </div>
    </Card>
  );
}
