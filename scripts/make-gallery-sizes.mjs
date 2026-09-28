import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

/**
 * Gallery photos kept in Git LFS (public/catalog/) are served from GitHub's
 * LFS media, which is slow and bandwidth-capped. Vercel builds only see LFS
 * pointer files, so their display-sized copies are made here, locally, and
 * committed:
 *
 *   public/media/w480/<name>.webp, public/media/w1000/<name>.webp
 *
 * Run locally after adding gallery photos:  node scripts/make-gallery-sizes.mjs
 * Photos already copied to public/media/catalog/ are sized at build time by
 * scripts/make-image-sizes.mjs instead. Originals are not touched.
 */
const root = new URL('../', import.meta.url);
const source = new URL('public/catalog/', root);
const copied = new Set(fs.existsSync(new URL('public/media/catalog/', root)) ? fs.readdirSync(new URL('public/media/catalog/', root)) : []);
const sizes = [480, 1000];
for (const width of sizes) fs.mkdirSync(new URL(`public/media/w${width}/`, root), { recursive: true });

const files = fs
  .readdirSync(source)
  .filter((file) => /\.(jpe?g|png|webp)$/i.test(file) && !copied.has(file));

let made = 0;
let skipped = 0;
let failed = 0;
const queue = [...files];
async function worker() {
  while (queue.length) {
    const file = queue.shift();
    const from = new URL(file, source);
    // LFS pointer (not checked out): nothing to resize locally.
    if (fs.statSync(from).size < 1000) {
      skipped++;
      continue;
    }
    const base = file.replace(/\.[^.]+$/, '');
    try {
      const input = fs.readFileSync(from);
      for (const width of sizes) {
        const out = new URL(`public/media/w${width}/${base}.webp`, root);
        if (fs.existsSync(out)) continue;
        await sharp(input)
          .rotate()
          .resize({ width, height: width, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 78, effort: 4 })
          .toFile(fileURLToPath(out));
        made++;
      }
    } catch (error) {
      failed++;
      console.warn(`could not resize ${file}: ${error.message}`);
    }
  }
}
await Promise.all(Array.from({ length: 6 }, worker));
console.log(`Gallery sizes: ${made} written for ${files.length} LFS photos; ${skipped} not checked out; ${failed} failed.`);
