import { csvCatalog } from './catalog.generated';

/** The user-supplied CSV is the catalog source of truth. */
export const catalog = csvCatalog;

/** One storefront product per normalized model; alternate suppliers remain supplier offers. */
export const uniqueCatalog = catalog.filter((product, index, products) => products.findIndex((candidate) =>
  `${candidate.brand}:${candidate.model}`.replace(/[^a-z0-9]/gi, '').toLowerCase() === `${product.brand}:${product.model}`.replace(/[^a-z0-9]/gi, '').toLowerCase(),
) === index);

export const approvedCatalog = uniqueCatalog.filter((product) => product.status === 'APPROVED');
export const bySlug = (slug: string) => approvedCatalog.find((product) => product.slug === slug);
