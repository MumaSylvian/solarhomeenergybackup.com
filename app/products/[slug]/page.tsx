import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetail } from '@/components/product-detail';
import { approvedCatalog, bySlug } from '@/lib/catalog/products';
import { storefrontCategories } from '@/lib/catalog/categories';
import { conditionOf, isInStock, schemaCondition } from '@/lib/catalog/offer';

const siteUrl = 'https://www.solarhomeenergybackup.com';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return approvedCatalog.map((product) => ({ slug: product.slug }));
}

const describe = (text: string) =>
  text.length > 155 ? `${text.slice(0, 155).replace(/\s+\S*$/, '')}…` : text;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const product = bySlug((await params).slug);
  if (!product) return {};
  const description = describe(
    product.shortDescription ||
      `${product.brand} ${product.name} — ${product.category} from SolarHome Energy Backup.`,
  );
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
      description: product.shortDescription || undefined,
      image: product.galleryImageUrls?.length
        ? product.galleryImageUrls
        : undefined,
      sku: product.sku || product.model || undefined,
      mpn: product.model || undefined,
      category: product.category,
      brand: { '@type': 'Brand', name: product.brand },
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
      <ProductDetail product={product} />
    </>
  );
}
