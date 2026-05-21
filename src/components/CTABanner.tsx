interface CTABannerProps {
  heading?: string;
  subtext?: string;
}

export default function CTABanner({
  heading = 'Ready to automate your whole marketing workflow?',
  subtext = 'Loraloop turns these free tools into a full marketing system — brand-consistent content, auto-scheduling, and approval workflows. No agency required.',
}: CTABannerProps) {
  return (
    <div className="mt-16 bg-gradient-to-r from-violet-600 to-purple-700 rounded-2xl p-8 sm:p-10 text-center">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{heading}</h2>
      <p className="text-violet-100 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">{subtext}</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href="https://loraloop.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-violet-700 font-bold px-8 py-3.5 rounded-xl hover:bg-violet-50 transition-colors text-sm"
        >
          Start with Loraloop Free →
        </a>
        <a
          href="https://loraloop.com/demo"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border-2 border-white/40 text-white font-semibold px-8 py-3.5 rounded-xl hover:border-white/70 transition-colors text-sm"
        >
          See a demo
        </a>
      </div>
    </div>
  );
}
