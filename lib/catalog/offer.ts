import type { CatalogProduct } from './types';
import { warehouseStock } from './warehouse-stock';

/**
 * One source of truth for the condition and availability a product may claim.
 * Product pages, cards, JSON-LD, and the Merchant Center feed all read from
 * here so they cannot contradict each other.
 */

export type Condition = 'new' | 'refurbished' | 'used';

/**
 * Condition from the product title, where the supplier states it
 * ("(Refurbished)", "Used", "Open Box"); never a hardcoded "new". Descriptions
 * are not used: ordinary phrases such as "can be used with" would mark new
 * items as used.
 */
export function conditionOf(product: Pick<CatalogProduct, 'name' | 'shortDescription'>): Condition {
  if (/\b(refurbished|renewed|reconditioned|certified pre-?owned)\b/i.test(product.name)) return 'refurbished';
  if (/\((?:used|pre-?owned|open[- ]box)\)|\b(?:pre-?owned|open[- ]box)\b|^used\b/i.test(product.name)) return 'used';
  return 'new';
}

type StockInput = Pick<CatalogProduct, 'supplierOffers' | 'sku' | 'model'>;

/**
 * Where an in-stock claim comes from:
 *  - 'warehouse': listed with quantity > 0 in lib/catalog/warehouse-stock.ts
 *  - 'supplier':  the supplier's own status is IN_STOCK
 *  - null:        not confirmed; must not be shown or submitted as in stock
 */
export function stockSource(product: StockInput): 'warehouse' | 'supplier' | null {
  const sku = product.sku ?? product.model;
  if (sku && (warehouseStock[sku] ?? 0) > 0) return 'warehouse';
  if (product.supplierOffers?.some((offer) => offer.availability === 'IN_STOCK')) return 'supplier';
  return null;
}

export function isInStock(product: StockInput) {
  return stockSource(product) !== null;
}

export const schemaCondition: Record<Condition, string> = {
  new: 'https://schema.org/NewCondition',
  refurbished: 'https://schema.org/RefurbishedCondition',
  used: 'https://schema.org/UsedCondition',
};
