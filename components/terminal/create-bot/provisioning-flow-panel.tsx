export function ProvisioningFlowPanel() {
  return (
    <aside className="glass rounded-2xl p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">Provisioning Flow</p>
      <ol className="mt-5 space-y-3 text-sm">
        <li className="rounded-xl border border-[var(--primary-soft)] bg-[var(--primary-soft)] px-3 py-3 text-white">
          01. Register bot via /bots
        </li>
        <li className="rounded-xl border border-[var(--panel-border)] px-3 py-3 text-muted">
          02. Receive apiKey + rawSecret (one-time)
        </li>
        <li className="rounded-xl border border-[var(--panel-border)] px-3 py-3 text-muted">
          03. Deploy runtime and send signals using secret
        </li>
      </ol>
      <p className="mt-5 text-xs text-negative">Never expose rawSecret in client apps or browser logs.</p>
    </aside>
  );
}