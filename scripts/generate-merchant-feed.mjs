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
    String(googleCategoryFor(product.name, product.category)),
    // Multiple highlights are comma-separated; commas inside one become semicolons.
    highlightsFrom(html).map((item) => item.replace(/,/g, ';')).join(','),
    // Flat US delivery from the Offer's shippingDetails (country:region:service:price).
    offer.shippingDetails?.shippingRate?.value ? `US:::${offer.shippingDetails.shippingRate.value} USD` : '',
  ].map(clean).join('\t'));
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(new URL('google-merchant-products.tsv', outDir), [columns.join('\t'), ...rows].join('\n') + '\n');
console.log(`Merchant Center feed: ${rows.length} items; excluded ${JSON.stringify(excluded)}.`);
