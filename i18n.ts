import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

// Can be imported from a shared config
const locales = ['en', 'vi'];

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();
  const resolvedLocale = locale as (typeof locales)[number];

  return {
    locale: resolvedLocale,
    messages: (await import(`./messages/${resolvedLocale}.json`)).default
  };
});
