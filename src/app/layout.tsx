import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
