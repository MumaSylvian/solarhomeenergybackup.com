import { mkdir, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const [outputPath, imageDirectory, ...archives] = process.argv.slice(2);
if (!outputPath || !imageDirectory || archives.length === 0) {
  throw new Error('Usage: node scripts/import-zipped-catalogs.mjs <output.ts> <public-image-directory> <catalog.zip> [...]');
}

const supplierByArchive = new Map([
  ['MY CSV 1.zip', 'Signature Solar'],
  ['MY CSV 2.zip', 'Current Connected'],
  ['MY CSV 3.zip', 'EcoFlow'],
  ['MY CSV 4.zip', 'Anker SOLIX'],
  ['MY CSV 5.zip', 'BLUETTI'],
]);

const runTar = (args, encoding = 'utf8') => {
  const result = spawnSync('tar.exe', args, { encoding, maxBuffer: 64 * 1024 * 1024 });
  if (result.status !== 0) throw new Error(result.stderr || `tar failed: ${args.join(' ')}`);
  return result.stdout;
};

function parseCsv(input) {
  const rows = []; let row = []; let cell = ''; let quoted = false;
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index]; const next = input[index + 1];
    if (char === '"' && quoted && next === '"') { cell += '"'; index += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === ',' && !quoted) { row.push(cell); cell = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && next === '\n') index += 1;
      row.push(cell); if (row.some(Boolean)) rows.push(row); row = []; cell = '';
    } else cell += char;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [headers, ...body] = rows;
  return body.map((values) => Object.fromEntries(headers.map((header, index) => [header.replace(/^\uFEFF/, '').trim(), values[index]?.trim() ?? ''])));
}

const clean = (value = '') => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').trim();
const normalise = (value = '') => clean(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const slugify = (value = '') => normalise(value).replace(/ /g, '-').slice(0, 105);
const price = (value) => {
  const parsed = Number.parseFloat(String(value ?? '').replace(/[$,]/g, ''));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};
const discounted = (value) => value === null ? null : Math.round(value * 0.8 * 100) / 100;
const firstSentence = (description, name, category) => {
  const text = clean(description).replace(new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'i'), '');
  const sentence = text.match(/^.{35,300}?[.!?](?:\s|$)/)?.[0] ?? text.slice(0, 250);
  if (sentence.length >= 35) return sentence.trim();
  const label = category === 'Solar panels' ? 'solar component' : category === 'Batteries' ? 'energy storage component' : category === 'Accessories' ? 'system accessory' : 'backup power component';
  return `${name} is a ${label}. Review the product details for compatibility and installation requirements.`;
};

const brandRules = [
  ['EcoFlow', /\becoflow\b|\bdelta\b|\briver\b|\bwave\b|\bglacier\b/i],
  ['Anker SOLIX', /\banker\b|\bsolix\b|\bf3800\b|\bf2000\b|\bc1000\b|\bc800\b|\bc300\b/i],
  ['BLUETTI', /\bbluetti\b|\bac\d{2,4}\b|\beb\d{2,4}\b|\bb\d{3,4}\b/i],
  ['EG4', /\beg4\b/i],
  ['Victron Energy', /\bvictron\b|\bmultiplus\b|\bquattro\b|\bcerbo\b|\blynx\b/i],
  ['Sol-Ark', /\bsol[- ]?ark\b/i],
  ['Fortress Power', /\bfortress\b/i],
  ['Pytes', /\bpytes\b/i],
  ['SOK', /\bsok\b/i],
  ['Discover Energy', /\bdiscover\b/i],
  ['MidNite Solar', /\bmidnite\b/i],
  ['Aptos Solar', /\baptos\b/i],
  ['Canadian Solar', /\bcanadian solar\b/i],
  ['IronRidge', /\bironridge\b/i],
  ['Tigo Energy', /\btigo\b/i],
  ['Stäubli', /\bst[aä]ubli\b/i],
  ['Wera', /\bwera\b/i],
];

function brandFor(name, fallback) {
  return brandRules.find(([, expression]) => expression.test(name))?.[0] ?? fallback;
}

