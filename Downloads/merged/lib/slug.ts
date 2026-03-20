export function normalizeSlug(value: string): string {
  return value.trim().toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
export const SLUG_MIN_LENGTH = 1;
export function isValidSlug(slug: string): boolean {
  const n = normalizeSlug(slug);
  return n.length >= SLUG_MIN_LENGTH && !/^-/.test(n) && !/-$/.test(n);
}
export function isFullName(slug: string): boolean {
  const parts = slug.trim().split(/[\s._-]+/);
  return parts.length >= 2 && parts.every(p => p.length >= 2);
}
