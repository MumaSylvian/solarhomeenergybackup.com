import { productCopy } from './product-copy.generated';

/**
 * Product copy written for SolarHome Energy Backup from each product's
 * verified facts (see scripts/merge-product-copy.mjs). Products without an
 * entry fall back to the overview in lib/catalog/overview.ts.
 */
export type ProductCopy = {
  intro: string;
  benefits: string[];
  features: string[];
  idealUse: string;
  included: string[];
  cta: string;
};

/** Keyed by the product's public id. */
export const copyFor = (id: string): ProductCopy | undefined => productCopy[id];
