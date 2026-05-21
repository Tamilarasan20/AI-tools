'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useOrgStore } from '@/store/org.store';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function ApiKeysPage() {
  const { currentOrg } = useOrgStore();
  const orgId = currentOrg?.id;
  const qc = useQueryClient();

  const [name, setName] = useState('');
  const [newKey, setNewKey] = useState<string | null>(null);
  const [error, setError] = useState('');

  const { data: keys = [] } = useQuery({
    queryKey: ['api-keys', orgId],
    queryFn: () => api.apiKeys.list(orgId!),
    enabled: !!orgId,
  });

  const createMutation = useMutation({
    mutationFn: () => api.apiKeys.create(orgId!, { name }),
    onSuccess: (data: any) => {
      setNewKey(data.key);
      setName('');
      qc.invalidateQueries({ queryKey: ['api-keys', orgId] });
    },
    onError: (err: any) => setError(err.response?.data?.message || 'Failed to create key'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.apiKeys.delete(orgId!, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['api-keys', orgId] }),
  });

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2">API Keys</h1>
      <p className="text-gray-400 text-sm mb-8">Create keys to access the Loraloop API programmatically.</p>

      {newKey && (
        <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
          <p className="text-sm font-medium text-green-400 mb-2">
            Copy your API key now — it won&apos;t be shown again.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs bg-[#0f0f17] text-green-300 px-3 py-2 rounded-lg font-mono break-all">
              {newKey}
            </code>
            <button
              onClick={() => { navigator.clipboard.writeText(newKey); }}
              className="shrink-0 px-3 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 text-xs rounded-lg transition"
            >
              Copy
            </button>
          </div>
          <button onClick={() => setNewKey(null)} className="mt-2 text-xs text-gray-500 hover:text-gray-400">
            Dismiss
          </button>
        </div>
      )}

      {/* Create form */}
      <div className="bg-[#16161f] border border-[#2a2a3e] rounded-xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-white mb-4">Create new key</h2>
        {error && <div className="mb-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
        <div className="flex gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Key name (e.g. CI/CD pipeline)"
            className="flex-1 px-4 py-2 bg-[#1e1e2e] border border-[#2a2a3e] rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-brand-500"
          />
          <button
            onClick={() => { setError(''); createMutation.mutate(); }}
            disabled={!name.trim() || createMutation.isPending}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition"
          >
            {createMutation.isPending ? 'Creating…' : 'Create'}
          </button>
        </div>
      </div>

      {/* Key list */}
      <div className="bg-[#16161f] border border-[#2a2a3e] rounded-xl overflow-hidden">
        {(keys as any[]).length === 0 ? (
          <p className="p-5 text-sm text-gray-500">No API keys yet.</p>
        ) : (
          <div className="divide-y divide-[#2a2a3e]">
            {(keys as any[]).map((k: any) => (
              <div key={k.id} className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{k.name}</p>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">{k.keyPrefix}••••••••••••••••</p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Created {formatDate(k.createdAt)}
                    {k.lastUsed && ` · Last used ${formatDate(k.lastUsed)}`}
                    {k.expiresAt && ` · Expires ${formatDate(k.expiresAt)}`}
                  </p>
                </div>
                <button
                  onClick={() => deleteMutation.mutate(k.id)}
                  className="text-xs text-gray-600 hover:text-red-400 transition"
                >
                  Revoke
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
