import fs from 'node:fs';

const siteUrl = 'https://www.solarhomeenergybackup.com';
const generated = fs.readFileSync(new URL('../lib/catalog/catalog.generated.ts', import.meta.url), 'utf8');
const catalog = JSON.parse(generated.match(/export const csvCatalog: CatalogProduct\[\] = (\[.*\]);/s)[1]);
const productSource = fs.readFileSync(new URL('../lib/catalog/products.ts', import.meta.url), 'utf8');
const exclusions = new Set([...productSource.match(/const unusablePrimaryImageIds = new Set\(\[([\s\S]*?)\]\);/)[1].matchAll(/'([^']+)'/g)].map((match) => match[1]));
const uniqueModels = new Set();
const products = catalog.filter((product) => {
  if (product.status !== 'APPROVED' || exclusions.has(product.id)) return false;
  const key = `${product.brand}:${product.model}`.replace(/[^a-z0-9]/gi, '').toLowerCase();
  if (uniqueModels.has(key)) return false;
  uniqueModels.add(key);
  return true;
});
const pages = ['/', '/shop', '/whole-home-backup', '/portable-power', '/solar-panels', '/ev-chargers', '/system-finder', '/shipping-delivery', '/returns', '/warranty', '/privacy', '/terms', '/payment-options', '/support'];
const escape = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const urls = [...pages.map((path) => `${siteUrl}${path}`), ...products.map((product) => `${siteUrl}/product/${product.slug}`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${escape(url)}</loc></url>`).join('\n')}\n</urlset>\n`;

fs.writeFileSync(new URL('../public/sitemap.xml', import.meta.url), sitemap);
console.log(`Generated sitemap with ${urls.length} URLs.`);
