import type { MetadataRoute } from 'next';

const base = 'https://www.solarhomeenergybackup.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['/', '/shop', '/whole-home-backup', '/portable-power', '/solar-panels', '/ev-chargers', '/system-finder', '/shipping-delivery', '/returns', '/warranty', '/privacy', '/terms', '/payment-options', '/support'];
  return pages.map((path) => ({ url: `${base}${path}`, changeFrequency: 'weekly' as const, priority: path === '/' ? 1 : path === '/shop' ? 0.9 : 0.7 }));
}
