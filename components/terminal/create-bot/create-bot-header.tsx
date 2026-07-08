import { useTranslations } from 'next-intl';

export function CreateBotHeader() {
  const t = useTranslations('CreateBot.header');

  return (
    <header>
      <p className="text-xs uppercase tracking-[0.18em] text-muted">{t('eyebrow')}</p>
      <h1 className="mt-3 font-display text-4xl text-main">{t('title')}</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted">{t('description')}</p>
    </header>
  );
}
