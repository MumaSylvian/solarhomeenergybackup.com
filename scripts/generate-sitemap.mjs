import fs from 'node:fs';

const siteUrl = 'https://www.solarhomeenergybackup.com';
const pages = ['/', '/shop', '/whole-home-backup', '/portable-power', '/solar-panels', '/ev-chargers', '/system-finder', '/shipping-delivery', '/returns', '/warranty', '/privacy', '/terms', '/payment-options', '/support'];
const escape = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const urls = pages.map((path) => `${siteUrl}${path}`);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${escape(url)}</loc></url>`).join('\n')}\n</urlset>\n`;

fs.writeFileSync(new URL('../public/sitemap.xml', import.meta.url), sitemap);
console.log(`Generated sitemap with ${urls.length} URLs.`);
