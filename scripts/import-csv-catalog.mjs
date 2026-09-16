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
  const parsed = Number.parseFloat((value ?? '').replace(/[$,]/g, ''));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};
const decodeEntities = (value = '') => value.replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code))).replace(/&quot;/g, '"').replace(/&#8217;/g, "'").replace(/&amp;/g, '&');
const plainText = (value = '') => decodeEntities(value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
const concise = (value, fallback) => {
  const text = plainText(value);
  if (text.length < 60) return fallback;
  const sentence = text.match(/^.{60,240}?[.!?](?:\s|$)/)?.[0] ?? text.slice(0, 220);
  return `${sentence.trim().replace(/[,:;]+$/, '')}${sentence.length < text.length && !/[.!?]$/.test(sentence) ? '…' : ''}`;
};
const listItems = (value = '') => [...value.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((match) => plainText(match[1])).filter(Boolean);
const normalized = (value = '') => plainText(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const terms = (value = '') => new Set(normalized(value).split(' ').filter((term) => term.length > 2));
const score = (left, right) => {
  const a = terms(left); const b = terms(right);
  const overlap = [...a].filter((term) => b.has(term)).length;
  return overlap / Math.max(a.size, b.size, 1);
};
const numberFrom = (text, expression, multiplier = 1) => {
  const match = text.match(expression);
  return match ? Math.round(Number(match[1].replace(',', '')) * multiplier) : null;
};
const voltageFrom = (text) => text.match(/(?<![\d,])(?:\d{1,2}(?:,\d{3})|\d{1,4})(?:\s*\/\s*\d{1,4})?\s*V(?:AC|DC)?\b/i)?.[0]?.replace(/[\s,]/g, '') ?? null;
const detailImageFrom = (image) => image?.srcset?.match(/(https?:[^,\s]+-1024x[^,\s]+)\s+1024w/i)?.[1] ?? image?.src ?? null;
const fallbackDescription = (name, category) => {
  const label = category === 'Solar panels' ? 'solar array component' : category === 'Batteries' ? 'energy-storage component' : category === 'Accessories' ? 'compatible system accessory' : 'backup-power component';
  return `${name} is a ${label}; review the listed electrical ratings, fit, and installation requirements before choosing a configuration.`;
};
const titleFacts = (name, category) => {
  const text = plainText(name);
  const voltage = voltageFrom(text);
  const kwh = text.match(/\b(\d+(?:\.\d+)?)\s*kWh\b/i)?.[1];
  const ah = text.match(/\b(\d+(?:\.\d+)?)\s*Ah\b/i)?.[1];
  const watts = text.match(/\b(\d+(?:\.\d+)?)\s*(kW|W)\b/i);
  const kva = text.match(/\b(\d+(?:\.\d+)?)\s*kVA\b/i)?.[1];
  const wattValue = watts ? Math.round(Number(watts[1]) * (watts[2].toLowerCase() === 'kw' ? 1000 : 1)) : null;
  return {
    voltage,
    capacityWh: kwh ? Math.round(Number(kwh) * 1000) : null,
    outputWatts: category === 'Solar panels' ? null : wattValue,
    specs: {
      ...(voltage ? { Voltage: voltage } : {}),
      ...(kwh ? { 'Energy capacity': `${kwh} kWh` } : {}),
      ...(ah ? { 'Battery capacity': `${ah} Ah` } : {}),
      ...(watts ? { [category === 'Solar panels' ? 'Panel rating' : 'Rated product power']: `${watts[1]} ${watts[2]}` } : {}),
      ...(kva ? { 'Inverter rating': `${kva} kVA` } : {}),
    },
  };
};
const categoryFromReference = (name) => {
  const value = normalized(name);
  if (/panel|module|photovoltaic|pv /.test(value)) return 'Solar panels';
  if (/battery|eg4 ll|powerpro|discover aes|lithium/.test(value)) return 'Batteries';
  if (/inverter|multiplus|quattro|sol ark|hybrid|all in one|bundle/.test(value)) return 'Whole-home backup';
  if (/power station|portable|river|delta|generator/.test(value)) return 'Portable power';
  if (/transfer|distribution|gateway|combiner|breaker|disconnect|monitor/.test(value)) return 'Home integration';
  return 'Accessories';
};
const fetchProduct = async (name) => {
  const endpoint = `https://www.currentconnected.com/wp-json/wc/store/v1/products?search=${encodeURIComponent(name)}`;
  const response = await fetch(endpoint, { headers: { 'user-agent': 'SolarHome-Reserve-Catalog-Research/1.0' } });
  if (!response.ok) throw new Error(`Catalog lookup failed (${response.status})`);
  const candidates = await response.json();
  return candidates.map((candidate) => ({ candidate, match: normalized(candidate.name) === normalized(name) ? 1 : score(candidate.name, name) })).sort((a, b) => b.match - a.match)[0] ?? null;
};
const enrichProduct = async (product) => {
  try {
    const result = await fetchProduct(product.name);
    if (!result || result.match < 0.62) return { matched: false };
    const source = result.candidate;
    const list = listItems(source.short_description || source.description || '');
    const text = `${source.name} ${plainText(source.short_description)} ${plainText(source.description)} ${list.join(' ')}`;
    const capacityWh = numberFrom(text, /(?:capacity|energy|storage)[^\d]{0,35}(\d+(?:\.\d+)?)\s*kWh\b/i, 1000) ?? numberFrom(text, /(?:capacity|energy|storage)[^\d]{0,35}(\d{3,6})\s*Wh\b/i);
    const outputWatts = numberFrom(text, /(?:continuous|rated|AC|inverter|output)[^\d]{0,35}(\d+(?:\.\d+)?)\s*kW\b/i, 1000) ?? numberFrom(text, /(?:continuous|rated|AC|inverter|output)[^\d]{0,35}(\d{3,6})\s*W\b/i);
    const solarInputWatts = numberFrom(text, /(?:solar|PV)[^\d]{0,35}(\d+(?:\.\d+)?)\s*kW\b/i, 1000) ?? numberFrom(text, /(?:solar|PV)[^\d]{0,35}(\d{3,6})\s*W\b/i);
    const voltage = [source.name, ...list.filter((item) => /(?:^|\b)(?:nominal|battery|input|output|AC|DC)\s*voltage\b/i.test(item) && !/isolation|withstand|dielectric/i.test(item))].map(voltageFrom).find(Boolean) ?? null;
    const productSpecs = Object.fromEntries(list.slice(0, 10).map((item, index) => {
      const [label, ...rest] = item.split(/:\s*/);
      return rest.length ? [label.slice(0, 48), rest.join(': ').slice(0, 150)] : [`Key detail ${index + 1}`, item.slice(0, 150)];
    }));
    product.shortDescription = concise(source.short_description || source.description, fallbackDescription(product.name, product.category));
    product.model = source.sku || product.model;
    product.sku = source.sku || product.sku;
    product.category = categoryFromReference(source.name);
    product.wholeHomeCapable = /120\s*\/\s*240\s*V|whole.home|split.phase|hybrid|inverter/i.test(text);
    product.continuousOutputWatts = outputWatts;
    product.batteryCapacityWh = capacityWh;
    product.solarInputWatts = solarInputWatts;
    product.acVoltage = voltage;
    product.specifications = {
      'Model / SKU': product.model || 'See product documentation',
      ...(voltage ? { Voltage: voltage } : {}),
      ...(capacityWh ? { 'Energy capacity': `${(capacityWh / 1000).toFixed(capacityWh % 1000 ? 1 : 0)} kWh` } : {}),
      ...(outputWatts ? { 'Rated output': `${outputWatts.toLocaleString()} W` } : {}),
      ...(solarInputWatts ? { 'Solar input': `${solarInputWatts.toLocaleString()} W` } : {}),
      ...productSpecs,
    };
    product.rawSpecifications = plainText(source.short_description || source.description).slice(0, 1800);
    product.supplierOffers[0].supplierUrl = source.permalink || product.supplierOffers[0].supplierUrl;
    product.sourceImageUrl = source.images?.[0]?.thumbnail || product.sourceImageUrl;
    product.sourceDetailImageUrl = detailImageFrom(source.images?.[0]) || product.sourceDetailImageUrl || product.sourceImageUrl;
    return { matched: true };
  } catch {
    return { matched: false };
  }
};
const mapConcurrent = async (items, limit, worker) => {
  let cursor = 0;
  const results = Array.from({ length: items.length });
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) { const index = cursor++; results[index] = await worker(items[index]); }
  }));
  return results;
};
const discounted = (price) => price === null ? null : Math.round(price * 0.8 * 100) / 100;
const supplierFor = (row) => {
  if (row.Retailer) return row.Retailer === 'Anker SOLIX | BLUETTI' ? 'BLUETTI' : row.Retailer;
  const imageHost = row['Image URL']?.toLowerCase() ?? '';
  if (imageHost.includes('currentconnected')) return 'Current Connected';
  if (imageHost.includes('signaturesolar')) return 'Signature Solar';
  if (imageHost.includes('ecoflow')) return 'EcoFlow';
  if (imageHost.includes('anker')) return 'Anker SOLIX';
  if (imageHost.includes('bluetti')) return 'BLUETTI';
  return 'Current Connected';
};
const approvedImageUrl = (value) => /^https?:\/\/[^\s]+$/i.test(value ?? '') ? value : null;

