import { useTranslations } from 'next-intl';

export function ProvisioningFlowPanel() {
  const t = useTranslations('CreateBot.flow');

  return (
    <aside className="glass rounded-2xl p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">{t('title')}</p>
      <ol className="mt-5 space-y-3 text-sm">
        <li className="rounded-xl border border-[var(--primary-soft)] bg-primary-soft px-3 py-3 text-main">
          {t('step1')}
        </li>
        <li className="rounded-xl border border-border px-3 py-3 text-muted">
          {t('step2')}
        </li>
        <li className="rounded-xl border border-border px-3 py-3 text-muted">
          {t('step3')}
        </li>
      </ol>
      <p className="mt-5 text-xs text-negative">{t('warning')}</p>
    </aside>
  );
}
