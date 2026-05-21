'use client';
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation';
import { useOrgStore } from '@/store/org.store';
import { api } from '@/lib/api';
import { PLATFORM_NAMES, PLATFORM_COLORS, formatDateTime } from '@/lib/utils';
import { PLATFORM_CHAR_LIMITS, Platform, PostState } from '@loraloop/shared';

export default function PostEditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { currentOrg } = useOrgStore();
  const orgId = currentOrg?.id;
  const qc = useQueryClient();

  const [content, setContent] = useState('');
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([]);
  const [publishAt, setPublishAt] = useState('');
  const [error, setError] = useState('');

  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ['post', orgId, id],
    queryFn: () => api.posts.get(orgId!, id),
    enabled: !!orgId && !!id,
  });

  const { data: integrations } = useQuery({
    queryKey: ['integrations', orgId],
    queryFn: () => api.integrations.list(orgId!),
    enabled: !!orgId,
  });

  useEffect(() => {
    if (post) {
      setContent((post as any).content || '');
      setSelectedIntegrations(
        ((post as any).postIntegrations || []).map((pi: any) => pi.integrationId),
      );
      if ((post as any).publishAt) {
        setPublishAt(new Date((post as any).publishAt).toISOString().slice(0, 16));
      }
    }
  }, [post]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.posts.update(orgId!, id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['posts', orgId] });
      router.push('/posts');
    },
    onError: (err: any) => setError(err.response?.data?.message || 'Failed to update post'),
  });

  const scheduleMutation = useMutation({
    mutationFn: (publishAt: string) => api.posts.schedule(orgId!, id, publishAt),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['posts', orgId] });
      router.push('/posts');
    },
  });

  const publishNowMutation = useMutation({
    mutationFn: () => api.posts.publishNow(orgId!, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['posts', orgId] });
      router.push('/posts');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => api.posts.cancel(orgId!, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['posts', orgId] });
      router.push('/posts');
    },
  });

  if (postLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return <div className="p-6 text-gray-400">Post not found.</div>;
  }

  const p = post as any;
  const isPublished = p.state === PostState.PUBLISHED;
  const isFailed = p.state === PostState.FAILED;
  const selectedPlatforms = ((integrations as any[]) || [])
    .filter((i: any) => selectedIntegrations.includes(i.id))
    .map((i: any) => i.platform as Platform);

  const handleSave = () => {
    setError('');
    updateMutation.mutate({
      content,
      integrationIds: selectedIntegrations,
      publishAt: publishAt || null,
    });
  };

  const toggleIntegration = (id: string) => {
    setSelectedIntegrations((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-white transition text-sm">
          ← Back
        </button>
        <h1 className="text-xl font-bold text-white">Edit Post</h1>
        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-400">{p.state}</span>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#16161f] border border-[#2a2a3e] rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPublished}
              rows={8}
              className="w-full bg-transparent text-white placeholder-gray-600 resize-none focus:outline-none text-sm leading-relaxed disabled:opacity-60 disabled:cursor-not-allowed"
              placeholder="What do you want to share?"
            />
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#2a2a3e]">
              <span className="text-xs text-gray-600">{content.length} characters</span>
              <div className="flex gap-2">
                {selectedPlatforms.map((platform) => {
                  const limit = PLATFORM_CHAR_LIMITS[platform];
                  const over = content.length > limit;
                  return (
                    <span key={platform} className={`text-xs px-2 py-0.5 rounded ${over ? 'text-red-400 bg-red-500/10' : 'text-gray-500'}`}>
                      {platform.split('_')[0]}: {content.length}/{limit}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {!isPublished && (
            <div className="bg-[#16161f] border border-[#2a2a3e] rounded-xl p-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Schedule</label>
              <input
                type="datetime-local"
                value={publishAt}
                onChange={(e) => setPublishAt(e.target.value)}
                className="w-full px-3 py-2 bg-[#1e1e2e] border border-[#2a2a3e] rounded-lg text-white text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
          )}

          {isPublished && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <p className="text-sm text-green-400 font-medium">Published</p>
              {p.publishedAt && (
                <p className="text-xs text-green-600 mt-0.5">{formatDateTime(p.publishedAt)}</p>
              )}
            </div>
          )}

          {!isPublished && (
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition"
              >
                {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
              </button>
              {publishAt && (
                <button
                  onClick={() => scheduleMutation.mutate(publishAt)}
                  disabled={scheduleMutation.isPending}
                  className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-600/30 text-sm font-medium rounded-lg transition"
                >
                  {scheduleMutation.isPending ? 'Scheduling…' : 'Schedule'}
                </button>
              )}
              <button
                onClick={() => publishNowMutation.mutate()}
                disabled={publishNowMutation.isPending}
                className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-600/30 text-sm font-medium rounded-lg transition"
              >
                {publishNowMutation.isPending ? 'Publishing…' : 'Publish Now'}
              </button>
              {(p.state === PostState.SCHEDULED || p.state === PostState.DRAFT) && (
                <button
                  onClick={() => cancelMutation.mutate()}
                  disabled={cancelMutation.isPending}
                  className="px-4 py-2 text-gray-500 hover:text-red-400 text-sm transition ml-auto"
                >
                  Cancel Post
                </button>
              )}
            </div>
          )}

          {(isFailed) && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <p className="text-sm text-red-400 font-medium">Failed to publish</p>
              {p.errorMessage && <p className="text-xs text-red-600 mt-0.5">{p.errorMessage}</p>}
              <button
                onClick={() => publishNowMutation.mutate()}
                className="mt-2 text-xs text-red-400 hover:text-red-300 underline"
              >
                Retry
              </button>
            </div>
          )}
        </div>

        <div>
          <div className="bg-[#16161f] border border-[#2a2a3e] rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Platforms</h3>
            {((integrations as any[]) || []).map((integration: any) => (
              <label key={integration.id} className="flex items-center gap-3 mb-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedIntegrations.includes(integration.id)}
                  onChange={() => !isPublished && toggleIntegration(integration.id)}
                  disabled={isPublished}
                  className="w-4 h-4 rounded accent-brand-500 disabled:cursor-not-allowed"
                />
                <div
                  className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: PLATFORM_COLORS[integration.platform as Platform] + '33' }}
                >
                  {integration.platform[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-gray-300 truncate">{integration.accountName}</p>
                  <p className="text-xs text-gray-600">{PLATFORM_NAMES[integration.platform as Platform]}</p>
                </div>
              </label>
            ))}
          </div>

          {p.postIntegrations?.length > 0 && (
            <div className="mt-4 bg-[#16161f] border border-[#2a2a3e] rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Publish status</h3>
              <div className="space-y-2">
                {p.postIntegrations.map((pi: any) => (
                  <div key={pi.id} className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{pi.integration?.platform || pi.integrationId}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      pi.state === 'PUBLISHED' ? 'bg-green-500/20 text-green-400' :
                      pi.state === 'FAILED' ? 'bg-red-500/20 text-red-400' :
                      'bg-gray-500/20 text-gray-500'
                    }`}>{pi.state}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
