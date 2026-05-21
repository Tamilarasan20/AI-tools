'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useOrgStore } from '@/store/org.store';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: '⊞' },
  { href: '/composer', label: 'Composer', icon: '✏' },
  { href: '/calendar', label: 'Calendar', icon: '📅' },
  { href: '/posts', label: 'Posts', icon: '📝' },
  { href: '/analytics', label: 'Analytics', icon: '📊' },
  { href: '/media', label: 'Media', icon: '🖼' },
  { href: '/settings', label: 'Settings', icon: '⚙' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { currentOrg } = useOrgStore();
  const { user } = useAuthStore();

  return (
    <aside className="w-60 min-h-screen bg-[#16161f] border-r border-[#2a2a3e] flex flex-col">
      <div className="p-5 border-b border-[#2a2a3e]">
        <span className="text-xl font-bold bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
          Loraloop
        </span>
        {currentOrg && (
          <p className="text-xs text-gray-500 mt-1 truncate">{currentOrg.name}</p>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-brand-600/20 text-brand-300'
                  : 'text-gray-400 hover:text-white hover:bg-white/5',
              )}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#2a2a3e]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-600/30 flex items-center justify-center text-sm font-medium text-brand-300">
            {user?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
