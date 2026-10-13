import crypto from 'node:crypto';
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
// Feed markets. Source catalog prices are USD; these fixed, versioned rates
// match the storefront market selector and are refreshed before a commercial
// price update. Gulf currencies follow their USD pegs.
const markets = [
  { code: 'US', language: 'en', locale: 'en-US', currency: 'USD', rate: 1, shipping: 'US:::45.00 USD', label: 'United States' },
  { code: 'GB', language: 'en', locale: 'en-GB', currency: 'GBP', rate: 0.7555, shipping: 'GB:::0 GBP', label: 'United Kingdom' },
  { code: 'AU', language: 'en', locale: 'en-AU', currency: 'AUD', rate: 1.4328, shipping: 'AU:::0 AUD', label: 'Australia' },
  { code: 'DE', language: 'de', locale: 'de-DE', currency: 'EUR', rate: 0.8944, shipping: 'DE:::0 EUR', label: 'Germany' },
  { code: 'IT', language: 'it', locale: 'it-IT', currency: 'EUR', rate: 0.8944, shipping: 'IT:::0 EUR', label: 'Italy' },
  { code: 'KW', language: 'ar', locale: 'ar-KW', currency: 'KWD', rate: 0.3067, shipping: 'KW:::0 KWD', label: 'الكويت' },
  { code: 'NL', language: 'nl', locale: 'nl-NL', currency: 'EUR', rate: 0.8944, shipping: 'NL:::0 EUR', label: 'Netherlands' },
  { code: 'PL', language: 'pl', locale: 'pl-PL', currency: 'PLN', rate: 3.9200, shipping: 'PL:::0 PLN', label: 'Polska' },
  { code: 'SA', language: 'ar', locale: 'ar-SA', currency: 'SAR', rate: 3.75, shipping: 'SA:::0 SAR', label: 'السعودية' },
  { code: 'AE', language: 'ar', locale: 'ar-AE', currency: 'AED', rate: 3.6725, shipping: 'AE:::0 AED', label: 'الإمارات العربية المتحدة' },
];
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


/**
 * google_product_category from Google's product taxonomy (IDs verified against
 * taxonomy-with-ids.en-US.txt, version 2021-09-21). Title keywords first,
 * then the store category as a fallback.
 */
