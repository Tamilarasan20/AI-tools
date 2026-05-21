'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useOrgStore } from '@/store/org.store';
import { api } from '@/lib/api';

export default function TeamPage() {
  const { currentOrg } = useOrgStore();
  const orgId = currentOrg?.id;
  const qc = useQueryClient();

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'ADMIN' | 'MEMBER'>('MEMBER');
  const [inviteError, setInviteError] = useState('');
  const [inviteSent, setInviteSent] = useState(false);

  const { data: members = [] } = useQuery({
    queryKey: ['members', orgId],
    queryFn: () => api.organizations.members.list(orgId!),
    enabled: !!orgId,
  });

  const inviteMutation = useMutation({
    mutationFn: () => api.organizations.members.invite(orgId!, { email: inviteEmail, role: inviteRole }),
    onSuccess: () => {
      setInviteEmail('');
      setInviteError('');
      setInviteSent(true);
      setTimeout(() => setInviteSent(false), 3000);
      qc.invalidateQueries({ queryKey: ['members', orgId] });
    },
    onError: (err: any) => setInviteError(err.response?.data?.message || 'Failed to send invite'),
  });

  const removeMutation = useMutation({
    mutationFn: (memberId: string) => api.organizations.members.remove(orgId!, memberId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['members', orgId] }),
  });

  const roleColors: Record<string, string> = {
    OWNER: 'bg-purple-500/20 text-purple-300',
    ADMIN: 'bg-blue-500/20 text-blue-300',
    MEMBER: 'bg-gray-500/20 text-gray-400',
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2">Team</h1>
      <p className="text-gray-400 text-sm mb-8">Manage who has access to this organization.</p>

      {/* Invite form */}
      <div className="bg-[#16161f] border border-[#2a2a3e] rounded-xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-white mb-4">Invite a member</h2>
        {inviteError && (
          <div className="mb-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{inviteError}</div>
        )}
        <div className="flex gap-3">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="colleague@company.com"
            className="flex-1 px-4 py-2 bg-[#1e1e2e] border border-[#2a2a3e] rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-brand-500"
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as 'ADMIN' | 'MEMBER')}
            className="px-3 py-2 bg-[#1e1e2e] border border-[#2a2a3e] rounded-lg text-white text-sm focus:outline-none focus:border-brand-500"
          >
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button
            onClick={() => { setInviteError(''); inviteMutation.mutate(); }}
            disabled={!inviteEmail || inviteMutation.isPending}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition"
          >
            {inviteSent ? '✓ Sent' : inviteMutation.isPending ? 'Sending…' : 'Invite'}
          </button>
        </div>
      </div>

      {/* Member list */}
      <div className="bg-[#16161f] border border-[#2a2a3e] rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[#2a2a3e]">
          <h2 className="text-sm font-semibold text-white">{(members as any[]).length} member{(members as any[]).length !== 1 ? 's' : ''}</h2>
        </div>
        <div className="divide-y divide-[#2a2a3e]">
          {(members as any[]).map((m: any) => (
            <div key={m.id} className="flex items-center gap-4 px-5 py-4">
              <div className="w-9 h-9 rounded-full bg-brand-600/20 flex items-center justify-center text-sm font-semibold text-brand-300 shrink-0">
                {(m.user?.name || m.inviteEmail || '?')[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{m.user?.name || '(Pending)'}</p>
                <p className="text-xs text-gray-500 truncate">{m.user?.email || m.inviteEmail}</p>
              </div>
              <div className="flex items-center gap-3">
                {!m.accepted && (
                  <span className="text-xs text-yellow-500/80 bg-yellow-500/10 px-2 py-0.5 rounded-full">Pending</span>
                )}
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[m.role] || ''}`}>
                  {m.role}
                </span>
                {m.role !== 'OWNER' && (
                  <button
                    onClick={() => removeMutation.mutate(m.id)}
                    className="text-xs text-gray-600 hover:text-red-400 transition"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
