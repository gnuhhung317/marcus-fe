import { Form, FormField } from '@/components/ui/form-primitive';
import { registerBotSchema, type RegisterBotFormValues } from '@/lib/validations/bot.schema';

interface RegisterBotFormCardProps {
  isSubmitting: boolean;
  submitError: string | null;
  onSubmit: (data: RegisterBotFormValues) => void;
}

export function RegisterBotFormCard({
  isSubmitting,
  submitError,
  onSubmit,
}: RegisterBotFormCardProps) {
  return (
    <article className="glass rounded-2xl p-6">
      <h2 className="font-display text-2xl text-white">Register Bot</h2>
      <p className="mt-2 text-sm text-muted">Required fields map directly to RegisterBotRequest.</p>

      <Form<RegisterBotFormValues>
        schema={registerBotSchema}
        onSubmit={onSubmit}
        defaultValues={{
          botName: 'MARCUS_SIGNAL_BRIDGE',
          exchange: 'BINANCE',
          tradingPair: 'BTC/USDT',
        }}
        className="mt-5"
      >
        {({ register, formState: { errors } }) => (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Bot Name" error={errors.botName?.message}>
                <input
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-white outline-none focus:border-positive/50"
                  {...register('botName')}
                />
              </FormField>

              <FormField label="Exchange" error={errors.exchange?.message}>
                <select
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-white outline-none focus:border-positive/50"
                  {...register('exchange')}
                >
                  <option value="BINANCE">BINANCE</option>
                  <option value="BYBIT">BYBIT</option>
                  <option value="OKX">OKX</option>
                </select>
              </FormField>

              <FormField label="Trading Pair" error={errors.tradingPair?.message}>
                <input
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-white outline-none focus:border-positive/50"
                  {...register('tradingPair')}
                  placeholder="e.g. BTC/USDT"
                />
              </FormField>
            </div>

            {submitError ? <p className="mt-4 text-sm text-negative">{submitError}</p> : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <button 
                type="submit"
                className="rounded-xl cta-primary px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Generating Secret...' : 'Create Bot'}
              </button>
            </div>
          </>
        )}
      </Form>
    </article>
  );
}