'use client';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { api } from '@/lib/api';

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const qc = useQueryClient();
  const [name, setName] = useState(user?.name || '');
  const [timezone, setTimezone] = useState(user?.timezone || 'UTC');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saved, setSaved] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [error, setError] = useState('');

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.users.updateProfile(data),
    onSuccess: (data: any) => {
      setUser({ ...user!, ...data });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  const pwMutation = useMutation({
    mutationFn: (data: any) => api.users.changePassword(data),
    onSuccess: () => {
      setPwSaved(true);
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setPwSaved(false), 2000);
    },
    onError: (err: any) => setError(err.response?.data?.message || 'Failed to change password'),
  });

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-8">Profile Settings</h1>

      <div className="bg-[#16161f] border border-[#2a2a3e] rounded-xl p-6 mb-6">
        <h2 className="text-base font-semibold text-white mb-4">Personal Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Display Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1e1e2e] border border-[#2a2a3e] rounded-lg text-white focus:outline-none focus:border-brand-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
            <input
              value={user?.email}
              disabled
              className="w-full px-4 py-2.5 bg-[#1e1e2e] border border-[#2a2a3e] rounded-lg text-gray-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Timezone</label>
            <input
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              placeholder="UTC"
              className="w-full px-4 py-2.5 bg-[#1e1e2e] border border-[#2a2a3e] rounded-lg text-white focus:outline-none focus:border-brand-500 transition"
            />
          </div>
          <button
            onClick={() => updateMutation.mutate({ name, timezone })}
            disabled={updateMutation.isPending}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition"
          >
            {saved ? '✓ Saved' : updateMutation.isPending ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="bg-[#16161f] border border-[#2a2a3e] rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-4">Change Password</h2>
        {error && <div className="mb-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1e1e2e] border border-[#2a2a3e] rounded-lg text-white focus:outline-none focus:border-brand-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1e1e2e] border border-[#2a2a3e] rounded-lg text-white focus:outline-none focus:border-brand-500 transition"
            />
          </div>
          <button
            onClick={() => {
              setError('');
              pwMutation.mutate({ currentPassword, newPassword });
            }}
            disabled={pwMutation.isPending}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition"
          >
            {pwSaved ? '✓ Updated' : pwMutation.isPending ? 'Updating…' : 'Update Password'}
          </button>
        </div>
      </div>
    </div>
  );
}
