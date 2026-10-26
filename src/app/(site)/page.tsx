import type { Metadata } from 'next';
import Link from 'next/link';
import ToolCard from '@/components/ToolCard';
import CTABanner from '@/components/CTABanner';

export const metadata: Metadata = {
  title: 'Free AI Marketing Tools | Loraloop',
  description:
    'Free AI marketing tools for founders and small teams. Generate brand voices, social media calendars, hooks, ad copy, and more — no login required.',
};

const tools = [
  {
    emoji: '🎯',
    name: 'AI Brand Voice Generator',
    description: 'Define your brand personality, tone, messaging guide, and content pillars in seconds.',
    href: '/tools/brand-voice',
    badge: 'Start Here',
    keyword: 'brand voice generator',
  },
  {
    emoji: '📅',
    name: 'AI Social Media Calendar Generator',
    description: 'Get a complete 30-day content calendar with post ideas, hooks, and formats.',
    href: '/tools/social-calendar',
    keyword: 'social media calendar generator',
  },
  {
    emoji: '🏛️',
    name: 'AI Content Pillar Generator',
    description: 'Create 3–5 content pillars with 10 post ideas each and a weekly posting schedule.',
    href: '/tools/content-pillars',
    keyword: 'content pillar generator',
  },
  {
    emoji: '🪝',
    name: 'AI Hook Generator',
    description: 'Generate 15 scroll-stopping hooks for TikTok, Reels, LinkedIn, and YouTube Shorts.',
    href: '/tools/hook-generator',
    keyword: 'TikTok hook generator',
  },
  {
    emoji: '🔍',
    name: 'AI Competitor Social Audit Tool',
    description: 'Analyze your competitor\'s content strategy and find the gaps you can own.',
    href: '/tools/competitor-audit',
    keyword: 'competitor social media analysis',
  },
  {
    emoji: '📣',
    name: 'AI Ad Copy Generator',
    description: 'Write high-converting ad copy for Facebook, Instagram, TikTok, and Google — 3 full variations.',
    href: '/tools/ad-copy',
    keyword: 'Facebook ad copy generator',
  },
  {
    emoji: '🗺️',
    name: 'AI Marketing Strategy Generator',
    description: 'Get a full go-to-market strategy with channels, action plan, and KPIs.',
    href: '/tools/marketing-strategy',
    keyword: 'marketing strategy generator',
  },
  {
    emoji: '📄',
    name: 'AI Landing Page Copy Generator',
    description: 'Generate complete landing page copy — hero, benefits, FAQ, and CTA — ready to publish.',
    href: '/tools/landing-page-copy',
    keyword: 'landing page copy generator',
  },
  {
    emoji: '🛍️',
    name: 'AI Product Description Generator',
    description: 'Create SEO-optimized product descriptions, bullet points, social captions, and ad copy.',
    href: '/tools/product-description',
    keyword: 'product description generator',
  },
];

const steps = [
  { step: '01', title: 'Pick a tool', desc: 'Choose the free tool that matches your most pressing marketing problem.' },
  { step: '02', title: 'Enter your details', desc: 'Fill in a short form about your business, audience, and goal.' },
  { step: '03', title: 'Get real output', desc: 'Receive AI-generated content in seconds — specific to your business, not generic templates.' },
  { step: '04', title: 'Upgrade to Loraloop', desc: 'Turn these outputs into a full automated marketing workflow — content, scheduling, approvals.' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse" />
            9 Free AI Marketing Tools — No Login Required
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Free AI tools that make you think:{' '}
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              "if this is free, what does the full product do?"
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Each tool solves one painful marketing job. No generic output. No fluff.
            Built by Loraloop — the AI marketing platform for founders and small teams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#tools"
              className="inline-block bg-violet-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-violet-700 transition-colors text-sm"
            >
              Explore all 9 tools ↓
            </a>
            <a
              href="https://loraloop.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border-2 border-gray-200 text-gray-700 font-semibold px-8 py-4 rounded-xl hover:border-violet-300 hover:text-violet-700 transition-colors text-sm"
            >
              Try Loraloop free →
            </a>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Pick your tool</h2>
          <p className="text-gray-500">Each one is free, instant, and built around a real marketing problem.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">How it works</h2>
            <p className="text-gray-500">From free tool to full marketing system in 4 steps.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 bg-violet-50 text-violet-600 font-bold text-lg rounded-xl flex items-center justify-center mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Loraloop */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-violet-700 bg-violet-50 px-3 py-1.5 rounded-full mb-4">
              ABOUT LORALOOP
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              These free tools are just the beginning.
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Loraloop takes everything these tools generate — your brand voice, content calendar, ad copy, and strategy — and turns it into an automated marketing workflow. Consistent content, auto-scheduled, approval-ready. No agency. No chaos.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Brand-consistent content generated automatically',
                '30-day calendars executed, not just planned',
                'Ad copy created, tested, and optimized',
                'Approval workflow so you stay in control',
                'One platform. Your whole marketing workflow.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="w-5 h-5 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="https://loraloop.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-violet-600 text-white font-bold px-6 py-3.5 rounded-xl hover:bg-violet-700 transition-colors text-sm"
            >
              Start with Loraloop Free →
            </a>
          </div>
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-8 border border-violet-100">
            <p className="text-sm font-semibold text-violet-700 mb-6">The upgrade path</p>
            <div className="space-y-4">
              {[
                { free: '🎯 Brand Voice Generator', paid: '→ Auto-generate brand-consistent content' },
                { free: '📅 Social Calendar Generator', paid: '→ Loraloop schedules and posts it for you' },
                { free: '📣 Ad Copy Generator', paid: '→ Launch and optimize ads automatically' },
                { free: '🗺️ Marketing Strategy', paid: '→ Loraloop executes the strategy end-to-end' },
              ].map((item) => (
                <div key={item.free} className="flex flex-col gap-1">
                  <span className="text-sm text-gray-700 font-medium">{item.free}</span>
                  <span className="text-sm text-violet-600 font-semibold">{item.paid}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <CTABanner />
      </section>
    </>
  );
}
