import type { Metadata } from 'next';
import { Barlow, Epilogue } from 'next/font/google';
import EplSignInPrototype from './EplSignInPrototype';

const barlow = Barlow({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-barlow' });
const epilogue = Epilogue({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-epilogue' });

export const metadata: Metadata = {
  title: 'EPL Sign In Prototype',
  robots: { index: false },
};

export default function EplSignInPrototypePage() {
  return (
    <div className={`${barlow.variable} ${epilogue.variable} mx-auto max-w-6xl px-4 py-10`}>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">El Pollo Loco: Sign In &amp; Account Recovery</h1>
        <p className="mt-1 text-gray-500">Clickable prototype of the &ldquo;After Migration&rdquo; flows from the Brand Refresh Figma file.</p>
      </div>
      <EplSignInPrototype />
    </div>
  );
}
