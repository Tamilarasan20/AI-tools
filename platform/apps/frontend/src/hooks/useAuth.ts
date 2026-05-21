'use client';
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useOrgStore } from '@/store/org.store';
import { api } from '@/lib/api';

export function useAuth() {
  const { user, setUser, setLoading, logout: clearUser } = useAuthStore();
  const { setCurrentOrg, currentOrg } = useOrgStore();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.auth.me(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data) {
      setUser(data);
      if (!currentOrg && data.orgMembers?.length > 0) {
        const first = data.orgMembers[0];
        setCurrentOrg({ ...first.org, role: first.role });
      }
    }
    setLoading(isLoading);
  }, [data, isLoading]);

  const loginMutation = useMutation({
    mutationFn: (creds: { email: string; password: string }) => api.auth.login(creds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => api.auth.logout(),
    onSuccess: () => {
      clearUser();
      queryClient.clear();
      window.location.href = '/login';
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutate,
    loginError: loginMutation.error,
    isLoggingIn: loginMutation.isPending,
  };
}
