import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marcus Trading | Trader Workspace',
  description: 'Contract-first Next.js frontend for Marcus Trading.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
