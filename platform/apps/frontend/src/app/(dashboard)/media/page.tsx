'use client';
import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useOrgStore } from '@/store/org.store';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function MediaPage() {
  const { currentOrg } = useOrgStore();
  const orgId = currentOrg?.id;
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const { data } = useQuery({
    queryKey: ['media', orgId],
    queryFn: () => api.media.list(orgId!),
    enabled: !!orgId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.media.delete(orgId!, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['media', orgId] }),
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !orgId) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await api.media.upload(orgId, formData);
      qc.invalidateQueries({ queryKey: ['media', orgId] });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const items: any[] = (data as any)?.data || [];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Media Library</h1>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition"
        >
          {uploading ? 'Uploading…' : '+ Upload'}
        </button>
        <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleUpload} />
      </div>

      {items.length === 0 ? (
        <div
          className="border-2 border-dashed border-[#2a2a3e] rounded-xl p-16 text-center cursor-pointer hover:border-brand-500/50 transition"
          onClick={() => fileRef.current?.click()}
        >
          <p className="text-4xl mb-3">🖼</p>
          <p className="text-gray-400 mb-1">No media yet</p>
          <p className="text-sm text-gray-600">Click to upload images or videos</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item: any) => (
            <div key={item.id} className="bg-[#16161f] border border-[#2a2a3e] rounded-xl overflow-hidden group">
              <div className="aspect-square bg-[#1e1e2e] relative">
                {item.type === 'IMAGE' || item.type === 'GIF' ? (
                  <img src={item.url} alt={item.alt || item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">🎬</div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(item.url)}
                    className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-xs text-white transition"
                  >
                    Copy URL
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(item.id)}
                    className="px-2 py-1 bg-red-500/20 hover:bg-red-500/40 rounded text-xs text-red-300 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-400 truncate">{item.name}</p>
                <p className="text-xs text-gray-600">{formatDate(item.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
