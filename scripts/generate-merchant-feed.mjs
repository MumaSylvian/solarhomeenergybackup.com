import fs from 'node:fs';

/**
 * Runs after `vinext build`. Builds a Google Merchant Center product feed
 * (TSV) from the Product JSON-LD in the emitted product pages, so every feed
 * value is, by construction, the value on the landing page.
 *
 * Policy exclusions are applied here, at feed-build time:
 *  - no price, no image, or no in-stock claim on the page → excluded
 *    (availability must match real fulfilment capability)
 * Identifiers are never invented: GTINs are not in the catalog, so none are
 * sent; the manufacturer part number (mpn) is sent where the page has one.
 *
 * Output: dist/client/feeds/google-merchant-products.tsv
 * Not submitted anywhere automatically. Register it in Merchant Center only
 * after the readiness verdict in docs/merchant-center-readiness.md is READY.
 */
const siteUrl = 'https://www.solarhomeenergybackup.com';
const productDir = new URL('../dist/client/products/', import.meta.url);
const outDir = new URL('../dist/client/feeds/', import.meta.url);

if (!fs.existsSync(productDir)) {
  console.log('No built product pages; skipping Merchant Center feed.');
  process.exit(0);
}

const decode = (value) =>
  value.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

/** Recursively finds the first Product node in any JSON-LD block. */
function findProduct(html) {
  for (const [, block] of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    let data;
    try {
      data = JSON.parse(decode(block));
    } catch {
      continue;
    }
    const stack = [data];
    while (stack.length) {
      const node = stack.pop();
      if (Array.isArray(node)) stack.push(...node);
      else if (node && typeof node === 'object') {
        if (node['@type'] === 'Product') return node;
        stack.push(...Object.values(node));
      }
    }
  }
  return null;
}

const conditionName = (url = '') =>
  url.endsWith('RefurbishedCondition') ? 'refurbished' : url.endsWith('UsedCondition') ? 'used' : 'new';
const clean = (value) => String(value ?? '').replace(/[\t\r\n]+/g, ' ').replace(/\s{2,}/g, ' ').trim();

const columns = ['id', 'title', 'description', 'link', 'image_link', 'additional_image_link', 'availability', 'price', 'brand', 'mpn', 'identifier_exists', 'condition', 'product_type'];
const rows = [];
const excluded = { noPrice: 0, noImage: 0, notInStock: 0, noBrand: 0, noProduct: 0 };

for (const file of fs.readdirSync(productDir).filter((name) => name.endsWith('.html')).sort()) {
  const slug = file.slice(0, -'.html'.length);
  const product = findProduct(fs.readFileSync(new URL(file, productDir), 'utf8'));
  if (!product) { excluded.noProduct++; continue; }
  const offer = Array.isArray(product.offers) ? product.offers[0] : product.offers;
  const images = (Array.isArray(product.image) ? product.image : [product.image]).filter(Boolean);
  if (!offer?.price) { excluded.noPrice++; continue; }
  if (!images.length) { excluded.noImage++; continue; }
  if (offer.availability !== 'https://schema.org/InStock') { excluded.notInStock++; continue; }
  // Brand is required for new items; never substitute the store name.
  if (!product.brand?.name) { excluded.noBrand++; continue; }

  const mpn = clean(product.mpn);
  rows.push([
    slug,
    clean(product.name).slice(0, 150),
    clean(product.description || product.name).slice(0, 5000),
    `${siteUrl}/products/${slug}`,
    images[0],
    images.slice(1, 11).join(','),
    'in_stock',
    `${offer.price} ${offer.priceCurrency}`,
    clean(product.brand?.name),
    mpn,
    // No GTINs in the catalog. brand + mpn identify the item; if neither
    // exists, say so rather than inventing one.
    mpn && product.brand?.name ? '' : 'no',
    conditionName(offer.itemCondition || product.itemCondition),
    clean(product.category),
  ].map(clean).join('\t'));
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(new URL('google-merchant-products.tsv', outDir), [columns.join('\t'), ...rows].join('\n') + '\n');
console.log(`Merchant Center feed: ${rows.length} items; excluded ${JSON.stringify(excluded)}.`);
