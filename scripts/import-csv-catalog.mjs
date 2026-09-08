import { readFile, writeFile } from 'node:fs/promises';

const [sourcePath, outputPath] = process.argv.slice(2);
if (!sourcePath || !outputPath) throw new Error('Usage: node scripts/import-csv-catalog.mjs <source.csv> <output.ts>');

function parseCsv(input) {
  const rows = []; let row = []; let cell = ''; let quoted = false;
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index]; const next = input[index + 1];
    if (char === '"' && quoted && next === '"') { cell += '"'; index += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === ',' && !quoted) { row.push(cell); cell = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) { if (char === '\r' && next === '\n') index += 1; row.push(cell); if (row.some(Boolean)) rows.push(row); row = []; cell = ''; }
    else cell += char;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [headers, ...body] = rows;
  return body.map((values) => Object.fromEntries(headers.map((header, index) => [header.replace(/^\uFEFF/, ''), values[index]?.trim() ?? ''])));
}

const normalise = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const slugify = (value) => normalise(value).replace(/ /g, '-').slice(0, 120);
const categoryFor = (name) => {
  const value = normalise(name);
  if (/battery|powerwall|power bank|expansion/.test(value)) return 'Batteries';
  if (/panel|solar kit|solar generator|solar briefcase/.test(value)) return 'Solar panels';
  if (/inverter|hybrid|microinverter/.test(value)) return 'Whole-home backup';
  if (/transfer|smart home|smart panel|inlet|breaker|disconnect|combiner/.test(value)) return 'Home integration';
  if (/cable|wire|connector|adapter|fuse|busbar|rack|mount|lug|terminal|tool|bracket/.test(value)) return 'Accessories';
  return 'Portable power';
};
const parsePrice = (value) => {
  const parsed = Number.parseFloat(value.replace(/[$,]/g, ''));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};
const discounted = (price) => price === null ? null : Math.round(price * 0.8 * 100) / 100;

const rows = parseCsv(await readFile(sourcePath, 'utf8'));
const records = new Map();
for (const row of rows) {
  const name = row['Product Name']; if (!name) continue;
  const sourcePrice = row.Currency === 'USD' ? parsePrice(row.Price) : null;
  const key = row.SKU ? `sku:${normalise(row.SKU)}` : `name:${normalise(name)}`;
  const existing = records.get(key);
  const offer = { supplier: row.Retailer === 'Anker SOLIX | BLUETTI' ? 'BLUETTI' : row.Retailer, supplierUrl: row['Product URL'], supplierSku: row.SKU || null, supplierPrice: sourcePrice, availability: 'UNKNOWN', lastCheckedAt: row['Retrieved Date'] || '2026-09-08' };
  if (existing) {
    existing.supplierOffers.push(offer);
    if (existing.sourcePrice === null && sourcePrice !== null) { existing.sourcePrice = sourcePrice; existing.retailPrice = discounted(sourcePrice); }
    continue;
  }
  records.set(key, {
    id: `csv-${slugify(name)}-${records.size + 1}`,
    slug: `${slugify(name)}-${records.size + 1}`,
    name,
    brand: row.Retailer,
    model: name,
    sku: row.SKU || null,
    category: categoryFor(name),
    shortDescription: name,
    status: 'APPROVED',
    wholeHomeCapable: /inverter|whole home|transfer|smart home|powerwall|18kpv|12kpv|6000xp|12000xp/i.test(name),
    continuousOutputWatts: null, surgeOutputWatts: null, batteryCapacityWh: null, maxExpandableCapacityWh: null, solarInputWatts: null, acVoltage: null, batteryChemistry: null, weightLb: null, warranty: null,
    specifications: { 'Product source': row.Retailer, 'Source SKU': row.SKU || 'Specification not provided.', 'Price checked': row['Retrieved Date'] || 'Specification not provided.' },
    rawSpecifications: `Imported from ${row.Retailer} CSV record.`,
    sourcePrice,
    retailPrice: discounted(sourcePrice),
    supplierOffers: [offer],
    imageUsageApproved: false,
    sourceImageUrl: null,
  });
}
const catalog = [...records.values()];
const pricedProducts = catalog.filter((product) => product.sourcePrice !== null).length;
const output = `/* This file is generated from the user-provided supplier catalog CSV. Do not edit manually. */\nimport type { CatalogProduct } from './types';\n\nexport const csvCatalog: CatalogProduct[] = ${JSON.stringify(catalog)};\n\nexport const csvCatalogAudit = { sourceRows: ${rows.length}, publishedProducts: ${catalog.length}, duplicateRowsMerged: ${rows.length - catalog.length}, pricedProducts: ${pricedProducts}, unpricedProducts: ${catalog.length - pricedProducts} } as const;\n`;
await writeFile(outputPath, output, 'utf8');
console.log(JSON.stringify({ sourceRows: rows.length, publishedProducts: catalog.length, duplicateRowsMerged: rows.length - catalog.length, pricedProducts }));
