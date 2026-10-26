import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Free AI Marketing Tools | Loraloop',
    template: '%s | Loraloop',
  },
  description:
    'Free AI marketing tools built by Loraloop. Generate brand voices, content calendars, hooks, ad copy, and more — no login required.',
  keywords: ['AI marketing tools', 'free AI tools', 'brand voice generator', 'social media calendar', 'Loraloop'],
  openGraph: {
    siteName: 'Loraloop Free Tools',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
