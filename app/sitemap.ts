import type { MetadataRoute } from 'next';
import { approvedCatalog } from '@/lib/catalog/products';
export default function sitemap(): MetadataRoute.Sitemap { const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'; return ['/', '/shop', '/compare', '/system-finder', '/invoice'].map((path) => ({ url: `${base}${path}` })).concat(approvedCatalog.map((product) => ({ url: `${base}/products/${product.slug}` }))); }
