import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

/**
 * Runs after `vinext build`. Product cards were loading full-size original
 * photos (often 150–250 KB PNGs, 13 MB for one category page) to show them
 * a few hundred pixels wide. This writes display-sized WebP copies next to
 * the build output:
 *
 *   dist/client/media/w480/<name>.webp   product cards
 *   dist/client/media/w1000/<name>.webp  the main photo on product pages
 *
 * for every photo in media/catalog/ and media/products/. The originals are
 * not touched and still open in the full-size viewer. lib/image-sizes.ts
 * maps a photo URL to these copies.
 */
const dist = new URL('../dist/client/media/', import.meta.url);
const sources = ['catalog/', 'products/'];
const sizes = [480, 1000];

if (!fs.existsSync(dist)) {
  console.log('No built media folder; skipping image sizes.');
  process.exit(0);
}
for (const width of sizes) fs.mkdirSync(new URL(`w${width}/`, dist), { recursive: true });

const files = sources.flatMap((folder) =>
  fs.existsSync(new URL(folder, dist))
    ? fs
        .readdirSync(new URL(folder, dist))
        .filter((file) => /\.(jpe?g|png|webp)$/i.test(file))
        .map((file) => ({ folder, file }))
    : [],
);

let made = 0;
let failed = 0;
const queue = [...files];
async function worker() {
  while (queue.length) {
    const { folder, file } = queue.shift();
    const base = file.replace(/\.[^.]+$/, '');
    try {
      const input = fs.readFileSync(new URL(`${folder}${file}`, dist));
      for (const width of sizes) {
        const out = new URL(`w${width}/${base}.webp`, dist);
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
      console.warn(`could not resize ${folder}${file}: ${error.message}`);
    }
  }
}
await Promise.all(Array.from({ length: 6 }, worker));
console.log(`Image sizes: ${made} written for ${files.length} photos; ${failed} failed.`);
