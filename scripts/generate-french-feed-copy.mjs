import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const catalogFile = path.join(root, 'lib', 'catalog', 'catalog.generated.ts');
const outputFile = path.join(root, 'lib', 'catalog', 'french-feed-copy.generated.json');
const source = await fs.readFile(catalogFile, 'utf8');
const start = source.indexOf('= [');
const end = source.lastIndexOf('];');
if (start < 0 || end < 0) throw new Error('Could not locate generated catalog JSON');
const catalog = JSON.parse(source.slice(start + 2, end + 1));
const existing = JSON.parse(await fs.readFile(outputFile, 'utf8').catch(() => '{}'));
const products = catalog.filter((p) => p?.slug && p?.name);
const pending = products.filter((p) => !existing[p.slug] || existing[p.slug].sourceName !== p.name || existing[p.slug].sourceDescription !== (p.shortDescription || ''));

const translate = async (text) => {
  const value = String(text || '').trim();
  if (!value) return '';
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fr&dt=t&q=${encodeURIComponent(value.slice(0, 4800))}`;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const translated = Array.isArray(data?.[0]) ? data[0].map((part) => part?.[0] || '').join('') : '';
      if (translated) return translated;
    } catch (error) {
      if (attempt === 3) throw error;
      await new Promise((resolve) => setTimeout(resolve, 700 * (attempt + 1)));
    }
  }
  return value;
};

let cursor = 0;
const worker = async () => {
  while (true) {
    const index = cursor++;
    if (index >= pending.length) return;
    const product = pending[index];
    // Keep the request small and deterministic. Merchant descriptions use the
    // verified short product summary; the landing page retains the full specs.
    const [name, description] = await Promise.all([
      translate(product.name),
      translate(product.shortDescription || product.name),
    ]);
    existing[product.slug] = {
      sourceName: product.name,
      sourceDescription: product.shortDescription || '',
      name,
      description,
    };
    if ((index + 1) % 25 === 0 || index === pending.length - 1) {
      await fs.writeFile(outputFile, `${JSON.stringify(existing, null, 2)}\n`);
      console.log(`French feed copy: ${index + 1}/${pending.length}`);
    }
  }
};
await Promise.all(Array.from({ length: 6 }, worker));
await fs.writeFile(outputFile, `${JSON.stringify(existing, null, 2)}\n`);
console.log(`French feed copy ready: ${Object.keys(existing).length} products`);
