'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useOrgStore } from '@/store/org.store';
import { api } from '@/lib/api';
import { formatDateTime, truncate, POST_STATE_COLORS } from '@/lib/utils';
import { PostState } from '@loraloop/shared';

const TABS = ['ALL', ...Object.values(PostState)] as const;

export default function PostsPage() {
  const { currentOrg } = useOrgStore();
  const orgId = currentOrg?.id;
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>('ALL');

  const { data, isLoading } = useQuery({
    queryKey: ['posts', orgId, activeTab],
    queryFn: () => api.posts.list(orgId!, { state: activeTab === 'ALL' ? undefined : activeTab, limit: 25 }),
    enabled: !!orgId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.posts.delete(orgId!, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts', orgId] }),
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Posts</h1>
        <Link href="/composer" className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition">
          + New Post
        </Link>
      </div>

      <div className="flex gap-1 mb-6 bg-[#16161f] border border-[#2a2a3e] rounded-lg p-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
              activeTab === tab ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
        </div>
      ) : data?.data?.length ? (
        <div className="space-y-2">
          {data.data.map((post: any) => (
            <div key={post.id} className="bg-[#16161f] border border-[#2a2a3e] rounded-xl p-4 flex items-start gap-4">
              <span className={`mt-0.5 px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${POST_STATE_COLORS[post.state as PostState] || ''}`}>
                {post.state}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-200">{truncate(post.content, 120)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <p className="text-xs text-gray-500">
                    {post.publishAt ? `Scheduled: ${formatDateTime(post.publishAt)}` : `Created: ${formatDateTime(post.createdAt)}`}
                  </p>
                  {post.postIntegrations?.length > 0 && (
                    <p className="text-xs text-gray-600">
                      {post.postIntegrations.map((pi: any) => pi.integration?.platform).join(', ')}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {post.state === 'DRAFT' || post.state === 'SCHEDULED' ? (
                  <button
                    onClick={() => deleteMutation.mutate(post.id)}
                    className="text-xs text-gray-500 hover:text-red-400 transition"
                  >
                    Delete
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">No posts found.</p>
          <Link href="/composer" className="text-brand-400 hover:text-brand-300 text-sm">
            Create your first post →
          </Link>
        </div>
      )}
    </div>
  );
}
