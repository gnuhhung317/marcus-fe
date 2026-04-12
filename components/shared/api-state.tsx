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
    <article className="glass-strong rounded-2xl border border-[rgba(148,163,184,0.22)] p-5 shadow-[var(--shadow-soft)]">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">Loading</p>
      <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-muted">{message}</p>
      <div className="mt-4 h-2 w-2/3 animate-pulse rounded-full bg-[rgba(148,163,184,0.35)]" />
    </article>
  );
}

export function ErrorStateCard({ title, message, actionLabel = 'Retry', onAction, actionHref }: ApiStateCardProps) {
  return (
    <article className="glass-strong rounded-2xl border border-[rgba(244,63,94,0.34)] bg-[rgba(127,29,29,0.22)] p-5 shadow-[var(--shadow-soft)]">
      <p className="text-xs uppercase tracking-[0.16em] text-[rgba(254,202,202,0.95)]">Error</p>
      <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-[rgba(254,226,226,0.95)]">{message}</p>
      {actionHref ? (
        <Link href={actionHref} className="mt-4 inline-flex rounded-lg border border-[rgba(254,226,226,0.45)] px-3 py-1.5 text-xs font-semibold text-white">
          {actionLabel}
        </Link>
      ) : (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 rounded-lg border border-[rgba(254,226,226,0.45)] px-3 py-1.5 text-xs font-semibold text-white"
        >
          {actionLabel}
        </button>
      )}
    </article>
  );
}

export function EmptyStateCard({ title, message, actionLabel, actionHref }: Omit<ApiStateCardProps, 'onAction'>) {
  return (
    <article className="glass-strong rounded-2xl border border-[rgba(148,163,184,0.22)] bg-[rgba(8,13,22,0.46)] p-5 shadow-[var(--shadow-soft)]">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">Empty</p>
      <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-muted">{message}</p>
      {actionLabel && actionHref ? (
        <Link href={actionHref} className="mt-4 inline-flex rounded-lg border border-[rgba(148,163,184,0.26)] px-3 py-1.5 text-xs font-semibold text-white">
          {actionLabel}
        </Link>
      ) : null}
    </article>
  );
}