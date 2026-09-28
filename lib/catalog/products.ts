import { csvCatalog } from './catalog.generated';
import { WARRANTY_TERM, discountedPriceFor } from '@/lib/commerce';
import { correctRatings } from './spec-fix';
import { cleanProductContent } from './content-clean';
import { correctCategory } from './category-fix';
import { selfHostedImages } from './self-hosted-images.generated';
import { selfHostedCatalogImages } from './self-hosted-catalog.generated';

/**
 * Product photos are stored in Git LFS. The connected Vercel deployment
 * currently serves LFS pointer files from /public/catalog rather than the
 * original binary images, so those paths decode as broken images in browsers.
 * GitHub's media endpoint serves the corresponding LFS binaries directly.
 */
const catalogMediaBaseUrl =
  'https://media.githubusercontent.com/media/MumaSylvian/solarhomeenergybackup.com/main/public/catalog/';

/**
 * Primary photos that were hotlinked from a supplier CDN are served from this
 * domain (public/media/products/, outside Git LFS). Same photos; see
 * scripts/self-host-primary-images.mjs. Gallery images keep their URLs.
 */
const resolveCatalogImageUrl = (imageUrl: string | null | undefined) =>
  imageUrl?.startsWith('/catalog/')
    ? // Primary photos are copied to public/media/catalog/ (served by Vercel);
      // other LFS photos come from GitHub's LFS media endpoint.
      selfHostedCatalogImages.has(imageUrl.slice('/catalog/'.length))
      ? `/media/catalog/${imageUrl.slice('/catalog/'.length)}`
      : `${catalogMediaBaseUrl}${imageUrl.slice('/catalog/'.length)}`
    : imageUrl && selfHostedImages[imageUrl]
      ? `/media/products/${selfHostedImages[imageUrl]}`
      : (imageUrl ?? null);

/**
 * Owner-confirmed on 2026-09-27: the listings the supplier titled
 * "(Refurbished)" are new, sealed units. The tag is dropped, so conditionOf()
 * reads them as new. Removing this and other title tags (see content-clean.ts)
 * can leave two listings with the same name; those are merged below.
 */
const refurbishedTag = /\s*\((?:refurbished|renewed|reconditioned)\)/i;
const relabelAsNew = <
  T extends { name: string; slug: string; shortDescription: string; rawSpecifications: string },
>(
  product: T,
): T => {
  if (!refurbishedTag.test(product.name)) return product;
  // The manufacturer text repeats the supplier title, e.g. "EcoFlow DELTA (Refurbished) can…".
  const untag = (text: string) => text.replace(new RegExp(refurbishedTag.source, 'gi'), '');
  return {
    ...product,
    name: product.name.replace(refurbishedTag, '').replace(/\*(\d+)$/, ' (Pack of $1)').trim(),
    slug: product.slug.replace(/-refurbished(?=-)/, ''),
    shortDescription: untag(product.shortDescription),
    rawSpecifications: untag(product.rawSpecifications),
  };
};

/** The catalog is generated from the product archives supplied for SolarHome Energy Backup. */
/**
 * A small number of supplied primary PNGs contain only a thin slice of the
 * product on an otherwise empty canvas.  These replacements point to a clear
 * image from the same supplied product gallery; no retailer-hosted imagery is
 * introduced here.
 */
const clearGalleryPrimary: Record<string, string> = {
  'catalog-457': '/catalog/catalog-457-2.webp',
  'catalog-587': '/catalog/catalog-587-2.png',
  'catalog-602': '/catalog/catalog-602-2.png',
  'catalog-606': '/catalog/catalog-606-4.png',
  'catalog-643': '/catalog/catalog-643-2.png',
  'catalog-675': '/catalog/catalog-675-2.png',
  'catalog-711': '/catalog/catalog-711-3.png',
};

/**
 * Products without a usable supplied product frame are held out of the
 * storefront. This includes sparse frames, unreadable/mislabeled files,
 * images below 600px on the short edge, and excessively compressed primaries.
 * It keeps the catalog from enlarging soft thumbnails into product cards.
 */
