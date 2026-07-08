import { useTranslations } from 'next-intl';
import { Form, FormField } from '@/components/ui/form-primitive';
import { createRegisterBotSchema, type RegisterBotFormValues } from '@/lib/validations/bot.schema';

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
  const t = useTranslations('CreateBot.form');
  const tValidation = useTranslations('Common.validation');
  const registerBotSchema = createRegisterBotSchema(tValidation);

  return (
    <article className="glass rounded-2xl p-6">
      <h2 className="font-display text-2xl text-main">{t('title')}</h2>
      <p className="mt-2 text-sm text-muted">{t('description')}</p>

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
              <FormField label={t('botName')} error={errors.botName?.message}>
                <input
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-main outline-none focus:border-positive/50"
                  {...register('botName')}
                />
              </FormField>

              <FormField label={t('exchange')} error={errors.exchange?.message}>
                <select
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-main outline-none focus:border-positive/50"
                  {...register('exchange')}
                >
                  <option value="BINANCE">{t('venues.binance')}</option>
                  <option value="BYBIT">{t('venues.bybit')}</option>
                  <option value="OKX">{t('venues.okx')}</option>
                </select>
              </FormField>

              <FormField label={t('tradingPair')} error={errors.tradingPair?.message}>
                <input
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-main outline-none focus:border-positive/50"
                  {...register('tradingPair')}
                  placeholder={t('tradingPairPlaceholder')}
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
                {isSubmitting ? t('submitting') : t('submit')}
              </button>
            </div>
          </>
        )}
      </Form>
    </article>
  );
}
