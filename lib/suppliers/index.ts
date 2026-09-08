import type { SupplierAdapter } from './types';

/**
 * Importers are deliberately source-safe: adapters may fetch only public URLs,
 * return null for unavailable fields, and leave all results pending review.
 */
export async function importFrom(adapter: SupplierAdapter) {
  try {
    return { supplier: adapter.name, products: await adapter.importPublicCatalog(), error: null };
  } catch (error) {
    return { supplier: adapter.name, products: [], error: error instanceof Error ? error.message : 'Unknown import error' };
  }
}
