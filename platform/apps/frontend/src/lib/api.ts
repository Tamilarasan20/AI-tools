import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

const get = <T>(url: string, params?: any) =>
  apiClient.get<{ data: T }>(url, { params }).then((r) => r.data.data ?? (r.data as any));

const post = <T>(url: string, data?: any) =>
  apiClient.post<{ data: T }>(url, data).then((r) => r.data.data ?? (r.data as any));

const patch = <T>(url: string, data?: any) =>
  apiClient.patch<{ data: T }>(url, data).then((r) => r.data.data ?? (r.data as any));

const del = (url: string) => apiClient.delete(url);

export const api = {
  auth: {
    login: (data: { email: string; password: string }) => post('/auth/login', data),
    register: (data: { email: string; name: string; password: string }) => post('/auth/register', data),
    logout: () => post('/auth/logout'),
    me: () => get('/auth/me'),
    forgotPassword: (email: string) => post('/auth/forgot-password', { email }),
    resetPassword: (token: string, password: string) => post('/auth/reset-password', { token, password }),
  },
  users: {
    updateProfile: (data: any) => patch('/users/me', data),
    changePassword: (data: any) => post('/users/me/change-password', data),
  },
  organizations: {
    list: () => get('/organizations'),
    create: (data: any) => post('/organizations', data),
    get: (orgId: string) => get(`/organizations/${orgId}`),
    update: (orgId: string, data: any) => patch(`/organizations/${orgId}`, data),
    delete: (orgId: string) => del(`/organizations/${orgId}`),
    members: {
      list: (orgId: string) => get(`/organizations/${orgId}/members`),
      invite: (orgId: string, data: any) => post(`/organizations/${orgId}/members/invite`, data),
      remove: (orgId: string, memberId: string) => del(`/organizations/${orgId}/members/${memberId}`),
      updateRole: (orgId: string, memberId: string, role: string) =>
        patch(`/organizations/${orgId}/members/${memberId}/role`, { role }),
    },
  },
  posts: {
    list: (orgId: string, params?: any) => get(`/organizations/${orgId}/posts`, params),
    create: (orgId: string, data: any) => post(`/organizations/${orgId}/posts`, data),
    get: (orgId: string, id: string) => get(`/organizations/${orgId}/posts/${id}`),
    update: (orgId: string, id: string, data: any) => patch(`/organizations/${orgId}/posts/${id}`, data),
    delete: (orgId: string, id: string) => del(`/organizations/${orgId}/posts/${id}`),
    schedule: (orgId: string, id: string, publishAt: string) =>
      post(`/organizations/${orgId}/posts/${id}/schedule`, { publishAt }),
    publishNow: (orgId: string, id: string) => post(`/organizations/${orgId}/posts/${id}/publish-now`),
    cancel: (orgId: string, id: string) => post(`/organizations/${orgId}/posts/${id}/cancel`),
  },
  integrations: {
    list: (orgId: string) => get(`/organizations/${orgId}/integrations`),
    getOAuthUrl: (platform: string, orgId: string) => get(`/oauth/${platform}/connect`, { orgId }),
    update: (orgId: string, id: string, data: any) => patch(`/organizations/${orgId}/integrations/${id}`, data),
    disconnect: (orgId: string, id: string) => del(`/organizations/${orgId}/integrations/${id}`),
  },
  media: {
    list: (orgId: string, params?: any) => get(`/organizations/${orgId}/media`, params),
    upload: (orgId: string, formData: FormData) =>
      apiClient.post(`/organizations/${orgId}/media/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then((r) => r.data.data ?? r.data),
    delete: (orgId: string, id: string) => del(`/organizations/${orgId}/media/${id}`),
    getPresignedUrl: (orgId: string, filename: string, contentType: string) =>
      get(`/organizations/${orgId}/media/presigned-url`, { filename, contentType }),
  },
  ai: {
    generateContent: (orgId: string, data: any) => post(`/organizations/${orgId}/ai/generate-content`, data),
    generateImage: (orgId: string, data: any) => post(`/organizations/${orgId}/ai/generate-image`, data),
    improveContent: (orgId: string, data: any) => post(`/organizations/${orgId}/ai/improve-content`, data),
  },
  analytics: {
    get: (orgId: string, params?: any) => get(`/organizations/${orgId}/analytics`, params),
    overview: (orgId: string) => get(`/organizations/${orgId}/analytics/overview`),
  },
  billing: {
    checkout: (orgId: string, data: any) => post(`/organizations/${orgId}/billing/checkout`, data),
    portal: (orgId: string) => post(`/organizations/${orgId}/billing/portal`),
    subscription: (orgId: string) => get(`/organizations/${orgId}/billing/subscription`),
  },
  notifications: {
    list: (orgId?: string) => get('/notifications', orgId ? { orgId } : undefined),
    markRead: (id: string) => post(`/notifications/${id}/read`),
    markAllRead: () => post('/notifications/read-all'),
  },
  tags: {
    list: (orgId: string) => get(`/organizations/${orgId}/tags`),
    create: (orgId: string, data: any) => post(`/organizations/${orgId}/tags`, data),
    delete: (orgId: string, id: string) => del(`/organizations/${orgId}/tags/${id}`),
  },
  apiKeys: {
    list: (orgId: string) => get(`/organizations/${orgId}/api-keys`),
    create: (orgId: string, data: any) => post(`/organizations/${orgId}/api-keys`, data),
    delete: (orgId: string, id: string) => del(`/organizations/${orgId}/api-keys/${id}`),
  },
};
