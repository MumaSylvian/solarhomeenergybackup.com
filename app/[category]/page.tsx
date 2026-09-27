import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryPage } from '@/components/category-page';
import { categoryBySlug, storefrontCategories } from '@/lib/catalog/categories';
import { pageMetadata } from '@/lib/seo';

type Params = { params: Promise<{ category: string }> };

export const dynamicParams = false;

/** One page per storefront category, at /{slug} (lib/catalog/categories.ts). */
export function generateStaticParams() {
  return storefrontCategories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const category = categoryBySlug((await params).category);
  if (!category) return {};
  return pageMetadata({ title: category.metaTitle, description: category.metaDescription, path: category.href });
}

export default async function CategoryRoute({ params }: Params) {
  const category = categoryBySlug((await params).category);
  if (!category) notFound();
  return <CategoryPage category={category} />;
}
