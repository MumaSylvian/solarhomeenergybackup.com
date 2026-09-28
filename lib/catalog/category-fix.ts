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

/**
 * Listings reviewed by hand on 2026-09-28 whose title the rules above cannot
 * place (short model-code titles, or a supplier breadcrumb that is simply
 * wrong). Checked before the rules.
 */
const reviewed: Record<string, Category> = {
  // Tools, hose reels, HVAC line sets, pest barriers, film, surge protection,
  // soft starters, racks, adapters, cables, shelters: accessories.
  ...Object.fromEntries(
    [
      'catalog-395', 'catalog-396', 'catalog-397', 'catalog-400', 'catalog-401', 'catalog-216', 'catalog-75',
      'catalog-186', 'catalog-492', 'catalog-91', 'catalog-92', 'catalog-94', 'catalog-95', 'catalog-99',
      'catalog-96', 'catalog-89', 'catalog-908', 'catalog-909', 'catalog-861', 'catalog-179', 'catalog-181',
      'catalog-182', 'catalog-183', 'catalog-292', 'catalog-70', 'catalog-71', 'catalog-621', 'catalog-10',
      'catalog-108', 'catalog-910', 'catalog-469', 'catalog-154', 'catalog-229', 'catalog-230', 'catalog-222',
      'catalog-223', 'catalog-240', 'catalog-241', 'catalog-64', 'catalog-66', 'catalog-67', 'catalog-84',
    ].map((id) => [id, 'Accessories' as Category]),
  ),
  // Portable generators, station bundles, and power banks: portable power.
  ...Object.fromEntries(
    [
      'catalog-274', 'catalog-276', 'catalog-273', 'catalog-275', 'catalog-277', 'catalog-49', 'catalog-522',
      'catalog-866', 'catalog-873', 'catalog-878', 'catalog-911', 'catalog-879', 'catalog-912', 'catalog-913',
      'catalog-914', 'catalog-880', 'catalog-882', 'catalog-883', 'catalog-885', 'catalog-886', 'catalog-887',
      'catalog-888', 'catalog-889', 'catalog-890', 'catalog-865', 'catalog-884', 'catalog-756', 'catalog-775',
      'catalog-776', 'catalog-779', 'catalog-844', 'catalog-603', 'catalog-559', 'catalog-416', 'catalog-417',
      'catalog-426', 'catalog-484', 'catalog-485', 'catalog-412', 'catalog-502', 'catalog-654', 'catalog-561',
    ].map((id) => [id, 'Portable power' as Category]),
  ),
  // Battery modules, walls, and extra batteries.
  ...Object.fromEntries(
    ['catalog-420', 'catalog-463', 'catalog-341', 'catalog-77', 'catalog-21', 'catalog-22', 'catalog-155', 'catalog-156', 'catalog-165', 'catalog-350'].map(
      (id) => [id, 'Batteries' as Category],
    ),
  ),
  // Inverters and whole-home kits.
  ...Object.fromEntries(
    [
      'catalog-460', 'catalog-471', 'catalog-564', 'catalog-550', 'catalog-478', 'catalog-545', 'catalog-571',
      'catalog-78', 'catalog-289', 'catalog-124', 'catalog-125', 'catalog-389', 'catalog-242', 'catalog-243',
      'catalog-244', 'catalog-376', 'catalog-390', 'catalog-722', 'catalog-268', 'catalog-340', 'catalog-81',
      'catalog-290', 'catalog-293', 'catalog-306', 'catalog-307', 'catalog-361', 'catalog-362', 'catalog-192',
      'catalog-193', 'catalog-194', 'catalog-195', 'catalog-557', 'catalog-152', 'catalog-660', 'catalog-497',
      'catalog-544',
    ].map((id) => [id, 'Whole-home backup' as Category]),
  ),
  // Monitoring, gateways, controllers, distribution, load centers, transformers.
  ...Object.fromEntries(
    [
      'catalog-219', 'catalog-227', 'catalog-221', 'catalog-375', 'catalog-231', 'catalog-232', 'catalog-110',
      'catalog-111', 'catalog-109', 'catalog-30', 'catalog-280', 'catalog-891', 'catalog-892', 'catalog-893',
      'catalog-895', 'catalog-500', 'catalog-894', 'catalog-476', 'catalog-479', 'catalog-549', 'catalog-670',
      'catalog-97', 'catalog-100', 'catalog-258', 'catalog-127', 'catalog-160', 'catalog-162', 'catalog-364',
    ].map((id) => [id, 'Home integration' as Category]),
  ),
  // Charge controllers, microinverters, and solar thermal: solar equipment.
  ...Object.fromEntries(
    [
      'catalog-76', 'catalog-131', 'catalog-157', 'catalog-158', 'catalog-251', 'catalog-252', 'catalog-114',
      'catalog-116', 'catalog-115', 'catalog-528', 'catalog-196', 'catalog-197', 'catalog-554',
    ].map((id) => [id, 'Solar panels' as Category]),
  ),
};

export function categoryFor(product: Pick<CatalogProduct, 'id' | 'name' | 'category'>): Category {
  const reviewedCategory = reviewed[product.id];
  if (reviewedCategory) return reviewedCategory;
  // Undercounter drawer freezers were filed under refrigerators.
  if (product.category === 'Refrigerators' && /\bdrawer freezer\b/i.test(product.name)) return 'Freezers';
  if (appliances.has(product.category)) return product.category;
  // Portable 12V fridges (GLACIER, MultiCooler) sit with the other coolers.
  if (/portable (refrigerator|fridge)/i.test(product.name)) return 'Accessories';
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
