import Link from 'next/link';

const tools = [
  { name: 'Brand Voice Generator', href: '/tools/brand-voice' },
  { name: 'Social Media Calendar', href: '/tools/social-calendar' },
  { name: 'Content Pillar Generator', href: '/tools/content-pillars' },
  { name: 'Hook Generator', href: '/tools/hook-generator' },
  { name: 'Competitor Audit Tool', href: '/tools/competitor-audit' },
  { name: 'Ad Copy Generator', href: '/tools/ad-copy' },
  { name: 'Marketing Strategy Generator', href: '/tools/marketing-strategy' },
  { name: 'Landing Page Copy Generator', href: '/tools/landing-page-copy' },
  { name: 'Product Description Generator', href: '/tools/product-description' },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-gradient-to-br from-violet-600 to-purple-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">L</span>
              </div>
              <span className="font-bold text-gray-900">Loraloop</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Free AI marketing tools for founders, solopreneurs, and small teams. Built by Loraloop — the AI marketing platform.
            </p>
            <a
              href="https://loraloop.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-sm font-semibold text-violet-600 hover:text-violet-700"
            >
              Try the full Loraloop platform →
            </a>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900 mb-4">Free Tools</p>
            <ul className="space-y-2">
              {tools.slice(0, 5).map((tool) => (
                <li key={tool.href}>
                  <Link href={tool.href} className="text-sm text-gray-500 hover:text-violet-600 transition-colors">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900 mb-4">More Tools</p>
            <ul className="space-y-2">
              {tools.slice(5).map((tool) => (
                <li key={tool.href}>
                  <Link href={tool.href} className="text-sm text-gray-500 hover:text-violet-600 transition-colors">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Loraloop. All rights reserved.</p>
          <p className="text-xs text-gray-400">Free tools. Real output. No login required.</p>
        </div>
      </div>
    </footer>
  );
}
