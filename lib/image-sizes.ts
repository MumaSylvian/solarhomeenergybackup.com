/**
 * Display-sized WebP copies of product photos:
 *   /media/catalog/x.png, /media/products/x.jpg, and GitHub LFS gallery
 *   photos (…/public/catalog/x.jpg)  ->  /media/w480/x.webp, /media/w1000/x.webp
 * Self-hosted photos are sized after each build (scripts/make-image-sizes.mjs);
 * LFS gallery photos are sized locally and committed
 * (scripts/make-gallery-sizes.mjs). Any other URL is returned unchanged.
 * Callers keep the original as a fallback in case a sized copy is missing.
 */
export type ImageWidth = 480 | 1000;

const sizable =
  /^(?:\/media\/(?:catalog|products)\/|https:\/\/media\.githubusercontent\.com\/media\/MumaSylvian\/solarhomeenergybackup\.com\/main\/public\/catalog\/)([^/]+)\.(?:jpe?g|png|webp)$/i;

export function sizedImage(url: string | null | undefined, width: ImageWidth): string | null {
  if (!url) return null;
  const match = url.match(sizable);
  return match ? `/media/w${width}/${match[1]}.webp` : url;
}
