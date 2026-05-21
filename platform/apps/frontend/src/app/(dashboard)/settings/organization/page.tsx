'use client';
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useOrgStore } from '@/store/org.store';
import { api } from '@/lib/api';

export default function OrganizationSettingsPage() {
  const { currentOrg, setCurrentOrg } = useOrgStore();
  const orgId = currentOrg?.id;
  const qc = useQueryClient();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const { data: org } = useQuery({
    queryKey: ['organization', orgId],
    queryFn: () => api.organizations.get(orgId!),
    enabled: !!orgId,
  });

  useEffect(() => {
    if (org) {
      setName((org as any).name || '');
      setSlug((org as any).slug || '');
    }
  }, [org]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.organizations.update(orgId!, data),
    onSuccess: (data: any) => {
      setCurrentOrg({ ...currentOrg!, name: data.name, slug: data.slug });
      qc.invalidateQueries({ queryKey: ['organization', orgId] });
      qc.invalidateQueries({ queryKey: ['organizations'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
    onError: (err: any) => setError(err.response?.data?.message || 'Failed to update organization'),
  });

  const handleSave = () => {
    setError('');
    updateMutation.mutate({ name, slug });
  };

  const isOwner = currentOrg?.role === 'OWNER';

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-8">Organization Settings</h1>

      <div className="bg-[#16161f] border border-[#2a2a3e] rounded-xl p-6 mb-6">
        <h2 className="text-base font-semibold text-white mb-4">General</h2>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Organization Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isOwner}
              className="w-full px-4 py-2.5 bg-[#1e1e2e] border border-[#2a2a3e] rounded-lg text-white focus:outline-none focus:border-brand-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Slug</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">loraloop.com/</span>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                disabled={!isOwner}
                className="flex-1 px-4 py-2.5 bg-[#1e1e2e] border border-[#2a2a3e] rounded-lg text-white focus:outline-none focus:border-brand-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="my-org"
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">Only lowercase letters, numbers, and hyphens.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Organization ID</label>
            <input
              value={orgId || ''}
              disabled
              className="w-full px-4 py-2.5 bg-[#1e1e2e] border border-[#2a2a3e] rounded-lg text-gray-500 font-mono text-sm cursor-not-allowed"
            />
          </div>
          {isOwner && (
            <button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition"
            >
              {saved ? '✓ Saved' : updateMutation.isPending ? 'Saving…' : 'Save Changes'}
            </button>
          )}
          {!isOwner && (
            <p className="text-xs text-gray-500">Only the organization owner can edit these settings.</p>
          )}
        </div>
      </div>

      <div className="bg-[#16161f] border border-[#2a2a3e] rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-1">Your Role</h2>
        <p className="text-sm text-gray-500 mb-4">Your current role in this organization.</p>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-500/10 text-brand-400 border border-brand-500/20">
          {currentOrg?.role || 'MEMBER'}
        </span>
      </div>
    </div>
  );
}
