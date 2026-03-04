import type { Metadata } from 'next';
import './globals.css';
import { TabBar } from '@/components/ui/TabBar';

export const metadata: Metadata = {
  title: 'PickleMate Demo',
  description: 'Demo-mode pickleball operations app',
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="mx-auto max-w-3xl px-4 pb-24 pt-6">
        {children}
        <TabBar />
      </body>
    </html>
  );
}
