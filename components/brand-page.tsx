/* oxlint-disable next/no-html-link-for-pages -- browsing links must work before client routing is available. */
import { ArrowRight } from 'lucide-react';
import { ProductListing } from '@/components/product-listing';
import { CATEGORY_PAGE_SIZE } from '@/lib/catalog/categories';
import { brandPageCount, brandPageHref, productsForBrand, type BrandSummary } from '@/lib/catalog/brands';
import { jsonLd, siteUrl } from '@/lib/seo';

/**
 * A brand page: every product we list from one manufacturer, 48 per page.
 * The copy states only catalog facts (counts and categories); nothing is
 * claimed on the manufacturer's behalf.
 */
export function BrandPage({ brand, page = 1 }: { brand: BrandSummary; page?: number }) {
  const products = productsForBrand(brand.name);
  const pages = brandPageCount(brand.name);
  const onPage = products.slice((page - 1) * CATEGORY_PAGE_SIZE, page * CATEGORY_PAGE_SIZE);
  const first = (page - 1) * CATEGORY_PAGE_SIZE + 1;
  const url = `${siteUrl}${brandPageHref(brand, page)}`;
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: page > 1 ? `${brand.name} products – page ${page}` : `${brand.name} products`,
      url,
      about: { '@type': 'Brand', name: brand.name },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: products.length,
        itemListElement: onPage.map((product, index) => ({
          '@type': 'ListItem',
          position: first + index,
          url: `${siteUrl}/products/${product.slug}`,
          name: product.name,
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Brands', item: `${siteUrl}/brands` },
        { '@type': 'ListItem', position: 3, name: brand.name, item: `${siteUrl}/brands/${brand.slug}` },
      ],
    },
  ];

  return (
    <main className="category-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
      <nav aria-label="Breadcrumb" className="breadcrumb category-breadcrumb">
        <ol>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/brands">Brands</a>
          </li>
          {page > 1 ? (
            <>
              <li>
                <a href={brandPageHref(brand, 1)}>{brand.name}</a>
              </li>
              <li aria-current="page">Page {page}</li>
            </>
          ) : (
            <li aria-current="page">{brand.name}</li>
          )}
        </ol>
      </nav>
      <section className="category-hero category-hero-compact">
        <div>
          <p className="eyebrow">Brand</p>
          <h1>
            {brand.name}
            {page > 1 && <span className="category-page-number"> – page {page} of {pages}</span>}
          </h1>
          {page === 1 && (
            <p>
              We list {products.length} {brand.name} products:{' '}
              {brand.categories.map((category) => `${category.label.toLowerCase()} (${category.count})`).join(', ')}.
              Delivery within the United States is a flat $45 per order.
            </p>
          )}
        </div>
      </section>
      <section className="category-products" id="products">
        <div className="category-section-head">
          <div>
            <p className="eyebrow">{brand.name}</p>
            <h2>
              {pages > 1
                ? `Products ${first}–${first + onPage.length - 1} of ${products.length}`
                : `All ${products.length} products`}
            </h2>
          </div>
          <a href="/brands">
            All brands <ArrowRight size={15} />
          </a>
        </div>
        <ProductListing
          products={onPage}
          page={page}
          pages={pages}
          hrefFor={(number) => brandPageHref(brand, number)}
          label={`${brand.name} pages`}
        />
      </section>
    </main>
  );
}
