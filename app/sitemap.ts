import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap { const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'; return ['/', '/shop', '/product', '/compare', '/system-finder', '/invoice'].map((path) => ({ url: `${base}${path}` })); }
