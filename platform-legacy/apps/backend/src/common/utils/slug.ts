/**
 * Generates a URL-safe slug from a given name string.
 * Lowercases, replaces spaces with hyphens, removes non-alphanumeric chars.
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Generates a unique slug by appending a random suffix if needed.
 */
export function generateUniqueSlug(name: string, suffix?: string): string {
  const base = generateSlug(name);
  if (suffix) {
    return `${base}-${suffix}`;
  }
  const random = Math.random().toString(36).slice(2, 6);
  return `${base}-${random}`;
}
