import './globals.css';
import type { Metadata } from 'next';
import { QueryProvider } from '@/components/providers/query-provider';

export const metadata: Metadata = {
  title: 'Marcus Trading | Trader Workspace',
  description: 'Contract-first Next.js frontend for Marcus Trading.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
