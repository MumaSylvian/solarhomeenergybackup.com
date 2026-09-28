import { approvedCatalog } from '@/lib/catalog/products';
import { isInStock } from '@/lib/catalog/offer';
import { copyFor } from '@/lib/catalog/product-copy';
import type { CatalogProduct } from '@/lib/catalog/types';

/** The planning hub: the other guides point back to it, and it lists them all. */
export const HUB_GUIDE_SLUG = 'how-to-size-a-home-battery-backup';

type Rule = { category: CatalogProduct['category']; match: RegExp; count: number; exclude?: RegExp };

/** Multi-packs and bundles ("2× …", "… + …") muddy a single-product example. */
const bundle = /^\s*\d+\s*[×x]|\+/i;
/** Roughly 1–2.6 kWh, the station size range the refrigerator guide works through. */
const midCapacity = /\b(1,?\d{3}|2,?[0-5]\d{2})\s?wh\b/i;

/**
 * Products shown under each guide, chosen by rules rather than fixed IDs so
 * the picks survive catalog changes. Each rule takes in-stock, priced
 * products with written copy, one per brand, so a guide never shows four
 * near-identical items.
 */
const guideRules: Record<string, Rule[]> = {
  'how-to-size-a-home-battery-backup': [
    { category: 'Batteries', match: /lifepo4|\blfp\b/i, exclude: bundle, count: 2 },
    { category: 'Whole-home backup', match: /power kit|hybrid|all-in-one|inverter/i, exclude: /generator|gas|propane/i, count: 2 },
  ],
  'portable-power-station-vs-gas-generator': [
    { category: 'Portable power', match: /power station/i, exclude: bundle, count: 3 },
    { category: 'Portable power', match: /inverter generator|dual fuel/i, count: 1 },
  ],
  'how-long-will-a-power-station-run-a-refrigerator': [
    { category: 'Portable power', match: midCapacity, exclude: bundle, count: 4 },
  ],
  'charge-a-power-station-with-solar-panels': [
    { category: 'Solar panels', match: /portable/i, exclude: bundle, count: 2 },
    { category: 'Portable power', match: /power station/i, exclude: bundle, count: 2 },
  ],
  'lifepo4-vs-nmc-batteries-for-backup-power': [
    { category: 'Batteries', match: /lifepo4|\blfp\b/i, exclude: bundle, count: 4 },
  ],
};

export function productsForGuide(slug: string): CatalogProduct[] {
  const picked: CatalogProduct[] = [];
  const brands = new Set<string>();
  for (const rule of guideRules[slug] ?? []) {
    const candidates = approvedCatalog
      .filter(
        (product) =>
          product.category === rule.category &&
          rule.match.test(product.name) &&
          !rule.exclude?.test(product.name) &&
          product.retailPrice != null &&
          copyFor(product.id) &&
          isInStock(product),
      )
      .sort((left, right) => left.brand.localeCompare(right.brand) || left.name.localeCompare(right.name));
    let taken = 0;
    for (const product of candidates) {
      if (taken === rule.count) break;
      if (brands.has(product.brand)) continue;
      brands.add(product.brand);
      picked.push(product);
      taken++;
    }
  }
  return picked;
}