function categoryFor(name, description) {
  const value = `${name} ${description}`.toLowerCase();
  if (/\b(ev charger|electric vehicle|evse|wallbox|j1772|nacs)\b/.test(name.toLowerCase())) return 'EV chargers';
  if (/\b(panel|module|photovoltaic|solar briefcase|solar blanket)\b/.test(value)) return 'Solar panels';
  if (/\b(battery|expansion battery|b\d{3,4}\b|lifepo4|lithium storage)\b/.test(value) && !/\b(power station|generator)\b/.test(value)) return 'Batteries';
  if (/\b(transfer|smart home|smart panel|gateway|breaker|combiner|disconnect|distribution|meter|monitoring)\b/.test(value)) return 'Home integration';
  if (/\b(cable|wire|connector|adapter|fuse|busbar|rack|mount|lug|terminal|tool|bracket|crimper)\b/.test(value)) return 'Accessories';
  if (/\b(inverter|hybrid|transformer|whole[ -]?home|power kit|system bundle|solar kit)\b/.test(value)) return 'Whole-home backup';
  return 'Portable power';
}

function titleFacts(name, description) {
  const text = `${name} ${description}`;
  const voltage = text.match(/\b(\d{1,3}(?:\s*\/\s*\d{1,3})?\s*V(?:AC|DC)?)\b/i)?.[1]?.replace(/\s+/g, '') ?? null;
  const kwh = text.match(/\b(\d+(?:\.\d+)?)\s*kWh\b/i)?.[1] ?? null;
  const watts = text.match(/\b(\d+(?:\.\d+)?)\s*(kW|W)\b/i);
  const capacityWh = kwh ? Math.round(Number(kwh) * 1000) : null;
  const powerWatts = watts ? Math.round(Number(watts[1]) * (watts[2].toLowerCase() === 'kw' ? 1000 : 1)) : null;
  return { voltage, capacityWh, powerWatts };
}

