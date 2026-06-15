interface EmptyFleetStateProps {
  onReset: () => void;
}

export function EmptyFleetState({ onReset }: EmptyFleetStateProps) {
  return (
    <div className="text-center py-16 rounded-2xl border border-dashed border-border bg-surface/40 max-w-md mx-auto my-4">
      <svg className="w-8 h-8 text-muted mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p className="text-xs text-muted">No routers match your active search filter settings.</p>
      <button
        onClick={onReset}
        className="mt-3 inline-flex items-center gap-1 text-[11px] text-positive hover:text-emerald-300 font-bold transition-colors cursor-pointer"
      >
        Reset all filters
      </button>
    </div>
  );
}