const rows = parseCsv(await readFile(sourcePath, 'utf8'));
const records = new Map();
for (const row of rows) {
  const name = decodeEntities(row['Product Name'] || row.Name); if (!name) continue;
  const priceValue = row['Price USD'] ?? row.Price;
  const sourcePrice = row.Currency && row.Currency !== 'USD' ? null : parsePrice(priceValue);
  const supplier = supplierFor(row);
  const imageUrl = approvedImageUrl(row['Image URL']);
  const key = row.SKU ? `sku:${normalise(row.SKU)}` : `name:${normalise(name)}`;
  const existing = records.get(key);
  const offer = { supplier, supplierUrl: row['Product URL'] || '', supplierSku: row.SKU || null, supplierPrice: sourcePrice, availability: 'UNKNOWN', lastCheckedAt: row['Retrieved Date'] || '2026-09-09' };
  if (existing) {
    existing.supplierOffers.push(offer);
    if (existing.sourcePrice === null && sourcePrice !== null) { existing.sourcePrice = sourcePrice; existing.retailPrice = discounted(sourcePrice); }
    if (!existing.sourceImageUrl && imageUrl) { existing.sourceImageUrl = imageUrl; existing.imageUsageApproved = true; }
    continue;
  }
  records.set(key, {
    id: `csv-${slugify(name)}-${records.size + 1}`,
    slug: `${slugify(name)}-${records.size + 1}`,
    name,
    brand: 'SolarHome Reserve',
    model: name,
    sku: row.SKU || null,
    category: categoryFor(name),
    shortDescription: name,
    status: 'APPROVED',
    wholeHomeCapable: /inverter|whole home|transfer|smart home|powerwall|18kpv|12kpv|6000xp|12000xp/i.test(name),
    continuousOutputWatts: null, surgeOutputWatts: null, batteryCapacityWh: null, maxExpandableCapacityWh: null, solarInputWatts: null, acVoltage: null, batteryChemistry: null, weightLb: null, warranty: null,
    specifications: { 'Model / SKU': row.SKU || 'See product documentation' },
    rawSpecifications: '',
    sourcePrice,
    retailPrice: discounted(sourcePrice),
    supplierOffers: [offer],
    imageUsageApproved: Boolean(imageUrl),
    sourceImageUrl: imageUrl,
    sourceDetailImageUrl: imageUrl,
  });
}
const catalog = [...records.values()];
const enrichment = await mapConcurrent(catalog, 8, enrichProduct);
for (const product of catalog) {
  if (!product.rawSpecifications) {
    const facts = titleFacts(product.name, product.category);
    product.shortDescription = fallbackDescription(product.name, product.category);
    product.continuousOutputWatts = facts.outputWatts;
    product.batteryCapacityWh = facts.capacityWh;
    product.acVoltage = facts.voltage;
    product.specifications = { 'Model / SKU': product.model || 'See product documentation', ...facts.specs };
  }
  if (!product.shortDescription || product.shortDescription === product.name) product.shortDescription = fallbackDescription(product.name, product.category);
  product.brand = 'SolarHome Reserve';
}
const pricedProducts = catalog.filter((product) => product.sourcePrice !== null).length;
const enrichedProducts = enrichment.filter((result) => result.matched).length;
const output = `/* Generated from the user-provided catalog with public product-documentation research. Do not edit manually. */\nimport type { CatalogProduct } from './types';\n\nexport const csvCatalog: CatalogProduct[] = ${JSON.stringify(catalog)};\n\nexport const csvCatalogAudit = { sourceRows: ${rows.length}, publishedProducts: ${catalog.length}, duplicateRowsMerged: ${rows.length - catalog.length}, pricedProducts: ${pricedProducts}, unpricedProducts: ${catalog.length - pricedProducts}, enrichedProducts: ${enrichedProducts} } as const;\n`;
await writeFile(outputPath, output, 'utf8');
console.log(JSON.stringify({ sourceRows: rows.length, publishedProducts: catalog.length, duplicateRowsMerged: rows.length - catalog.length, pricedProducts, enrichedProducts }));
