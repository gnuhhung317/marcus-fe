import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales = ['en', 'vi'];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) {
    notFound();
  }
  const resolvedLocale = locale as (typeof locales)[number];

  return {
    locale: resolvedLocale,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default,
  };
});