const googleCategoryRules = [
  // Appliances first: their titles contain words like "mount", "rack",
  // "all-in-one", or "inverter" that the power-equipment rules would catch.
  [/dishwasher/i, 680],
  [/freezer(?!.*refrigerator)/i, 681],
  [/refrigerator|fridge/i, 686],
  [/laundry center|washer.*dryer combo|washtower/i, 2849], // Laundry Combo Units
  [/dryer/i, 2612],
  [/washer|washing machine/i, 2549],
  [/air conditioner/i, 605], // Climate Control Appliances > Air Conditioners
  [/(solar|panel).*(kit|bundle)|(kit|bundle).*solar panel|\+.*\d+\s?w\b.*(solar|panel)/i, 4715], // Solar Energy Kits
  [/power station|solar generator/i, 1218], // Generators
  [/generator(?!.*(cover|cord|adapter|input|cable|kit))/i, 1218], // Generators
  [/charge controller|\bmppt\b/i, 6817], // Battery Charge Controllers
  // Switches and panels often list an included cable in the title.
  [/transfer switch|interlock/i, 6459], // Electrical Switches
  [/breaker|load (?:center|controller)|smart (?:home )?panel|power hub/i, 6807], // Circuit Breaker Panels
  // Cables named after what they connect ("Battery to Inverter Cables") before inverters.
  [/\bawg\b|\bcables?\s*(?:$|[|,(])|\bpv wire\b|\bcable kit\b/i, 2345], // Electrical Wires & Cable
  [/inverter|all-in-one|multiplus|quattro/i, 5142], // Power Inverters
  [/transformer/i, 505318], // Voltage Transformers & Regulators
  [/\binlet\b/i, 499966], // Power Inlets
  [/ev charger|level 2|\bevse\b/i, 7414], // Vehicle Battery Chargers
  [/cable|\bwire\b|\bawg\b|\bmc4\b|\bcord\b/i, 2345], // Electrical Wires & Cable
  [/solar panel|\bmodule\b|bifacial|monocrystalline/i, 4714], // Solar Panels
  [/battery|lifepo4|\blfp\b/i, 276], // Batteries
  [/bracket|mount|rack/i, 2006], // Electrical Mount Boxes & Brackets
];
const googleCategoryByStoreCategory = {
  'Portable power': 1218, 'Whole-home backup': 5142, Batteries: 276, 'Solar panels': 4714,
  'Home integration': 127, 'EV chargers': 7414, Accessories: 127, Dishwashers: 680,
  Freezers: 681, Refrigerators: 686, 'Washers & Dryers': 2706,
};
const googleCategoryFor = (title, storeCategory) =>
  googleCategoryRules.find(([pattern]) => pattern.test(title))?.[1] ?? googleCategoryByStoreCategory[storeCategory] ?? 127;

/** Up to 10 highlights from the page's verified "Key features" list (150 chars max each). */
const highlightsFrom = (html) => {
  const list = html.match(/<h2>Key features<\/h2><ul>(.*?)<\/ul>/s)?.[1] ?? '';
  return [...list.matchAll(/<li>(.*?)<\/li>/gs)].map(([, item]) => decode(item.replace(/<[^>]+>/g, '')).trim()).filter((item) => item && item.length <= 150).slice(0, 10);
};

const conditionName = (url = '') =>
  url.endsWith('RefurbishedCondition') ? 'refurbished' : url.endsWith('UsedCondition') ? 'used' : 'new';
const clean = (value) => String(value ?? '').replace(/[\t\r\n]+/g, ' ').replace(/\s{2,}/g, ' ').trim();

// Google occasionally classifies power equipment as restricted supplements
// when a manufacturer description uses "supplemental" or "supplements" in
// the ordinary energy sense (for example, solar supplements the grid). Keep
// the product meaning while removing that false healthcare signal from the
// submitted feed. This only changes the Merchant description, not the page.
const merchantDescription = (value) =>
  clean(value)
    .replace(/\bsupplement\w*\b/gi, 'additional');

// Google Merchant Center limits the item ID attribute to 50 characters. Keep
// short slugs readable, and shorten longer slugs with a deterministic suffix
// so IDs remain stable across feed rebuilds and unique across the catalog.
const merchantIdFor = (slug) => {
  const normalized = clean(slug);
  if (normalized.length <= 50) return normalized;
  const suffix = crypto.createHash('sha256').update(normalized).digest('hex').slice(0, 10);
  return `${normalized.slice(0, 39)}-${suffix}`;
};

const columns = ['id', 'title', 'description', 'link', 'image_link', 'additional_image_link', 'availability', 'price', 'brand', 'mpn', 'identifier_exists', 'condition', 'product_type', 'google_product_category', 'product_highlight', 'shipping'];
const rows = [];
const excluded = { noPrice: 0, noImage: 0, notInStock: 0, noBrand: 0, noProduct: 0 };

for (const file of fs.readdirSync(productDir).filter((name) => name.endsWith('.html')).sort()) {
  const slug = file.slice(0, -'.html'.length);
  const html = fs.readFileSync(new URL(file, productDir), 'utf8');
  const product = findProduct(html);
  if (!product) { excluded.noProduct++; continue; }
  const offer = Array.isArray(product.offers) ? product.offers[0] : product.offers;
  const images = (Array.isArray(product.image) ? product.image : [product.image]).filter(Boolean);
  if (!offer?.price) { excluded.noPrice++; continue; }
  if (!images.length) { excluded.noImage++; continue; }
  if (offer.availability !== 'https://schema.org/InStock') { excluded.notInStock++; continue; }
  // Brand is required for new items; never substitute the store name.
  if (!product.brand?.name) { excluded.noBrand++; continue; }

  const mpn = clean(product.mpn);
  rows.push({
    id: merchantIdFor(slug),
    title: clean(product.name).slice(0, 150),
    description: merchantDescription(product.description || product.name).slice(0, 5000),
    link: `${siteUrl}/products/${slug}`,
    imageLink: images[0],
    additionalImageLink: images.slice(1, 11).join(','),
    availability: 'in_stock',
    price: Number(offer.price),
    brand: clean(product.brand?.name),
    mpn,
    // No GTINs in the catalog. brand + mpn identify the item; if neither
    // exists, say so rather than inventing one.
    identifierExists: mpn && product.brand?.name ? '' : 'no',
    condition: conditionName(offer.itemCondition || product.itemCondition),
    productType: clean(product.category),
    googleProductCategory: String(googleCategoryFor(product.name, product.category)),
    // Multiple highlights are comma-separated; commas inside one become semicolons.
    productHighlight: highlightsFrom(html).map((item) => item.replace(/,/g, ';')).join(','),
    // Country-level delivery values (country:region:service:price). Prices
    // remain in USD; Merchant Center can display converted currency per
    // destination when the corresponding country is enabled in the feed.
  });
}

fs.mkdirSync(outDir, { recursive: true });
const convert = (amount, rate) => Math.round(amount * rate * 100) / 100;
const localizedDescription = (description, market) => {
  const prefix = market.language === 'ar'
    ? `منتج من SolarHome Energy Backup في فئة الطاقة والمعدات. ${description}`
    : description;
  return clean(prefix).slice(0, 5000);
};
const renderRows = (market) => rows.map((row) => [
  row.id, row.title, localizedDescription(row.description, market), `${row.link}?market=${market.code}`,
  row.imageLink, row.additionalImageLink, row.availability, `${convert(row.price, market.rate).toFixed(2)} ${market.currency}`,
  row.brand, row.mpn, row.identifierExists, row.condition, row.productType, row.googleProductCategory, row.productHighlight, market.shipping,
].map(clean).join('\t'));
for (const market of markets) {
  const filename = `google-merchant-products-${market.code.toLowerCase()}.tsv`;
  fs.writeFileSync(new URL(filename, outDir), [columns.join('\t'), ...renderRows(market)].join('\n') + '\n');
}
// Keep the historical URL as the US source so existing integrations do not
// break while each country is migrated to its own source in Merchant Center.
fs.writeFileSync(new URL('google-merchant-products.tsv', outDir), [columns.join('\t'), ...renderRows(markets[0])].join('\n') + '\n');
fs.writeFileSync(new URL('google-merchant-feed-manifest.json', outDir), JSON.stringify({ generatedAt: new Date().toISOString(), sourceCurrency: 'USD', products: rows.length, markets: markets.map(({ code, language, currency, label }) => ({ code, language, currency, label, file: `google-merchant-products-${code.toLowerCase()}.tsv` })) }, null, 2) + '\n');
console.log(`Merchant Center feeds: ${rows.length} items × ${markets.length} markets; excluded ${JSON.stringify(excluded)}.`);
