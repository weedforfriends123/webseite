/**
 * Prefixes large static assets (videos, GLBs) with the CDN base URL.
 * Set NEXT_PUBLIC_CDN_URL on Railway to point to Supabase Storage:
 *   https://<project>.supabase.co/storage/v1/object/public/assets
 * Falls back to local /public path when the env var is not set (dev).
 */
export function cdn(path: string): string {
  const base = process.env.NEXT_PUBLIC_CDN_URL ?? ""
  return `${base}${path}`
}
