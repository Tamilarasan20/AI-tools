'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useOrgStore } from '@/store/org.store';
import { api } from '@/lib/api';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { truncate, POST_STATE_COLORS } from '@/lib/utils';
import { PostState } from '@loraloop/shared';

export default function CalendarPage() {
  const { currentOrg } = useOrgStore();
  const orgId = currentOrg?.id;
  const [currentDate, setCurrentDate] = useState(new Date());

  const from = startOfMonth(currentDate).toISOString();
  const to = endOfMonth(currentDate).toISOString();

  const { data } = useQuery({
    queryKey: ['posts', orgId, 'calendar', from, to],
    queryFn: () => api.posts.list(orgId!, { from, to, limit: 100 }),
    enabled: !!orgId,
  });

  const posts: any[] = (data as any)?.data || [];
  const days = eachDayOfInterval({ start: startOfMonth(currentDate), end: endOfMonth(currentDate) });
  const startDay = startOfMonth(currentDate).getDay();

  const prevMonth = () => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1));
  const nextMonth = () => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1));

  const getPostsForDay = (day: Date) =>
    posts.filter((p) => p.publishAt && isSameDay(new Date(p.publishAt), day));

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Calendar</h1>
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition">‹</button>
          <span className="text-sm font-medium text-white w-36 text-center">{format(currentDate, 'MMMM yyyy')}</span>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition">›</button>
        </div>
      </div>

      <div className="bg-[#16161f] border border-[#2a2a3e] rounded-xl overflow-hidden">
        <div className="grid grid-cols-7 border-b border-[#2a2a3e]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="py-3 text-center text-xs font-medium text-gray-500">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[90px] border-b border-r border-[#2a2a3e]" />
          ))}
          {days.map((day) => {
            const dayPosts = getPostsForDay(day);
            return (
              <div
                key={day.toISOString()}
                className={`min-h-[90px] border-b border-r border-[#2a2a3e] p-2 ${isToday(day) ? 'bg-brand-500/5' : ''}`}
              >
                <span className={`text-xs font-medium inline-flex w-6 h-6 items-center justify-center rounded-full mb-1 ${
                  isToday(day) ? 'bg-brand-500 text-white' : 'text-gray-500'
                }`}>
                  {format(day, 'd')}
                </span>
                <div className="space-y-1">
                  {dayPosts.slice(0, 2).map((post) => (
                    <div
                      key={post.id}
                      className={`text-xs px-1.5 py-0.5 rounded truncate ${POST_STATE_COLORS[post.state as PostState] || 'bg-gray-500/20 text-gray-400'}`}
                    >
                      {truncate(post.content, 20)}
                    </div>
                  ))}
                  {dayPosts.length > 2 && (
                    <p className="text-xs text-gray-600">+{dayPosts.length - 2} more</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
