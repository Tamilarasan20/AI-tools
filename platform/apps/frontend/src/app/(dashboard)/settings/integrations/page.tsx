'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useOrgStore } from '@/store/org.store';
import { api } from '@/lib/api';
import { Platform } from '@loraloop/shared';
import { PLATFORM_NAMES, PLATFORM_COLORS } from '@/lib/utils';

const SUPPORTED_PLATFORMS = [
  Platform.TWITTER, Platform.LINKEDIN_PERSONAL, Platform.LINKEDIN_PAGE,
  Platform.INSTAGRAM, Platform.FACEBOOK, Platform.TIKTOK,
  Platform.YOUTUBE, Platform.REDDIT, Platform.BLUESKY,
];

export default function IntegrationsPage() {
  const { currentOrg } = useOrgStore();
  const orgId = currentOrg?.id;
  const qc = useQueryClient();

  const { data: integrations = [] } = useQuery({
    queryKey: ['integrations', orgId],
    queryFn: () => api.integrations.list(orgId!),
    enabled: !!orgId,
  });

  const disconnectMutation = useMutation({
    mutationFn: (id: string) => api.integrations.disconnect(orgId!, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['integrations', orgId] }),
  });

  const handleConnect = async (platform: Platform) => {
    try {
      const result: any = await api.integrations.getOAuthUrl(platform, orgId!);
      if (result?.url) window.location.href = result.url;
    } catch (err: any) {
      alert(err.response?.data?.message || 'OAuth not configured for this platform yet');
    }
  };

  const connectedMap = new Map<Platform, any>();
  (integrations as any[]).forEach((i: any) => connectedMap.set(i.platform, i));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2">Integrations</h1>
      <p className="text-gray-400 text-sm mb-8">Connect your social media accounts to start publishing.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SUPPORTED_PLATFORMS.map((platform) => {
          const connected = connectedMap.get(platform);
          return (
            <div key={platform} className="bg-[#16161f] border border-[#2a2a3e] rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: PLATFORM_COLORS[platform] + '33' }}
                >
                  {platform[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{PLATFORM_NAMES[platform]}</p>
                  {connected && (
                    <p className="text-xs text-gray-500 truncate">{connected.accountName}</p>
                  )}
                </div>
                {connected && (
                  <span className="ml-auto text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                    Connected
                  </span>
                )}
              </div>
              {connected ? (
                <button
                  onClick={() => disconnectMutation.mutate(connected.id)}
                  className="w-full py-1.5 text-xs border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={() => handleConnect(platform)}
                  className="w-full py-1.5 text-xs border border-brand-500/30 text-brand-400 hover:bg-brand-500/10 rounded-lg transition"
                >
                  Connect
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
