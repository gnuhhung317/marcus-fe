import { RegisterBotInput } from '../../../lib/contracts/types';

interface RegisterBotFormCardProps {
  values: RegisterBotInput;
  isSubmitting: boolean;
  submitError: string | null;
  onFieldChange: <K extends keyof RegisterBotInput>(field: K, value: RegisterBotInput[K]) => void;
  onSubmit: () => void;
}

export function RegisterBotFormCard({
  values,
  isSubmitting,
  submitError,
  onFieldChange,
  onSubmit,
}: RegisterBotFormCardProps) {
  return (
    <article className="glass rounded-2xl p-6">
      <h2 className="font-display text-2xl text-white">Register Bot</h2>
      <p className="mt-2 text-sm text-muted">Required fields map directly to RegisterBotRequest.</p>

      <form
        className="mt-5"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-muted">
            Bot Name
            <input
              className="mt-2 w-full rounded-xl border border-[rgba(132,162,191,0.2)] bg-[rgba(6,10,18,0.6)] px-3 py-2 text-white"
              value={values.botName}
              onChange={(event) => onFieldChange('botName', event.target.value)}
            />
          </label>

          <label className="text-sm text-muted">
            Exchange
            <select
              className="mt-2 w-full rounded-xl border border-[rgba(132,162,191,0.2)] bg-[rgba(6,10,18,0.6)] px-3 py-2 text-white"
              value={values.exchange}
              onChange={(event) => onFieldChange('exchange', event.target.value as RegisterBotInput['exchange'])}
            >
              <option value="BINANCE">BINANCE</option>
              <option value="BYBIT">BYBIT</option>
              <option value="OKX">OKX</option>
            </select>
          </label>

          <label className="text-sm text-muted">
            Trading Pair
            <input
              className="mt-2 w-full rounded-xl border border-[rgba(132,162,191,0.2)] bg-[rgba(6,10,18,0.6)] px-3 py-2 text-white"
              value={values.tradingPair}
              onChange={(event) => onFieldChange('tradingPair', event.target.value)}
            />
          </label>
        </div>

        {submitError ? <p className="mt-4 text-sm text-negative">{submitError}</p> : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button className="rounded-xl cta-primary px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting}>
            {isSubmitting ? 'Generating Secret...' : 'Create Bot'}
          </button>
        </div>
      </form>
    </article>
  );
}