import fs from 'node:fs';

/**
 * Runs after `vinext build`. Reads the pages the build actually emitted and
 * writes:
 *  - sitemap.xml: fixed pages, guides (with lastmod), and every product page.
 *  - llms.txt: a plain-text site summary for AI assistants (llmstxt.org).
 * Both are written to dist/client for deployment and to public/ so the repo
 * copy stays current.
 */
const siteUrl = 'https://www.solarhomeenergybackup.com';
const dist = new URL('../dist/client/', import.meta.url);
const pages = ['/', '/shop', '/blog', '/whole-home-backup', '/portable-power', '/solar-panels', '/ev-chargers', '/system-finder', '/shipping-delivery', '/returns', '/warranty', '/privacy', '/terms', '/payment-options', '/support'];

const htmlFiles = (dir) => {
  const url = new URL(dir, dist);
  return fs.existsSync(url) ? fs.readdirSync(url).filter((file) => file.endsWith('.html')).sort() : [];
};
const readPage = (path) => {
  const file = new URL(path === '/' ? 'index.html' : `${path.slice(1)}.html`, dist);
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
};
const decode = (value) => value.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const meta = (html, pattern) => decode(html.match(pattern)?.[1] ?? '');
const titleOf = (html) => meta(html, /<title>([^<]*)<\/title>/).replace(/ \| SolarHome Energy Backup$/, '');
const descriptionOf = (html) => meta(html, /<meta name="description" content="([^"]*)"/);
const modifiedOf = (html) => meta(html, /<meta property="article:modified_time" content="([^"]*)"/);

const guides = htmlFiles('blog/').map((file) => {
  const path = `/blog/${file.slice(0, -'.html'.length)}`;
  const html = readPage(path);
  return { path, title: titleOf(html), description: descriptionOf(html), lastmod: modifiedOf(html) };
});
const productPaths = htmlFiles('products/').map((file) => `/products/${file.slice(0, -'.html'.length)}`);

// --- sitemap.xml -----------------------------------------------------------
const escape = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const entries = [
  ...pages.map((path) => ({ path })),
  ...guides.map(({ path, lastmod }) => ({ path, lastmod })),
  ...productPaths.map((path) => ({ path })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
  .map(({ path, lastmod }) => `  <url><loc>${escape(`${siteUrl}${path}`)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`)
  .join('\n')}\n</urlset>\n`;

// --- llms.txt ----------------------------------------------------------------
const link = (path, fallbackTitle) => {
  const html = readPage(path);
  const title = titleOf(html) || fallbackTitle;
  const description = descriptionOf(html);
  return `- [${title}](${siteUrl}${path})${description ? `: ${description}` : ''}`;
};
const llms = `# SolarHome Energy Backup

> Online store for solar panels, home batteries, portable power stations, whole-home backup systems, and EV chargers, with ${productPaths.length.toLocaleString('en-US')} product pages and planning guides for home outages. Orders are reviewed before payment; support is by WhatsApp, Monday to Saturday, 9 AM to 5 PM Pacific.

## Guides

${guides.map(({ path, title, description }) => `- [${title}](${siteUrl}${path})${description ? `: ${description}` : ''}`).join('\n')}

## Shop

${[
  ['/shop', 'Shop all products'],
  ['/whole-home-backup', 'Whole-home backup'],
  ['/portable-power', 'Portable power stations'],
  ['/solar-panels', 'Solar panels'],
  ['/ev-chargers', 'EV chargers'],
  ['/system-finder', 'System Finder'],
].map(([path, title]) => link(path, title)).join('\n')}

## Policies

${[
  ['/shipping-delivery', 'Shipping & delivery'],
  ['/returns', 'Returns & refunds'],
  ['/warranty', 'Warranty'],
  ['/payment-options', 'Payment options'],
  ['/support', 'Customer support'],
].map(([path, title]) => link(path, title)).join('\n')}

## Optional

- [Sitemap](${siteUrl}/sitemap.xml): every product page
`;

for (const [name, content] of [['sitemap.xml', sitemap], ['llms.txt', llms]]) {
  for (const dir of ['../public/', '../dist/client/']) {
    const folder = new URL(dir, import.meta.url);
    if (fs.existsSync(folder)) fs.writeFileSync(new URL(name, folder), content);
  }
}
console.log(`Generated sitemap with ${entries.length} URLs (${guides.length} guides, ${productPaths.length} products) and llms.txt.`);
