import '../globals.css';
import type { Metadata } from 'next';
import { QueryProvider } from '@/components/providers/query-provider';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Marcus Trading | Trader Workspace',
  description: 'Contract-first Next.js frontend for Marcus Trading.',
};

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>{children}</QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
