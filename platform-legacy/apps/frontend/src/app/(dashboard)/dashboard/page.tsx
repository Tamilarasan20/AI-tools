'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useOrgStore } from '@/store/org.store';
import { api } from '@/lib/api';
import { formatRelative, truncate, POST_STATE_COLORS } from '@/lib/utils';

export default function DashboardPage() {
  const { currentOrg } = useOrgStore();
  const orgId = currentOrg?.id;

  const { data: overview } = useQuery({
    queryKey: ['analytics-overview', orgId],
    queryFn: () => api.analytics.overview(orgId!),
    enabled: !!orgId,
  });

  const { data: postsData } = useQuery({
    queryKey: ['posts', orgId, { limit: 5 }],
    queryFn: () => api.posts.list(orgId!, { limit: 5 }),
    enabled: !!orgId,
  });

  const stats = [
    { label: 'Posts this month', value: overview?.postsThisMonth ?? '–', color: 'text-brand-400' },
    { label: 'Scheduled posts', value: overview?.scheduledPosts ?? '–', color: 'text-blue-400' },
    { label: 'Connected accounts', value: overview?.activeIntegrations ?? '–', color: 'text-green-400' },
    { label: 'AI credits used', value: overview?.aiCreditsUsed ?? '–', color: 'text-purple-400' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Welcome back{currentOrg ? `, ${currentOrg.name}` : ''}
        </h1>
        <p className="text-gray-400 mt-1">Here's what's happening with your social presence.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#16161f] border border-[#2a2a3e] rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-[#16161f] border border-[#2a2a3e] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Recent Posts</h2>
            <Link href="/posts" className="text-xs text-brand-400 hover:text-brand-300">View all</Link>
          </div>
          {postsData?.data?.length ? (
            <div className="space-y-3">
              {postsData.data.map((post: any) => (
                <div key={post.id} className="flex items-start gap-3">
                  <span className={`mt-0.5 px-2 py-0.5 rounded text-xs font-medium ${POST_STATE_COLORS[post.state as keyof typeof POST_STATE_COLORS] || ''}`}>
                    {post.state}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-300 truncate">{truncate(post.content, 60)}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{formatRelative(post.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No posts yet. <Link href="/composer" className="text-brand-400">Create your first post →</Link></p>
          )}
        </div>

        <div className="bg-[#16161f] border border-[#2a2a3e] rounded-xl p-5">
          <h2 className="font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { href: '/composer', icon: '✏', label: 'Create new post', desc: 'Write and schedule content' },
              { href: '/settings/integrations', icon: '🔗', label: 'Connect a platform', desc: 'Add social accounts' },
              { href: '/analytics', icon: '📊', label: 'View analytics', desc: 'Track your performance' },
              { href: '/media', icon: '🖼', label: 'Upload media', desc: 'Manage your media library' },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition group"
              >
                <span className="text-xl">{action.icon}</span>
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-brand-300 transition">{action.label}</p>
                  <p className="text-xs text-gray-500">{action.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
