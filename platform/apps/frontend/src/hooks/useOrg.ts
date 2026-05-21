'use client';
import { useQuery } from '@tanstack/react-query';
import { useOrgStore } from '@/store/org.store';
import { api } from '@/lib/api';

export function useOrg() {
  const { currentOrg, setCurrentOrg } = useOrgStore();

  const { data: orgs, isLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => api.organizations.list(),
    staleTime: 5 * 60 * 1000,
  });

  const switchOrg = (org: { id: string; name: string; slug: string; logo?: string; role: string }) => {
    setCurrentOrg(org);
  };

  return {
    currentOrg,
    orgs: (orgs as any[]) || [],
    isLoading,
    switchOrg,
  };
}
