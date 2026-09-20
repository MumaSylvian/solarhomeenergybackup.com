import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetail } from '@/components/product-detail';
import { approvedCatalog, bySlug } from '@/lib/catalog/products';

const siteUrl = 'https://www.solarhomeenergybackup.com';

export function generateStaticParams() {
  return approvedCatalog.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = bySlug(slug);
  if (!product) return { title: 'Product not found | SolarHome Energy Backup' };
  const description = product.shortDescription.slice(0, 155);
  return { title: `${product.name} | SolarHome Energy Backup`, description, alternates: { canonical: `/product/${product.slug}` }, openGraph: { title: product.name, description, type: 'website', images: product.galleryImageUrls?.slice(0, 1).map((url) => ({ url, alt: product.name })) } };
}

export default async function ProductSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = bySlug(slug);
  if (!product) notFound();
  const productUrl = `${siteUrl}/product/${product.slug}`;
  const schema = { '@context': 'https://schema.org', '@type': 'Product', name: product.name, description: product.shortDescription, image: product.galleryImageUrls, sku: product.sku || product.model, brand: { '@type': 'Brand', name: product.brand }, url: productUrl, offers: product.retailPrice ? { '@type': 'Offer', priceCurrency: 'USD', price: product.retailPrice.toFixed(2), availability: 'https://schema.org/InStock', url: productUrl } : undefined };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}/><ProductDetail product={product}/></>;
}
