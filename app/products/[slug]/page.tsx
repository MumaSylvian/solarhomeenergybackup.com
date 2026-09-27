import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetail } from '@/components/product-detail';
import { approvedCatalog, bySlug } from '@/lib/catalog/products';
import { storefrontCategories } from '@/lib/catalog/categories';
import { conditionOf, isInStock, schemaCondition, stockSource } from '@/lib/catalog/offer';
import { overviewFor, productMetaDescription } from '@/lib/catalog/overview';
import { postsForCategory } from '@/lib/blog/posts';
import { copyFor } from '@/lib/catalog/product-copy';
import { FLAT_DELIVERY_FEE } from '@/lib/commerce';
import { ProductCard } from '@/components/storefront';
import type { CatalogProduct } from '@/lib/catalog/types';

const siteUrl = 'https://www.solarhomeenergybackup.com';

type Params = { params: Promise<{ slug: string }> };

/** Supplier records stay on the server; the page only needs the product. */
const withoutSupplierData = <T extends { supplierOffers?: unknown }>({
  supplierOffers: _supplierOffers,
  ...product
}: T) => product;

export const dynamicParams = false;

/**
 * Four other products from the same category: same brand first, then the
 * closest in price, skipping listings with the same name.
 */
const relatedTo = (product: CatalogProduct) => {
  const price = product.retailPrice ?? 0;
  const distance = (other: CatalogProduct) => Math.abs((other.retailPrice ?? 0) - price);
  // Colour and pack variants share a base name ("… Power Station | 600W (Glacier Blue)");
  // show at most one of each, and none of this product's own variants.
  const base = (item: CatalogProduct) => item.name.replace(/\([^)]*\)/g, '').split(/[|,]/)[0].trim().toLowerCase();
  const seen = new Set([base(product)]);
  return approvedCatalog
    .filter((other) => other.category === product.category && other.id !== product.id && other.retailPrice != null)
    .sort((left, right) =>
      Number(right.brand === product.brand) - Number(left.brand === product.brand) || distance(left) - distance(right),
    )
    .filter((other) => !seen.has(base(other)) && seen.add(base(other)))
    .slice(0, 4);
};

/** Title and link only; the full guide text would bloat every product page. */
const guideFor = (category: string) => {
  const post = postsForCategory(category)[0];
  return post ? { slug: post.slug, title: post.title } : undefined;
};

export function generateStaticParams() {
  return approvedCatalog.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const product = bySlug((await params).slug);
  if (!product) return {};
  const written = copyFor(product.id)?.intro;
  const description = written
    ? written.length > 155
      ? `${written.slice(0, 155).replace(/\s+\S*$/, '')}…`
      : written
    : productMetaDescription(product);
  const image = product.galleryImageUrls?.[0];
  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: 'website',
      url: `${siteUrl}/products/${product.slug}`,
      title: product.name,
      description,
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
    twitter: { card: 'summary_large_image', title: product.name, description },
  };
}

export default async function ProductPage({ params }: Params) {
  const product = bySlug((await params).slug);
  if (!product) notFound();

  const url = `${siteUrl}/products/${product.slug}`;
  const related = relatedTo(product);
  // Condition and availability come from data, never constants: a "new" or
  // "in stock" claim that contradicts the listing is a Merchant Center
  // misrepresentation risk.
  const condition = schemaCondition[conditionOf(product)];
  const stock = stockSource(product);
  const inStock = stock !== null;
  const category = storefrontCategories.find(
    (item) => item.label === product.category,
  );
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: copyFor(product.id)?.intro ?? overviewFor(product),
      // Self-hosted photos are site-relative; structured data needs absolute URLs.
      image: product.galleryImageUrls?.length
        ? product.galleryImageUrls.map((image) => new URL(image, siteUrl).href)
        : undefined,
      sku: product.sku || product.model || undefined,
      mpn: product.model || undefined,
      category: product.category,
      brand: product.brand
        ? { '@type': 'Brand', name: product.brand }
        : undefined,
      itemCondition: condition,
      offers:
        product.retailPrice !== null && product.retailPrice !== undefined
          ? {
              '@type': 'Offer',
              url,
              price: product.retailPrice.toFixed(2),
              priceCurrency: 'USD',
              availability: inStock ? 'https://schema.org/InStock' : undefined,
              itemCondition: condition,
              seller: { '@id': `${siteUrl}/#organization` },
              // From the Shipping & Delivery Policy and the owner's flat US rate.
              shippingDetails: {
                '@type': 'OfferShippingDetails',
                shippingRate: {
                  '@type': 'MonetaryAmount',
                  value: FLAT_DELIVERY_FEE.toFixed(2),
                  currency: 'USD',
                },
                shippingDestination: {
                  '@type': 'DefinedRegion',
                  addressCountry: 'US',
                },
                deliveryTime: {
                  '@type': 'ShippingDeliveryTime',
                  handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 3, unitCode: 'DAY' },
                  transitTime: { '@type': 'QuantitativeValue', minValue: 5, maxValue: 7, unitCode: 'DAY' },
                },
              },
              hasMerchantReturnPolicy: { '@id': `${siteUrl}/#return-policy` },
            }
          : undefined,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { name: 'Home', item: siteUrl },
        category && {
          name: category.label,
          item: `${siteUrl}${category.href}`,
        },
        { name: product.name, item: url },
      ]
        .filter(Boolean)
        .map((entry, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          ...entry,
        })),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <ProductDetail
        product={withoutSupplierData(product)}
        inStock={inStock}
        stock={stock}
        overview={overviewFor(product)}
        copy={copyFor(product.id)}
        guide={guideFor(product.category)}
      >
        {related.length > 0 && category && (
          <section className="related-products" aria-labelledby="related-products">
            <h2 id="related-products">More in {category.label.toLowerCase()}</h2>
            <div className="shop-products">
              {related.map((other) => (
                <ProductCard
                  key={other.id}
                  id={other.id}
                  slug={other.slug}
                  name={other.name}
                  brand={other.brand}
                  category={other.category}
                  shortDescription={copyFor(other.id)?.intro ?? other.shortDescription}
                  sourcePrice={other.sourcePrice}
                  retailPrice={other.retailPrice}
                  imageUrl={other.sourceImageUrl}
                  sourceImageUrl={other.sourceDetailImageUrl}
                  galleryImageUrls={other.galleryImageUrls}
                  output={other.continuousOutputWatts}
                  capacity={other.batteryCapacityWh}
                  voltage={other.acVoltage}
                  inStock={isInStock(other)}
                />
              ))}
            </div>
            <p>
              <a href={category.href}>See all {category.label.toLowerCase()}</a>
            </p>
          </section>
        )}
      </ProductDetail>
    </>
  );
}
