'use client';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

interface NavbarProps {
  title?: string;
}

export function Navbar({ title }: NavbarProps) {
  const { logout } = useAuth();

  return (
    <header className="h-14 border-b border-[#2a2a3e] bg-[#16161f]/80 backdrop-blur-sm flex items-center justify-between px-6">
      <h1 className="text-base font-semibold text-white">{title}</h1>
      <div className="flex items-center gap-3">
        <Link
          href="/composer"
          className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition"
        >
          + New Post
        </Link>
        <button
          onClick={() => logout()}
          className="text-sm text-gray-400 hover:text-white transition"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
