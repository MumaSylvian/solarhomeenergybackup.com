import { csvCatalog } from './catalog.generated';

/**
 * Product photos are stored in Git LFS. The connected Vercel deployment
 * currently serves LFS pointer files from /public/catalog rather than the
 * original binary images, so those paths decode as broken images in browsers.
 * GitHub's media endpoint serves the corresponding LFS binaries directly.
 */
const catalogMediaBaseUrl = 'https://media.githubusercontent.com/media/MumaSylvian/solarhomeenergybackup.com/main/public/catalog/';

const resolveCatalogImageUrl = (imageUrl: string | null | undefined) =>
  imageUrl?.startsWith('/catalog/')
    ? `${catalogMediaBaseUrl}${imageUrl.slice('/catalog/'.length)}`
    : imageUrl ?? null;

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
  'catalog-2', 'catalog-3', 'catalog-6', 'catalog-25', 'catalog-28', 'catalog-38', 'catalog-46', 'catalog-47', 'catalog-61', 'catalog-62', 'catalog-63', 'catalog-65', 'catalog-88',
  'catalog-107', 'catalog-113', 'catalog-117', 'catalog-121', 'catalog-122', 'catalog-123', 'catalog-126', 'catalog-128', 'catalog-129', 'catalog-130', 'catalog-132', 'catalog-133', 'catalog-134',
  'catalog-142', 'catalog-143', 'catalog-147', 'catalog-148', 'catalog-151', 'catalog-153', 'catalog-164', 'catalog-168', 'catalog-170', 'catalog-172', 'catalog-174', 'catalog-180', 'catalog-191',
  'catalog-206', 'catalog-217', 'catalog-218', 'catalog-225', 'catalog-235', 'catalog-236', 'catalog-237', 'catalog-247', 'catalog-248', 'catalog-301', 'catalog-418', 'catalog-585', 'catalog-622',
  'catalog-599', 'catalog-600', 'catalog-635', 'catalog-657', 'catalog-674', 'catalog-691', 'catalog-694', 'catalog-719', 'catalog-755', 'catalog-777', 'catalog-780', 'catalog-788', 'catalog-808', 'catalog-809', 'catalog-812', 'catalog-832',
  'catalog-840', 'catalog-859',
  'catalog-394', 'catalog-399', 'catalog-472', 'catalog-475', 'catalog-526', 'catalog-541', 'catalog-586', 'catalog-587', 'catalog-590', 'catalog-595', 'catalog-598', 'catalog-605', 'catalog-610', 'catalog-612', 'catalog-625', 'catalog-626', 'catalog-627', 'catalog-628', 'catalog-629', 'catalog-631', 'catalog-632', 'catalog-633', 'catalog-649', 'catalog-651', 'catalog-652', 'catalog-659', 'catalog-675', 'catalog-698', 'catalog-711', 'catalog-858', 'catalog-881',
]);

export const catalog = csvCatalog
  .filter((product) => !unusablePrimaryImageIds.has(product.id))
  .map((product) => {
    const primaryImage = resolveCatalogImageUrl(
      clearGalleryPrimary[product.id] ?? product.sourceImageUrl ?? product.sourceDetailImageUrl,
    );

    /**
     * Gallery attachments in the supplied archives include brand lockups,
     * awards, promotional banners, compatibility labels, and other
     * non-equipment graphics. Customer pages intentionally show only the
     * approved primary equipment image. The original files remain untouched
     * in the local catalog archive for future review.
     */
    return {
      ...product,
      sourceImageUrl: primaryImage,
      sourceDetailImageUrl: primaryImage,
      galleryImageUrls: primaryImage ? [primaryImage] : [],
    };
  });

/** One storefront product per normalized model; alternate suppliers remain supplier offers. */
export const uniqueCatalog = catalog.filter((product, index, products) => products.findIndex((candidate) =>
  `${candidate.brand}:${candidate.model}`.replace(/[^a-z0-9]/gi, '').toLowerCase() === `${product.brand}:${product.model}`.replace(/[^a-z0-9]/gi, '').toLowerCase(),
) === index);

export const approvedCatalog = uniqueCatalog.filter((product) => product.status === 'APPROVED');
export const bySlug = (slug: string) => approvedCatalog.find((product) => product.slug === slug);
