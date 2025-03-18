import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Müşteri Destek Sistemi',
  description: 'Modern müşteri destek yönetim sistemi',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>
        {children}
      </body>
    </html>
  );
}