import fs from 'node:fs';

/**
 * Runs after `vinext build`: lists the fixed pages plus every product page the
 * build actually emitted, so the sitemap can never point at a missing product.
 */
const siteUrl = 'https://www.solarhomeenergybackup.com';
const pages = ['/', '/shop', '/whole-home-backup', '/portable-power', '/solar-panels', '/ev-chargers', '/system-finder', '/shipping-delivery', '/returns', '/warranty', '/privacy', '/terms', '/payment-options', '/support'];
const productDir = new URL('../dist/client/products/', import.meta.url);
const productPaths = fs.existsSync(productDir)
  ? fs.readdirSync(productDir).filter((file) => file.endsWith('.html')).map((file) => `/products/${file.slice(0, -'.html'.length)}`).sort()
  : [];
const escape = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const urls = [...pages, ...productPaths].map((path) => `${siteUrl}${path}`);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${escape(url)}</loc></url>`).join('\n')}\n</urlset>\n`;

for (const target of ['../public/sitemap.xml', '../dist/client/sitemap.xml']) {
  const file = new URL(target, import.meta.url);
  if (fs.existsSync(new URL('.', file))) fs.writeFileSync(file, sitemap);
}
console.log(`Generated sitemap with ${urls.length} URLs (${productPaths.length} products).`);
