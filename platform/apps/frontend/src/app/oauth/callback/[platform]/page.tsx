'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { apiClient } from '@/lib/api';

function OAuthCallbackInner() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const platform = params.platform as string;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      setStatus('error');
      setMessage(`OAuth denied: ${error}`);
      setTimeout(() => router.replace('/settings/integrations'), 3000);
      return;
    }

    if (!code) {
      setStatus('error');
      setMessage('No authorization code received.');
      setTimeout(() => router.replace('/settings/integrations'), 3000);
      return;
    }

    // The backend handles the callback directly via redirect, but if it routes
    // through the frontend first, we forward the params back.
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const callbackUrl = `${backendUrl}/oauth/${platform}/callback?code=${encodeURIComponent(code)}${state ? `&state=${encodeURIComponent(state)}` : ''}`;
    window.location.href = callbackUrl;
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f17] flex items-center justify-center">
      <div className="text-center">
        {status === 'loading' && (
          <>
            <div className="w-10 h-10 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Connecting your account…</p>
          </>
        )}
        {status === 'error' && (
          <>
            <p className="text-red-400 mb-2">Connection failed</p>
            <p className="text-gray-500 text-sm">{message}</p>
            <p className="text-gray-600 text-xs mt-2">Redirecting back…</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0f0f17] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
      </div>
    }>
      <OAuthCallbackInner />
    </Suspense>
  );
}
