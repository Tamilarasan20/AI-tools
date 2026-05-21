'use client';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useOrgStore } from '@/store/org.store';
import { api } from '@/lib/api';
import { PLATFORM_NAMES, PLATFORM_COLORS } from '@/lib/utils';
import { PLATFORM_CHAR_LIMITS, Platform } from '@loraloop/shared';

export default function ComposerPage() {
  const router = useRouter();
  const { currentOrg } = useOrgStore();
  const orgId = currentOrg?.id;

  const [content, setContent] = useState('');
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([]);
  const [publishAt, setPublishAt] = useState('');
  const [error, setError] = useState('');

  const { data: integrations } = useQuery({
    queryKey: ['integrations', orgId],
    queryFn: () => api.integrations.list(orgId!),
    enabled: !!orgId,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.posts.create(orgId!, data),
    onSuccess: () => router.push('/posts'),
    onError: (err: any) => setError(err.response?.data?.message || 'Failed to create post'),
  });

  const toggleIntegration = (id: string) => {
    setSelectedIntegrations((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!content.trim()) { setError('Content is required'); return; }
    if (selectedIntegrations.length === 0) { setError('Select at least one platform'); return; }

    createMutation.mutate({
      content,
      integrationIds: selectedIntegrations,
      publishAt: publishAt || undefined,
    });
  };

  const selectedPlatforms = (integrations as any[])
    ?.filter((i: any) => selectedIntegrations.includes(i.id))
    .map((i: any) => i.platform as Platform) || [];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Create Post</h1>

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
              rows={8}
              className="w-full bg-transparent text-white placeholder-gray-600 resize-none focus:outline-none text-sm leading-relaxed"
              placeholder="What do you want to share today?"
            />
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#2a2a3e]">
              <span className="text-xs text-gray-600">{content.length} characters</span>
              {selectedPlatforms.length > 0 && (
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
              )}
            </div>
          </div>

          <div className="bg-[#16161f] border border-[#2a2a3e] rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-300 mb-3">Schedule (optional)</label>
            <input
              type="datetime-local"
              value={publishAt}
              onChange={(e) => setPublishAt(e.target.value)}
              className="w-full px-3 py-2 bg-[#1e1e2e] border border-[#2a2a3e] rounded-lg text-white text-sm focus:outline-none focus:border-brand-500"
            />
            <p className="text-xs text-gray-600 mt-1">Leave empty to save as draft.</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={createMutation.isPending}
              className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-medium rounded-lg transition text-sm"
            >
              {createMutation.isPending ? 'Saving…' : publishAt ? 'Schedule Post' : 'Save as Draft'}
            </button>
            {!publishAt && (
              <button
                onClick={() => {
                  setPublishAt(new Date().toISOString().slice(0, 16));
                  handleSubmit({ preventDefault: () => {} } as any);
                }}
                className="px-4 py-2.5 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-600/30 font-medium rounded-lg transition text-sm"
              >
                Publish Now
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#16161f] border border-[#2a2a3e] rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Post to</h3>
            {(integrations as any[])?.length ? (
              <div className="space-y-2">
                {(integrations as any[]).map((integration: any) => (
                  <label
                    key={integration.id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIntegrations.includes(integration.id)}
                      onChange={() => toggleIntegration(integration.id)}
                      className="w-4 h-4 rounded accent-brand-500"
                    />
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: PLATFORM_COLORS[integration.platform as Platform] + '33' }}
                    >
                      {integration.platform[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-gray-300 group-hover:text-white transition truncate">
                        {integration.accountName}
                      </p>
                      <p className="text-xs text-gray-600">{PLATFORM_NAMES[integration.platform as Platform]}</p>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No platforms connected.{' '}
                <a href="/settings/integrations" className="text-brand-400 hover:text-brand-300">Connect one →</a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
