import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';
import { Platform, PostState } from '@loraloop/shared';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy');
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy h:mm a');
}

export function formatRelative(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '…';
}

export const PLATFORM_COLORS: Record<Platform, string> = {
  [Platform.TWITTER]: '#1DA1F2',
  [Platform.LINKEDIN_PERSONAL]: '#0A66C2',
  [Platform.LINKEDIN_PAGE]: '#0A66C2',
  [Platform.INSTAGRAM]: '#E1306C',
  [Platform.FACEBOOK]: '#1877F2',
  [Platform.TIKTOK]: '#69C9D0',
  [Platform.YOUTUBE]: '#FF0000',
  [Platform.REDDIT]: '#FF4500',
  [Platform.PINTEREST]: '#E60023',
  [Platform.DISCORD]: '#5865F2',
  [Platform.SLACK]: '#4A154B',
  [Platform.BLUESKY]: '#0085ff',
  [Platform.MASTODON]: '#6364FF',
  [Platform.THREADS]: '#000000',
  [Platform.TELEGRAM]: '#26A5E4',
  [Platform.GOOGLE_MY_BUSINESS]: '#4285F4',
};

export const PLATFORM_NAMES: Record<Platform, string> = {
  [Platform.TWITTER]: 'Twitter / X',
  [Platform.LINKEDIN_PERSONAL]: 'LinkedIn Personal',
  [Platform.LINKEDIN_PAGE]: 'LinkedIn Page',
  [Platform.INSTAGRAM]: 'Instagram',
  [Platform.FACEBOOK]: 'Facebook',
  [Platform.TIKTOK]: 'TikTok',
  [Platform.YOUTUBE]: 'YouTube',
  [Platform.REDDIT]: 'Reddit',
  [Platform.PINTEREST]: 'Pinterest',
  [Platform.DISCORD]: 'Discord',
  [Platform.SLACK]: 'Slack',
  [Platform.BLUESKY]: 'Bluesky',
  [Platform.MASTODON]: 'Mastodon',
  [Platform.THREADS]: 'Threads',
  [Platform.TELEGRAM]: 'Telegram',
  [Platform.GOOGLE_MY_BUSINESS]: 'Google My Business',
};

export const POST_STATE_COLORS: Record<PostState, string> = {
  [PostState.DRAFT]: 'bg-gray-500/20 text-gray-400',
  [PostState.SCHEDULED]: 'bg-blue-500/20 text-blue-400',
  [PostState.PUBLISHING]: 'bg-yellow-500/20 text-yellow-400',
  [PostState.PUBLISHED]: 'bg-green-500/20 text-green-400',
  [PostState.FAILED]: 'bg-red-500/20 text-red-400',
  [PostState.CANCELED]: 'bg-gray-500/20 text-gray-500',
};
