import Link from 'next/link';

interface ApiStateCardProps {
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function LoadingStateCard({ title, message }: Pick<ApiStateCardProps, 'title' | 'message'>) {
  return (
    <article className="glass-strong rounded-2xl border border-[var(--panel-border)] p-5 shadow-[var(--shadow-soft)]">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">Loading</p>
      <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-muted">{message}</p>
      <div className="mt-4 h-2 w-2/3 animate-pulse rounded-full bg-[var(--panel-border)]" />
    </article>
  );
}

export function ErrorStateCard({ title, message, actionLabel = 'Retry', onAction, actionHref }: ApiStateCardProps) {
  return (
    <article className="glass-strong rounded-2xl border border-[var(--panel-border)] p-5 shadow-[var(--shadow-soft)]">
      <p className="text-xs uppercase tracking-[0.16em] text-negative">Error</p>
      <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-negative">{message}</p>
      {actionHref ? (
        <Link href={actionHref} className="mt-4 inline-flex rounded-lg border border-[var(--panel-border)] px-3 py-1.5 text-xs font-semibold text-white">
          {actionLabel}
        </Link>
      ) : (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 rounded-lg border border-[var(--panel-border)] px-3 py-1.5 text-xs font-semibold text-white"
        >
          {actionLabel}
        </button>
      )}
    </article>
  );
}

export function EmptyStateCard({ title, message, actionLabel, actionHref }: Omit<ApiStateCardProps, 'onAction'>) {
  return (
    <article className="glass-strong rounded-2xl border border-[var(--panel-border)] p-5 shadow-[var(--shadow-soft)]">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">Empty</p>
      <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-muted">{message}</p>
      {actionLabel && actionHref ? (
        <Link href={actionHref} className="mt-4 inline-flex rounded-lg border border-[var(--panel-border)] px-3 py-1.5 text-xs font-semibold text-white">
          {actionLabel}
        </Link>
      ) : null}
    </article>
  );
}

interface DashboardSkeletonCardProps {
  title?: string;
  lines?: number;
}

export function DashboardSkeletonCard({ title = 'Loading dashboard block', lines = 4 }: DashboardSkeletonCardProps) {
  return (
    <article className="glass-strong rounded-2xl border border-[var(--panel-border)] p-5 shadow-[var(--shadow-soft)]">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">Loading</p>
      <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
      <div className="mt-4 space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={`${title}-${index}`}
            className={`h-3 animate-pulse rounded-full bg-[var(--panel-border)] ${index === lines - 1 ? 'w-2/3' : 'w-full'}`}
          />
        ))}
      </div>
    </article>
  );
}