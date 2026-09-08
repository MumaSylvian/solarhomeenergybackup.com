import type { CatalogProduct, SupplierOffer } from '@/lib/catalog/types';

export type SupplierName = SupplierOffer['supplier'];
export type ImportedProduct = Omit<CatalogProduct, 'id' | 'slug' | 'status' | 'supplierOffers'> & { sourceOffer: SupplierOffer };
export interface SupplierAdapter {
  name: SupplierName;
  importPublicCatalog(): Promise<ImportedProduct[]>;
}
