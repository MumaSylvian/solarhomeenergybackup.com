import type { CatalogProduct } from './types';

/**
 * One source of truth for the condition and availability a product may claim.
 * Product pages, cards, JSON-LD, and the Merchant Center feed all read from
 * here so they cannot contradict each other.
 */

export type Condition = 'new' | 'refurbished' | 'used';

/** Condition from the supplied title/description; never a hardcoded "new". */
export function conditionOf(product: Pick<CatalogProduct, 'name' | 'shortDescription'>): Condition {
  const text = `${product.name} ${product.shortDescription ?? ''}`;
  if (/\b(refurbished|renewed|reconditioned|certified pre-?owned)\b/i.test(text)) return 'refurbished';
  if (/\b(used|pre-?owned|open[- ]box)\b/i.test(text)) return 'used';
  return 'new';
}

/**
 * Only the supplier's own "in stock" status supports an in-stock claim.
 * Anything else (including UNKNOWN) must not be shown or submitted as in stock.
 */
export function isInStock(product: Pick<CatalogProduct, 'supplierOffers'>) {
  return product.supplierOffers?.some((offer) => offer.availability === 'IN_STOCK') ?? false;
}

export const schemaCondition: Record<Condition, string> = {
  new: 'https://schema.org/NewCondition',
  refurbished: 'https://schema.org/RefurbishedCondition',
  used: 'https://schema.org/UsedCondition',
};
