export function CreateBotHeader() {
  return (
    <header>
      <p className="text-xs uppercase tracking-[0.18em] text-muted">Bot Provisioning</p>
      <h1 className="mt-3 font-display text-4xl text-white">Create Bot and Issue Secret</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted">
        Register bot metadata, receive credentials once, then deploy your runtime and authenticate signal traffic with
        the generated secret.
      </p>
    </header>
  );
}