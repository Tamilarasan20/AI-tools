import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Loraloop — Schedule. Publish. Grow.',
  description: 'The all-in-one social media management platform. Schedule posts, manage multiple accounts, and grow your audience.',
  keywords: 'social media management, schedule posts, content calendar, social media automation',
  openGraph: {
    title: 'Loraloop',
    description: 'Schedule. Publish. Grow.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0f0f17] text-white antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
