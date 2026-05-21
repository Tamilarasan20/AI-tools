'use client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useOrgStore } from '@/store/org.store';
import { api } from '@/lib/api';
import { SubscriptionPlan, PLAN_LIMITS } from '@loraloop/shared';

const PLAN_INFO = {
  FREE: { name: 'Free', price: '$0', color: 'border-gray-600' },
  STARTER: { name: 'Starter', price: '$19/mo', color: 'border-blue-500' },
  PRO: { name: 'Pro', price: '$49/mo', color: 'border-brand-500' },
  BUSINESS: { name: 'Business', price: '$99/mo', color: 'border-purple-500' },
  ENTERPRISE: { name: 'Enterprise', price: 'Custom', color: 'border-gold-500' },
};

export default function BillingPage() {
  const { currentOrg } = useOrgStore();
  const orgId = currentOrg?.id;

  const { data: sub } = useQuery({
    queryKey: ['subscription', orgId],
    queryFn: () => api.billing.subscription(orgId!),
    enabled: !!orgId,
  });

  const checkoutMutation = useMutation({
    mutationFn: (data: any) => api.billing.checkout(orgId!, data),
    onSuccess: (res: any) => { if (res?.url) window.location.href = res.url; },
  });

  const portalMutation = useMutation({
    mutationFn: () => api.billing.portal(orgId!),
    onSuccess: (res: any) => { if (res?.url) window.location.href = res.url; },
  });

  const currentPlan: SubscriptionPlan = (sub as any)?.plan || 'FREE';
  const limits = PLAN_LIMITS[currentPlan];

  const plans: SubscriptionPlan[] = [SubscriptionPlan.FREE, SubscriptionPlan.STARTER, SubscriptionPlan.PRO, SubscriptionPlan.BUSINESS];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2">Billing</h1>
      <p className="text-gray-400 text-sm mb-8">Manage your subscription and billing details.</p>

      <div className="bg-[#16161f] border border-[#2a2a3e] rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1">Current Plan</p>
            <p className="text-xl font-bold text-white">{PLAN_INFO[currentPlan].name}</p>
            <p className="text-sm text-gray-400 mt-1">{PLAN_INFO[currentPlan].price}</p>
          </div>
          {(sub as any)?.stripeSubId && (
            <button
              onClick={() => portalMutation.mutate()}
              className="px-4 py-2 border border-[#2a2a3e] text-gray-300 hover:text-white hover:border-gray-500 text-sm rounded-lg transition"
            >
              Manage Subscription
            </button>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => {
          const info = PLAN_INFO[plan];
          const planLimits = PLAN_LIMITS[plan];
          const isCurrent = plan === currentPlan;
          return (
            <div key={plan} className={`bg-[#16161f] border ${isCurrent ? 'border-brand-500' : 'border-[#2a2a3e]'} rounded-xl p-4`}>
              {isCurrent && <span className="text-xs bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full mb-3 inline-block">Current</span>}
              <p className="font-semibold text-white">{info.name}</p>
              <p className="text-xl font-bold text-brand-400 mt-1 mb-3">{info.price}</p>
              <ul className="space-y-1 text-xs text-gray-400 mb-4">
                <li>{planLimits.integrations === -1 ? 'Unlimited' : planLimits.integrations} integrations</li>
                <li>{planLimits.postsPerMonth === -1 ? 'Unlimited' : planLimits.postsPerMonth} posts/mo</li>
                <li>{planLimits.teamMembers === -1 ? 'Unlimited' : planLimits.teamMembers} team members</li>
                <li>{planLimits.aiCreditsPerMonth === -1 ? 'Unlimited' : planLimits.aiCreditsPerMonth} AI credits/mo</li>
                <li>{planLimits.mediaStorageGb === -1 ? 'Unlimited' : planLimits.mediaStorageGb}GB storage</li>
              </ul>
              {!isCurrent && plan !== 'FREE' && (
                <button
                  onClick={() => checkoutMutation.mutate({ plan, period: 'MONTHLY' })}
                  disabled={checkoutMutation.isPending}
                  className="w-full py-1.5 text-xs bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-lg transition"
                >
                  Upgrade
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
