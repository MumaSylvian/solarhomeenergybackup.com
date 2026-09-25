import { approvedCatalog } from './products';
import { isInStock } from './offer';
import type { CatalogProduct } from './types';

/**
 * The browser-side shop only needs enough of each product to render a card
 * and apply the filters. Sending this slim record instead of the full catalog
 * (specifications, supplier offers, full galleries) keeps the shop payload
 * small; full details load on each product's own static page.
 */
export type ShopItem = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: CatalogProduct['category'];
  shortDescription: string;
  sourcePrice: number | null;
  retailPrice: number | null;
  imageUrl: string | null;
  /** One backup image in case the primary fails to load. */
  fallbackImageUrl: string | null;
  continuousOutputWatts: number | null;
  batteryCapacityWh: number | null;
  acVoltage: string | null;
  wholeHomeCapable: boolean;
  /** Supplier-confirmed stock; see lib/catalog/offer.ts. */
  inStock: boolean;
  /** Lower-cased name, brand, category, model and SKU for search. */
  searchText: string;
};

// Cards clamp the summary to three lines, so longer text is never shown.
const summaryLimit = 180;

const clamp = (text: string) =>
  text.length > summaryLimit
    ? `${text.slice(0, summaryLimit).replace(/\s+\S*$/, '')}…`
    : text;

export function toShopItem(product: CatalogProduct): ShopItem {
  const [primary = null, backup = null] = product.galleryImageUrls ?? [];
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    category: product.category,
    shortDescription: clamp(product.shortDescription ?? ''),
    sourcePrice: product.sourcePrice ?? null,
    retailPrice: product.retailPrice ?? null,
    imageUrl: product.sourceImageUrl ?? primary,
    fallbackImageUrl: backup,
    continuousOutputWatts: product.continuousOutputWatts ?? null,
    batteryCapacityWh: product.batteryCapacityWh ?? null,
    acVoltage: product.acVoltage ?? null,
    wholeHomeCapable: product.wholeHomeCapable,
    inStock: isInStock(product),
    searchText:
      `${product.name} ${product.brand} ${product.category} ${product.model} ${product.sku ?? ''}`.toLowerCase(),
  };
}

export const shopIndex: ShopItem[] = approvedCatalog.map(toShopItem);
