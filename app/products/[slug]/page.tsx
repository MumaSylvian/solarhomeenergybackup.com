import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetail } from '@/components/product-detail';
import { approvedCatalog, bySlug } from '@/lib/catalog/products';
import { storefrontCategories } from '@/lib/catalog/categories';
import { conditionOf, isInStock, schemaCondition } from '@/lib/catalog/offer';
import { overviewFor, productMetaDescription } from '@/lib/catalog/overview';
import { postsForCategory } from '@/lib/blog/posts';

const siteUrl = 'https://www.solarhomeenergybackup.com';

type Params = { params: Promise<{ slug: string }> };

/** Supplier records stay on the server; the page only needs the product. */
const withoutSupplierData = <T extends { supplierOffers?: unknown }>({
  supplierOffers: _supplierOffers,
  ...product
}: T) => product;

export const dynamicParams = false;

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
  const description = productMetaDescription(product);
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
  // Condition and availability come from data, never constants: a "new" or
  // "in stock" claim that contradicts the listing is a Merchant Center
  // misrepresentation risk.
  const condition = schemaCondition[conditionOf(product)];
  const inStock = isInStock(product);
  const category = storefrontCategories.find(
    (item) => item.label === product.category,
  );
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: overviewFor(product),
      image: product.galleryImageUrls?.length
        ? product.galleryImageUrls
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
        overview={overviewFor(product)}
        guide={guideFor(product.category)}
      />
    </>
  );
}
