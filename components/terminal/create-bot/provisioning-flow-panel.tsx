export function ProvisioningFlowPanel() {
  return (
    <aside className="glass rounded-2xl p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">Provisioning Flow</p>
      <ol className="mt-5 space-y-3 text-sm">
        <li className="rounded-xl border border-[rgba(34,197,94,0.36)] bg-[rgba(34,197,94,0.1)] px-3 py-3 text-white">
          01. Register bot via /bots
        </li>
        <li className="rounded-xl border border-[rgba(132,162,191,0.2)] px-3 py-3 text-muted">
          02. Receive apiKey + rawSecret (one-time)
        </li>
        <li className="rounded-xl border border-[rgba(132,162,191,0.2)] px-3 py-3 text-muted">
          03. Deploy runtime and send signals using secret
        </li>
      </ol>
      <p className="mt-5 text-xs text-negative">Never expose rawSecret in client apps or browser logs.</p>
    </aside>
  );
}