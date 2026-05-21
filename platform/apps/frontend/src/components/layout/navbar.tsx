'use client';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useOrgStore } from '@/store/org.store';
import { api } from '@/lib/api';

interface NavbarProps {
  title?: string;
}

export function Navbar({ title }: NavbarProps) {
  const { logout, user } = useAuth();
  const { currentOrg } = useOrgStore();

  const { data: notifications } = useQuery({
    queryKey: ['notifications', currentOrg?.id],
    queryFn: () => api.notifications.list(currentOrg?.id),
    enabled: !!currentOrg?.id,
    refetchInterval: 30_000,
  });

  const unread = (notifications as any[])?.filter((n: any) => !n.read).length ?? 0;

  return (
    <header className="h-14 border-b border-[#2a2a3e] bg-[#16161f]/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-10">
      <h1 className="text-base font-semibold text-white">{title}</h1>

      <div className="flex items-center gap-3">
        <Link
          href="/composer"
          className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition"
        >
          + New Post
        </Link>

        {/* Notification bell */}
        <button className="relative p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>

        {/* User menu */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-brand-600/30 flex items-center justify-center text-xs font-semibold text-brand-300">
            {user?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <button
            onClick={() => logout()}
            className="text-xs text-gray-500 hover:text-white transition"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
