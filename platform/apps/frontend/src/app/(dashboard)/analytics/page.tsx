'use client';
import { useQuery } from '@tanstack/react-query';
import { useOrgStore } from '@/store/org.store';
import { api } from '@/lib/api';

export default function AnalyticsPage() {
  const { currentOrg } = useOrgStore();
  const orgId = currentOrg?.id;

  const { data: overview } = useQuery({
    queryKey: ['analytics-overview', orgId],
    queryFn: () => api.analytics.overview(orgId!),
    enabled: !!orgId,
  });

  const metrics = [
    { label: 'Total Impressions', value: overview?.impressions ?? 0 },
    { label: 'Engagements', value: overview?.engagements ?? 0 },
    { label: 'Likes', value: overview?.likes ?? 0 },
    { label: 'Followers Gained', value: overview?.followersGained ?? 0 },
    { label: 'Posts Published', value: overview?.postsThisMonth ?? 0 },
    { label: 'Active Accounts', value: overview?.activeIntegrations ?? 0 },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Analytics</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {metrics.map((m) => (
          <div key={m.label} className="bg-[#16161f] border border-[#2a2a3e] rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">{m.label}</p>
            <p className="text-2xl font-bold text-white">{m.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#16161f] border border-[#2a2a3e] rounded-xl p-6">
        <h2 className="text-sm font-medium text-gray-300 mb-4">Connect platforms to see detailed analytics</h2>
        <p className="text-gray-500 text-sm">
          Once you connect social platforms and publish posts, detailed performance metrics will appear here.
        </p>
      </div>
    </div>
  );
}
