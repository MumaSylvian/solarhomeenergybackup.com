import type { ImportedProduct } from './types';

export function watts(value?: number | null) { return value == null ? null : Math.round(value); }
export function kilowattHoursToWh(value?: number | null) { return value == null ? null : Math.round(value * 1000); }
export function normalizedModel(value: string) { return value.toUpperCase().replace(/[^A-Z0-9]/g, ''); }

/** Stable duplicate key used before products enter the review queue. */
export function duplicateKey(product: Pick<ImportedProduct, 'brand' | 'model' | 'sku'>) {
  return [product.brand, normalizedModel(product.model), product.sku ?? ''].join(':').toLowerCase();
}