const unusablePrimaryImageIds = new Set([
  'catalog-2',
  'catalog-3',
  'catalog-6',
  'catalog-25',
  'catalog-28',
  'catalog-38',
  'catalog-46',
  'catalog-47',
  'catalog-61',
  'catalog-62',
  'catalog-63',
  'catalog-65',
  'catalog-88',
  'catalog-107',
  'catalog-113',
  'catalog-117',
  'catalog-121',
  'catalog-122',
  'catalog-123',
  'catalog-126',
  'catalog-128',
  'catalog-129',
  'catalog-130',
  'catalog-132',
  'catalog-133',
  'catalog-134',
  'catalog-142',
  'catalog-143',
  'catalog-147',
  'catalog-148',
  'catalog-151',
  'catalog-153',
  'catalog-164',
  'catalog-168',
  'catalog-170',
  'catalog-172',
  'catalog-174',
  'catalog-180',
  'catalog-191',
  'catalog-206',
  'catalog-217',
  'catalog-218',
  'catalog-225',
  'catalog-235',
  'catalog-236',
  'catalog-237',
  'catalog-247',
  'catalog-248',
  'catalog-301',
  'catalog-418',
  'catalog-585',
  'catalog-622',
  'catalog-599',
  'catalog-600',
  'catalog-635',
  'catalog-657',
  'catalog-674',
  'catalog-691',
  'catalog-694',
  'catalog-719',
  'catalog-755',
  'catalog-777',
  'catalog-780',
  'catalog-788',
  'catalog-808',
  'catalog-809',
  'catalog-812',
  'catalog-832',
  'catalog-840',
  'catalog-859',
  'catalog-394',
  'catalog-399',
  'catalog-472',
  'catalog-475',
  'catalog-526',
  'catalog-541',
  'catalog-586',
  'catalog-587',
  'catalog-590',
  'catalog-595',
  'catalog-598',
  'catalog-605',
  'catalog-610',
  'catalog-612',
  'catalog-625',
  'catalog-626',
  'catalog-627',
  'catalog-628',
  'catalog-629',
  'catalog-631',
  'catalog-632',
  'catalog-633',
  'catalog-649',
  'catalog-651',
  'catalog-652',
  'catalog-659',
  'catalog-675',
  'catalog-698',
  'catalog-711',
  'catalog-858',
  'catalog-881',
]);

/**
 * Supplied records with bad data that should not be sold until corrected:
 * catalog-724 is a Bluetooth speaker filed under Portable power at a
 * $9,999,999.99 placeholder price. The installation-service listings are
 * services performed by the manufacturer's own certified partners, which this
 * store cannot sell or fulfil.
 */
const excludedProductIds = new Set([
  'catalog-724',
  'catalog-548', // Turnkey Installation Service
  'catalog-585', // 2x F3800 Plus + Smart Home Power Kit + Installation Service
  'catalog-655', // F3800 Plus + Smart Home Power Kit + Installation Service
  'catalog-721', // Power Dock Installation Service
  'catalog-723', // Smart Inlet Box Installation Service
]);

export const catalog = csvCatalog
  .filter(
    (product) =>
      !unusablePrimaryImageIds.has(product.id) &&
      !excludedProductIds.has(product.id),
  )
  // Repair importer rating errors before anything reads the specs.
  .map(correctRatings)
  // Remove other businesses' names, contacts, promotions, and policies.
  .map(cleanProductContent)
  .map(relabelAsNew)
  // Fix categories the importer took from supplier breadcrumbs.
  .map(correctCategory)
  .map((product) => {
    const primaryImage = resolveCatalogImageUrl(
      clearGalleryPrimary[product.id] ??
        product.sourceImageUrl ??
        product.sourceDetailImageUrl,
    );
    const galleryImages = [
      ...new Set(
        [
          primaryImage,
          ...(product.galleryImageUrls ?? []).map(resolveCatalogImageUrl),
        ].filter((image): image is string => Boolean(image)),
      ),
    ];

    /** Keep the supplied, product-specific gallery together with its clear primary image. */
    return {
      ...product,
      retailPrice:
        discountedPriceFor(product.sourcePrice) ?? product.retailPrice,
      sourceImageUrl: primaryImage,
      sourceDetailImageUrl: primaryImage,
      galleryImageUrls: galleryImages,
    };
  });

/**
 * Listings whose title lost a tag (refurbished, retailer, channel, freebie)
 * may now share a name with another listing of the same product. Each such
 * group becomes one listing: the untagged one if it exists, at the group's
 * lowest price, so one new item is never offered at two prices. Groups where
 * no title changed are left alone (appliances can share a title across
 * distinct models). Old URLs redirect in vercel.json.
 */
const sourceName = new Map(csvCatalog.map((product) => [product.id, product.name]));
const wasRetitled = (product: { id: string; name: string }) => sourceName.get(product.id) !== product.name;
const listingKey = (product: { brand: string; name: string }) =>
  `${product.brand}|${product.name}`.toLowerCase();
