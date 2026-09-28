import { approvedCatalog } from '@/lib/catalog/products';
import { CATEGORY_PAGE_SIZE, storefrontCategories } from '@/lib/catalog/categories';
import type { CatalogProduct } from '@/lib/catalog/types';

/**
 * Brand pages at /brands/{slug}. Only brands with enough products get a page;
 * a page listing one or two items adds nothing for shoppers or search. All
 * brands still appear on /brands. Server-only: reads the full catalog.
 */
export const MIN_BRAND_PRODUCTS = 8;

export const brandSlug = (brand: string) =>
  brand
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const categoryRank = (label: string) => {
  const rank = storefrontCategories.findIndex((category) => category.label === label);
  return rank === -1 ? storefrontCategories.length : rank;
};

export type BrandSummary = {
  name: string;
  slug: string;
  href: string | null;
  count: number;
  /** Categories this brand appears in, in menu order, with product counts. */
  categories: { label: string; href: string; count: number }[];
};

const byBrand = new Map<string, CatalogProduct[]>();
for (const product of approvedCatalog) {
  if (!product.brand) continue;
  byBrand.set(product.brand, [...(byBrand.get(product.brand) ?? []), product]);
}

export const brands: BrandSummary[] = [...byBrand]
  .map(([name, products]) => {
    const counts = new Map<string, number>();
    for (const product of products) counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
    const slug = brandSlug(name);
    return {
      name,
      slug,
      href: products.length >= MIN_BRAND_PRODUCTS ? `/brands/${slug}` : null,
      count: products.length,
      categories: [...counts]
        .sort(([left], [right]) => categoryRank(left) - categoryRank(right))
        .map(([label, count]) => ({
          label,
          href: storefrontCategories.find((category) => category.label === label)?.href ?? '/shop',
          count,
        })),
    };
  })
  .sort((left, right) => left.name.localeCompare(right.name, 'en', { sensitivity: 'base' }));

export const brandPages = brands.filter((brand) => brand.href);
export const brandBySlug = (slug: string) => brandPages.find((brand) => brand.slug === slug);
/** Brand page URL for a product's brand, or null if the brand has no page. */
export const brandHrefFor = (name: string) => brands.find((brand) => brand.name === name)?.href ?? null;

/** A brand's products in browse order: category menu order, then name. */
export const productsForBrand = (name: string) =>
  (byBrand.get(name) ?? []).slice().sort(
    (left, right) => categoryRank(left.category) - categoryRank(right.category) || left.name.localeCompare(right.name),
  );

export const brandPageCount = (name: string) =>
  Math.max(1, Math.ceil((byBrand.get(name)?.length ?? 0) / CATEGORY_PAGE_SIZE));

export const brandPageHref = (brand: BrandSummary, page: number) =>
  page <= 1 ? `/brands/${brand.slug}` : `/brands/${brand.slug}/page/${page}`;

/** Brands with pages that have products in a category, largest first. */
export const topBrandsInCategory = (label: string, limit = 12) =>
  brandPages
    .map((brand) => ({ brand, count: brand.categories.find((category) => category.label === label)?.count ?? 0 }))
    .filter((entry) => entry.count > 0)
    .sort((left, right) => right.count - left.count)
    .slice(0, limit);
