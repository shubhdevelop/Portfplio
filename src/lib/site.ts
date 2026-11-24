export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shubham2xx.vercel.app'
).replace(/\/$/, '');

export const SITE_NAME = 'Shubham Raj';

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function blogPath(slug: string): string {
  return `/blog/${encodeURIComponent(slug)}`;
}
