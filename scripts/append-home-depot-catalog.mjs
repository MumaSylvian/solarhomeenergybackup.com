import { readFile, writeFile } from 'node:fs/promises';

const [sourcePath, generatedPath] = process.argv.slice(2);
if (!sourcePath || !generatedPath)
  throw new Error(
    'Usage: node scripts/append-home-depot-catalog.mjs <source.csv> <generated.ts>',
  );

function parseCsv(input) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];
    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') quoted = !quoted;
    else if (char === ',' && !quoted) {
      row.push(cell);
      cell = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && next === '\n') index += 1;
      row.push(cell);
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = '';
    } else cell += char;
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  const [headers, ...body] = rows;
  return body.map((values) =>
    Object.fromEntries(
      headers.map((header, index) => [
        header.replace(/^\uFEFF/, ''),
        values[index]?.trim() ?? '',
      ]),
    ),
  );
}

const normalise = (value = '') =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
const slugify = (value) => normalise(value).replace(/ /g, '-').slice(0, 120);
const parsePrice = (value) => {
  const parsed = Number.parseFloat((value ?? '').replace(/[$,]/g, ''));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};
const discountPercent = (price) =>
  price <= 500 ? 10 : price <= 1000 ? 15 : price <= 5000 ? 20 : 25;
const discounted = (price) =>
  price === null
    ? null
    : Math.round(price * (1 - discountPercent(price) / 100) * 100) / 100;
const validUrl = (value) => /^https?:\/\/[^\s]+$/i.test(value ?? '');
const concise = (value, fallback) => {
  const text = (value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return !text
    ? fallback
    : text.length <= 240
      ? text
      : `${text.slice(0, 237).replace(/[,;:\s]+$/, '')}…`;
};

const generated = await readFile(generatedPath, 'utf8');
const existingMatch = generated.match(
  /export const csvCatalog: CatalogProduct\[\] = (.*);\r?\n\r?\nexport const csvCatalogAudit/s,
);
if (!existingMatch)
  throw new Error('Could not read the existing generated catalog.');
const existingCatalog = JSON.parse(existingMatch[1]);
const rows = parseCsv(await readFile(sourcePath, 'utf8'));
const imported = [];
const seen = new Set(
  existingCatalog.map((product) =>
    product.sku
      ? `sku:${normalise(product.sku)}`
      : `name:${normalise(product.name)}`,
  ),
);
const retrievedDate = new Date().toISOString().slice(0, 10);

for (const row of rows) {
  const name = row['Product Name'];
  const sku = row.SKU || null;
  const key = sku ? `sku:${normalise(sku)}` : `name:${normalise(name)}`;
  if (!name || seen.has(key)) continue;
  const gallery = [
    ...new Set(
      (row['Gallery Image URLs'] ?? '')
        .split(';')
        .map((url) => url.trim())
        .filter(validUrl),
    ),
  ];
  if (!gallery.length) continue;
  const salePrice = parsePrice(row['Price USD']);
  const originalPrice = parsePrice(row['Original Price USD']);
  const sourcePrice =
    originalPrice && originalPrice > 0 ? originalPrice : salePrice;
  const model = row['Model Number'] || sku || name;
  const category = row.Category;
  imported.push({
    id: `csv-home-depot-${slugify(name)}-${imported.length + 1}`,
    slug: `${slugify(name)}-${imported.length + 1}`,
    name,
    brand: row.Brand || 'Home appliance',
    model,
    sku,
    category,
    shortDescription: concise(
      row['Detailed Description'],
      `${name} with product specifications and installation details supplied by the retailer.`,
    ),
    status: 'APPROVED',
    wholeHomeCapable: false,
    continuousOutputWatts: null,
    surgeOutputWatts: null,
    batteryCapacityWh: null,
    maxExpandableCapacityWh: null,
    solarInputWatts: null,
    acVoltage: null,
    batteryChemistry: null,
    weightLb: null,
    warranty: null,
    specifications: {
      'Model / SKU': model,
      Category: category,
      'Gallery images': String(gallery.length),
    },
    rawSpecifications: row['Detailed Description'] || '',
    supplierOffers: [
      {
        supplier: 'The Home Depot',
        supplierUrl: '',
        supplierSku: sku,
        supplierPrice: salePrice,
        availability: 'UNKNOWN',
        lastCheckedAt: retrievedDate,
      },
    ],
    sourcePrice,
    retailPrice: discounted(sourcePrice),
    imageUsageApproved: true,
    sourceImageUrl: gallery[0],
    sourceDetailImageUrl: gallery[0],
    galleryImageUrls: gallery,
  });
  seen.add(key);
}

const catalog = [...existingCatalog, ...imported];
const audit = {
  sourceRows: rows.length,
  publishedProducts: catalog.length,
  existingProducts: existingCatalog.length,
  importedProducts: imported.length,
  importedGalleryImages: imported.reduce(
    (total, product) => total + product.galleryImageUrls.length,
    0,
  ),
  categories: Object.fromEntries(
    [...new Set(catalog.map((product) => product.category))]
      .sort()
      .map((category) => [
        category,
        catalog.filter((product) => product.category === category).length,
      ]),
  ),
};
const output = `/* Generated from the SolarHome catalog and the supplied Home Depot CSV. Do not edit manually. */\nimport type { CatalogProduct } from './types';\n\nexport const csvCatalog: CatalogProduct[] = ${JSON.stringify(catalog)};\n\nexport const csvCatalogAudit = ${JSON.stringify(audit)} as const;\n`;
await writeFile(generatedPath, output, 'utf8');
console.log(
  JSON.stringify({ ...audit, skippedRows: rows.length - imported.length }),
);
