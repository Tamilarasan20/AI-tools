import Link from 'next/link';

interface ToolCardProps {
  emoji: string;
  name: string;
  description: string;
  href: string;
  badge?: string;
  keyword?: string;
}

export default function ToolCard({ emoji, name, description, href, badge, keyword }: ToolCardProps) {
  return (
    <Link
      href={href}
      className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-violet-300 hover:shadow-md transition-all duration-200 flex flex-col"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-3xl">{emoji}</span>
        {badge && (
          <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-violet-700 transition-colors">
        {name}
      </h3>
      <p className="text-sm text-gray-500 leading-relaxed flex-1">{description}</p>
      {keyword && (
        <p className="text-xs text-gray-400 mt-3">Ranks for: {keyword}</p>
      )}
      <div className="mt-4 text-sm font-semibold text-violet-600 group-hover:text-violet-700">
        Try free →
      </div>
    </Link>
  );
}
