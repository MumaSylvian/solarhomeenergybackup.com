import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BrandPage } from '@/components/brand-page';
import { brandBySlug, brandPageCount, brandPageHref, brandPages } from '@/lib/catalog/brands';
import { pageMetadata } from '@/lib/seo';

type Params = { params: Promise<{ brand: string; page: string }> };

export const dynamicParams = false;

/** Pages 2+ of each brand, at /brands/{slug}/page/{n}. */
export function generateStaticParams() {
  return brandPages.flatMap((brand) =>
    Array.from({ length: brandPageCount(brand.name) - 1 }, (_, index) => ({ brand: brand.slug, page: String(index + 2) })),
  );
}

const resolve = async (params: Params['params']) => {
  const { brand: slug, page } = await params;
  const brand = brandBySlug(slug);
  const number = Number(page);
  if (!brand || !Number.isInteger(number) || number < 2 || number > brandPageCount(brand.name)) return null;
  return { brand, number };
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const resolved = await resolve(params);
  if (!resolved) return {};
  const { brand, number } = resolved;
  return pageMetadata({
    title: `${brand.name} Products – Page ${number}`,
    description: `${brand.name} products, page ${number} of ${brandPageCount(brand.name)}. Ships from Baton Rouge, LA with flat $45 US delivery.`,
    path: brandPageHref(brand, number),
  });
}

export default async function BrandPageRoute({ params }: Params) {
  const resolved = await resolve(params);
  if (!resolved) notFound();
  return <BrandPage brand={resolved.brand} page={resolved.number} />;
}
