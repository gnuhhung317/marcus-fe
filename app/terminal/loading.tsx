import { LoadingStateCard } from '@/components/shared/api-state';

export default function TerminalLoading() {
  return (
    <div className="space-y-4">
      <LoadingStateCard title="Loading terminal data" message="Fetching latest contracts and execution snapshots." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="glass-strong h-28 animate-pulse rounded-2xl bg-[rgba(148,163,184,0.14)]" />
        <div className="glass-strong h-28 animate-pulse rounded-2xl bg-[rgba(148,163,184,0.14)]" />
        <div className="glass-strong h-28 animate-pulse rounded-2xl bg-[rgba(148,163,184,0.14)]" />
        <div className="glass-strong h-28 animate-pulse rounded-2xl bg-[rgba(148,163,184,0.14)]" />
      </div>
    </div>
  );
}