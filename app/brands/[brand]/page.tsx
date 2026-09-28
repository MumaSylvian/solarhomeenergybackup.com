import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BrandPage } from '@/components/brand-page';
import { brandBySlug, brandPages } from '@/lib/catalog/brands';
import { pageMetadata } from '@/lib/seo';

type Params = { params: Promise<{ brand: string }> };

export const dynamicParams = false;

/** One page per brand with enough products (lib/catalog/brands.ts). */
export function generateStaticParams() {
  return brandPages.map((brand) => ({ brand: brand.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const brand = brandBySlug((await params).brand);
  if (!brand) return {};
  const categories = brand.categories.map((category) => category.label.toLowerCase()).slice(0, 4).join(', ');
  return pageMetadata({
    title: `${brand.name} Products`,
    description: `Shop ${brand.count} ${brand.name} products: ${categories}. Ships from Baton Rouge, LA with flat $45 US delivery.`,
    path: `/brands/${brand.slug}`,
  });
}

export default async function BrandRoute({ params }: Params) {
  const brand = brandBySlug((await params).brand);
  if (!brand) notFound();
  return <BrandPage brand={brand} />;
}