function excludeReason(name, description, amount) {
  const text = `${name} ${description}`.toLowerCase();
  if (amount === null) return 'missing price';
  if (/don't buy|coupon|gift card|store credit|terms and conditions/.test(text)) return 'non-product record';
  if (/\bdiscontinued\b/.test(text)) return 'discontinued';
  return null;
}

await rm(imageDirectory, { recursive: true, force: true });
await mkdir(imageDirectory, { recursive: true });
const records = new Map();
const audit = { sourceRows: 0, publishedProducts: 0, duplicateRowsMerged: 0, excludedNonProducts: 0, excludedDiscontinued: 0, excludedMissingPrice: 0, imagesCopied: 0, missingPrimaryImages: 0 };

for (const archivePath of archives) {
  const archiveName = path.basename(archivePath);
  const supplier = supplierByArchive.get(archiveName) ?? 'SolarHome Energy Backup';
  const members = runTar(['-tf', archivePath]).split(/\r?\n/).filter(Boolean);
  const csvName = members.find((member) => member.toLowerCase().endsWith('.csv'));
  if (!csvName) throw new Error(`No CSV found in ${archiveName}`);
  const rows = parseCsv(runTar(['-xOf', archivePath, csvName]));
  audit.sourceRows += rows.length;
  for (const row of rows) {
    const name = clean(row['Product Name']);
    const description = clean(row['Detailed Description']);
    const sourcePrice = price(row['Price USD']);
    if (!name) continue;
    const rejected = excludeReason(name, description, sourcePrice);
    if (rejected) {
      if (rejected === 'non-product record') audit.excludedNonProducts += 1;
      else if (rejected === 'discontinued') audit.excludedDiscontinued += 1;
      else audit.excludedMissingPrice += 1;
      continue;
    }
    const brand = brandFor(name, supplier);
    const category = categoryFor(name, description);
    const key = row.SKU ? `sku:${normalise(row.SKU)}` : `name:${normalise(brand)}:${normalise(name)}`;
    const existing = records.get(key);
    if (existing) {
      existing.supplierOffers.push({ supplier, supplierUrl: '', supplierSku: row.SKU || null, supplierPrice: sourcePrice, availability: 'IN_STOCK', lastCheckedAt: '2026-09-12' });
      if (sourcePrice < existing.sourcePrice) { existing.sourcePrice = sourcePrice; existing.retailPrice = discounted(sourcePrice); }
      audit.duplicateRowsMerged += 1;
      continue;
    }
    const gallery = String(row['Gallery Image Files'] ?? '').split(';').map((item) => item.trim().replace(/\\/g, '/')).filter(Boolean);
    const id = `catalog-${records.size + 1}`;
    const slug = `${slugify(brand)}-${slugify(name)}-${records.size + 1}`;
    const galleryImageUrls = [];
    for (const [imageIndex, sourcePath] of gallery.slice(0, 4).entries()) {
      if (!members.includes(sourcePath)) continue;
      const extension = path.extname(sourcePath || '.webp').toLowerCase() || '.webp';
      const outputName = imageIndex === 0 ? `${id}${extension}` : `${id}-${imageIndex + 1}${extension}`;
      const imageBuffer = runTar(['-xOf', archivePath, sourcePath], null);
      await writeFile(path.join(imageDirectory, outputName), imageBuffer);
      galleryImageUrls.push(`/catalog/${outputName}`);
      audit.imagesCopied += 1;
    }
    const imageUrl = galleryImageUrls[0] ?? null;
    if (!imageUrl) audit.missingPrimaryImages += 1;
    const facts = titleFacts(name, description);
    const specifications = {
      'Model / SKU': row.SKU || name,
      Brand: brand,
      Category: category,
      ...(facts.voltage ? { Voltage: facts.voltage } : {}),
      ...(facts.capacityWh ? { 'Energy capacity': `${(facts.capacityWh / 1000).toFixed(facts.capacityWh % 1000 ? 1 : 0)} kWh` } : {}),
      ...(facts.powerWatts ? { 'Rated power': `${facts.powerWatts.toLocaleString()} W` } : {}),
    };
    records.set(key, {
      id,
      slug,
      name,
      brand,
      model: row.SKU || name,
      sku: row.SKU || null,
      category,
      shortDescription: firstSentence(description, name, category),
      status: 'APPROVED',
      wholeHomeCapable: category === 'Whole-home backup' || /whole[ -]?home|120\s*\/\s*240\s*v|split[ -]?phase/i.test(`${name} ${description}`),
      continuousOutputWatts: category === 'Solar panels' ? null : facts.powerWatts,
      surgeOutputWatts: null,
      batteryCapacityWh: facts.capacityWh,
      maxExpandableCapacityWh: null,
      solarInputWatts: null,
      acVoltage: facts.voltage,
      batteryChemistry: /lifepo4/i.test(`${name} ${description}`) ? 'LiFePO4' : null,
      weightLb: null,
      warranty: '6-month limited warranty',
      specifications,
      rawSpecifications: description.slice(0, 4000),
      sourcePrice,
      retailPrice: discounted(sourcePrice),
      supplierOffers: [{ supplier, supplierUrl: '', supplierSku: row.SKU || null, supplierPrice: sourcePrice, availability: 'IN_STOCK', lastCheckedAt: '2026-09-12' }],
      imageUsageApproved: Boolean(imageUrl),
      sourceImageUrl: imageUrl,
      sourceDetailImageUrl: imageUrl,
      galleryImageUrls,
    });
  }
}

const catalog = [...records.values()].sort((left, right) => left.brand.localeCompare(right.brand) || left.category.localeCompare(right.category) || left.name.localeCompare(right.name));
audit.publishedProducts = catalog.length;
const output = `/* Generated from the five user-provided product archives. Do not edit manually. */\nimport type { CatalogProduct } from './types';\n\nexport const csvCatalog: CatalogProduct[] = ${JSON.stringify(catalog)};\n\nexport const csvCatalogAudit = ${JSON.stringify(audit)} as const;\n`;
await writeFile(outputPath, output, 'utf8');
console.log(JSON.stringify({ ...audit, brands: new Set(catalog.map((product) => product.brand)).size, categories: Object.fromEntries([...new Set(catalog.map((product) => product.category))].map((category) => [category, catalog.filter((product) => product.category === category).length])) }, null, 2));
