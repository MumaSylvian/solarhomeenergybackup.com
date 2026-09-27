import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryPage, categoryPageHref, pageCountFor } from '@/components/category-page';
import { categoryBySlug, storefrontCategories } from '@/lib/catalog/categories';
import { pageMetadata } from '@/lib/seo';

type Params = { params: Promise<{ category: string; page: string }> };

export const dynamicParams = false;

/** Pages 2+ of each category, at /{slug}/page/{n}. Page 1 is /{slug}. */
export function generateStaticParams() {
  return storefrontCategories.flatMap((category) =>
    Array.from({ length: pageCountFor(category.label) - 1 }, (_, index) => ({
      category: category.slug,
      page: String(index + 2),
    })),
  );
}

const resolve = async (params: Params['params']) => {
  const { category: slug, page } = await params;
  const category = categoryBySlug(slug);
  const number = Number(page);
  if (!category || !Number.isInteger(number) || number < 2 || number > pageCountFor(category.label)) return null;
  return { category, number };
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const resolved = await resolve(params);
  if (!resolved) return {};
  const { category, number } = resolved;
  return pageMetadata({
    title: `${category.metaTitle} – Page ${number}`,
    description: `${category.metaDescription} Page ${number} of ${pageCountFor(category.label)}.`,
    path: categoryPageHref(category, number),
  });
}

export default async function CategoryPageRoute({ params }: Params) {
  const resolved = await resolve(params);
  if (!resolved) notFound();
  return <CategoryPage category={resolved.category} page={resolved.number} />;
}
