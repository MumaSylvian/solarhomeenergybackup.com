import type { CatalogProduct } from './types';

type Category = CatalogProduct['category'];

/**
 * Corrects store categories the importer assigned from supplier breadcrumbs
 * (for example, power station bundles filed under "Solar panels"). Rules look
 * only at what the product title says the item is. Appliance categories are
 * never changed.
 */
const appliances = new Set<Category>(['Dishwashers', 'Freezers', 'Refrigerators', 'Washers & Dryers']);

const rules: [RegExp, Category][] = [
  // Parts made *for* a product (pads, covers, brackets) are accessories.
  [/\bmounting pad\b|\bcover\b|\bbracket\b/i, 'Accessories'],
  // A power station, alone or bundled with panels/batteries, is portable power.
  [/portable power station|solar generator|\bpower station\b/i, 'Portable power'],
  // Inverter/chargers and standby generators are whole-home backup, even when
  // the title also mentions a built-in transfer switch.
  [/multiplus|quattro|inverter[/ -]charger|hybrid inverter|standby generator/i, 'Whole-home backup'],
  // Coolers, air conditioners, and speakers are accessories to a power system.
  [/\bcooler\b|air conditioner|\bspeaker\b/i, 'Accessories'],
];

/** Single-item listings (no "+" bundle) whose title names the item type. */
const singleItemRules: [RegExp, Category][] = [
  [/expansion battery|\blifepo4 battery\b|server rack battery/i, 'Batteries'],
  [/transfer switch|smart home panel|power inlet box/i, 'Home integration'],
  [/\bev charger\b|level 2 charger/i, 'EV chargers'],
  [/\bsolar panels?\b/i, 'Solar panels'],
];

export function categoryFor(product: Pick<CatalogProduct, 'name' | 'category'>): Category {
  if (appliances.has(product.category)) return product.category;
  for (const [pattern, category] of rules) if (pattern.test(product.name)) return category;
  if (!product.name.includes('+')) {
    for (const [pattern, category] of singleItemRules) if (pattern.test(product.name)) return category;
  }
  return product.category;
}

export function correctCategory<T extends CatalogProduct>(product: T): T {
  const category = categoryFor(product);
  if (category === product.category) return product;
  return { ...product, category, specifications: { ...product.specifications, Category: category } };
}
