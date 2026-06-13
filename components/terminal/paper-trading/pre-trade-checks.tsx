interface PreTradeCheck {
  label: string;
  pass: boolean;
}

interface PreTradeChecksProps {
  checks: PreTradeCheck[];
}

export function PreTradeChecks({ checks }: PreTradeChecksProps) {
  return (
    <div className="mt-5 rounded-xl border border-border bg-surface p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-muted">Pre-Trade Checks</p>
      <ul className="mt-3 space-y-2 text-sm">
        {checks.map((check) => (
          <li key={check.label} className={check.pass ? 'text-positive' : 'text-negative'}>
            {check.pass ? 'PASS' : 'BLOCK'} · {check.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
