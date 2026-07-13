import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales = ['en', 'vi'] as const;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>) {
  const result: Record<string, unknown> = { ...target };

  for (const [key, value] of Object.entries(source)) {
    const existing = result[key];

    if (isPlainObject(existing) && isPlainObject(value)) {
      result[key] = deepMerge(existing, value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  const resolvedLocale = locale as (typeof locales)[number];
  const [common, marketing, admin, terminal] = await Promise.all([
    import(`../messages/${resolvedLocale}/common.json`),
    import(`../messages/${resolvedLocale}/marketing.json`),
    import(`../messages/${resolvedLocale}/admin.json`),
    import(`../messages/${resolvedLocale}/terminal.json`),
  ]);

  return {
    locale: resolvedLocale,
    messages: deepMerge(
      deepMerge(deepMerge(common.default, marketing.default), admin.default),
      terminal.default
    ),
  };
});