const sameNameGroups = new Map<string, (typeof catalog)[number][]>();
for (const product of catalog) {
  const group = sameNameGroups.get(listingKey(product)) ?? [];
  group.push(product);
  sameNameGroups.set(listingKey(product), group);
}
/** Kept listing id → lowest-priced member of its merged group. */
const mergedPrice = new Map<string, (typeof catalog)[number]>();
const mergedAway = new Map<string, string>(); // removed slug → kept slug
for (const group of sameNameGroups.values()) {
  if (group.length < 2 || !group.some(wasRetitled)) continue;
  const kept = group.find((product) => !wasRetitled(product)) ?? group[0];
  const cheapest = group
    .filter((product) => product.retailPrice != null)
    .reduce<(typeof catalog)[number] | undefined>(
      (best, product) => (!best || product.retailPrice! < best.retailPrice! ? product : best),
      undefined,
    );
  if (cheapest) mergedPrice.set(kept.id, cheapest);
  for (const product of group) if (product !== kept) mergedAway.set(product.slug, kept.slug);
}
const mergedAwayIds = new Set(
  catalog.filter((product) => mergedAway.has(product.slug)).map((product) => product.id),
);
export const mergedListingRedirects = mergedAway;

/** One storefront product per normalized model; alternate suppliers remain supplier offers. */
export const uniqueCatalog = catalog
  .filter((product) => !mergedAwayIds.has(product.id))
  .map((product) => {
    const cheapest = mergedPrice.get(product.id);
    return cheapest && cheapest !== product
      ? { ...product, sourcePrice: cheapest.sourcePrice, retailPrice: cheapest.retailPrice }
      : product;
  })
  .filter((product, index, products) => {
  // Every supplied CSV SKU is a distinct storefront record. Keep the older
  // solar catalog's model-level deduplication for alternate supplier rows.
  if (product.id.startsWith('csv-home-depot-')) return true;
  return (
    products.findIndex(
      (candidate) =>
        !candidate.id.startsWith('csv-home-depot-') &&
        `${candidate.brand}:${candidate.model}`
          .replace(/[^a-z0-9]/gi, '')
          .toLowerCase() ===
          `${product.brand}:${product.model}`
            .replace(/[^a-z0-9]/gi, '')
            .toLowerCase(),
    ) === index
  );
});

/**
 * Product URL slugs without import artefacts: a supplier's name
 * ("signature-solar-…"), Anker's doubled prefix ("anker-solix-anker-…"), or a
 * doubled brand ("ecoflow-ecoflow-…"). The trailing catalog number stays, so
 * slugs remain unique. Old URLs redirect in vercel.json.
 */
export const cleanProductSlug = (slug: string, brand = '') => {
  const cleaned = slug
    .replace(/^(signature-solar|current-connected)-/, '')
    .replace(/^anker-solix-anker-solix-/, 'anker-solix-')
    .replace(/^anker-solix-anker-/, 'anker-')
    .replace(/^([a-z]+-[a-z]+)-\1-/, '$1-')
    .replace(/^([a-z]+)-\1-/, '$1-')
    // "victron-energy-victron-cerbo-…": a two-word brand before its own short form.
    .replace(/^([a-z]+)-(?:energy|solar|power|shield|ubli)-\1-/, '$1-');
  // A wrong supplier brand in front of the real one ("ecoflow-bluetti-…" for a
  // BLUETTI product): start the slug at the real brand.
  const brandSlug = brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  // Items from the EcoFlow store feed carry an "ecoflow-" prefix even when
  // they are another maker's product and the title does not name it.
  if (brandSlug && brandSlug !== 'ecoflow' && cleaned.startsWith('ecoflow-') && !cleaned.includes(`-${brandSlug.split('-')[0]}-`))
    return `${brandSlug}-${cleaned.slice('ecoflow-'.length)}`;
  for (const token of [brandSlug, brandSlug.split('-')[0]]) {
    if (!token || cleaned.startsWith(`${token}-`)) return cleaned;
    const at = cleaned.indexOf(`-${token}-`);
    // Only a brand-like prefix (letters, e.g. "ecoflow", "victron-energy"),
    // never a size such as "18-in".
    if (at > 0 && at <= 16 && /^[a-z]+(-[a-z]+)?$/.test(cleaned.slice(0, at))) return cleaned.slice(at + 1);
  }
  return cleaned;
};

export const approvedCatalog = uniqueCatalog
  .filter((product) => product.status === 'APPROVED')
  // Public IDs reach the browser (cart, page payloads); keep the import
  // source out of them. Internal matching above uses the original IDs.
  .map((product) => ({
    ...product,
    id: product.id.replace(/^csv-home-depot-/, 'item-'),
    slug: cleanProductSlug(product.slug, product.brand),
    // The store's own warranty comes from the Warranty Policy, not import data.
    warranty: WARRANTY_TERM,
  }));
export const bySlug = (slug: string) =>
  approvedCatalog.find((product) => product.slug === slug);
