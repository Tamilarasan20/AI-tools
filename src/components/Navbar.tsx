import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">Loraloop</span>
            <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">Free Tools</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 hidden sm:block">
              All Tools
            </Link>
            <a
              href="https://loraloop.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg transition-colors"
            >
              Try Loraloop Free →
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
