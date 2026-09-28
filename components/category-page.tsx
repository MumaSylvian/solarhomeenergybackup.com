/* oxlint-disable react-compiler -- server-rendered route content is passed through shared navigation components. */
/* oxlint-disable next/no-html-link-for-pages -- browsing links must work before client routing is available. */
import { ArrowRight, CircleHelp, ShieldCheck } from 'lucide-react';
import { ProductListing } from '@/components/product-listing';
import { approvedCatalog } from '@/lib/catalog/products';
import { postsForCategory } from '@/lib/blog/posts';
import { CATEGORY_PAGE_SIZE, categoryGroups, type StorefrontCategory } from '@/lib/catalog/categories';
import { jsonLd, siteUrl } from '@/lib/seo';
import { topBrandsInCategory } from '@/lib/catalog/brands';

/** Products in a category, in a stable browse order (brand, then name). */
export const productsInCategory = (label: string) =>
  approvedCatalog
    .filter((product) => product.category === label)
    .sort((left, right) => left.brand.localeCompare(right.brand) || left.name.localeCompare(right.name));

export const pageCountFor = (label: string) =>
  Math.max(1, Math.ceil(productsInCategory(label).length / CATEGORY_PAGE_SIZE));

/** URL of page n of a category: /{slug} for page 1, /{slug}/page/{n} after. */
export const categoryPageHref = (category: StorefrontCategory, page: number) =>
  page <= 1 ? category.href : `${category.href}/page/${page}`;

/**
 * A category page: every product in the category, 48 per page, as plain links
 * in the HTML, so shoppers and search engines can reach each product without
 * the shop's client-side filters.
 */
export function CategoryPage({ category, page = 1 }: { category: StorefrontCategory; page?: number }) {
  const products = productsInCategory(category.label);
  const pages = pageCountFor(category.label);
  const onPage = products.slice((page - 1) * CATEGORY_PAGE_SIZE, page * CATEGORY_PAGE_SIZE);
  const first = (page - 1) * CATEGORY_PAGE_SIZE + 1;
  const guides = postsForCategory(category.label);
  const siblings = categoryGroups.find((entry) => entry.group === category.group)!.categories.filter(
    (item) => item.slug !== category.slug,
  );
  const url = `${siteUrl}${categoryPageHref(category, page)}`;
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: page > 1 ? `${category.metaTitle} – page ${page}` : category.metaTitle,
      url,
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
        { '@type': 'ListItem', position: 2, name: category.label, item: `${siteUrl}${category.href}` },
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
          {page > 1 ? (
            <>
              <li>
                <a href={category.href}>{category.label}</a>
              </li>
              <li aria-current="page">Page {page}</li>
            </>
          ) : (
            <li aria-current="page">{category.label}</li>
          )}
        </ol>
      </nav>
      {page === 1 ? (
        <>
          <section className="category-hero">
            <div>
              <p className="eyebrow">{category.eyebrow}</p>
              <h1>{category.title}</h1>
              <p>{category.copy}</p>
              <div className="hero-actions">
                <a href="#products" className="button primary">
                  Browse {products.length} products <ArrowRight size={16} />
                </a>
                <a href="/system-finder" className="button outline-button">
                  Plan your energy needs
                </a>
              </div>
            </div>
            <aside>
              <CircleHelp size={22} />
              <strong>Planning support</strong>
              <span>Use the guides to organize the requirements for your future system.</span>
              <ShieldCheck size={22} />
              <strong>{products.length} products</strong>
              <span>Available across recognized brands in this category.</span>
            </aside>
          </section>
          <section className="category-content">
            <div>
              <p className="eyebrow">What to consider</p>
              <h2>{category.planning}</h2>
              <div className="use-case-grid">
                {category.useCases.map((item, index) => (
                  <article key={item}>
                    <span>0{index + 1}</span>
                    <p>{item}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="category-hero category-hero-compact">
          <div>
            <p className="eyebrow">{category.eyebrow}</p>
            <h1>
              {category.label} <span className="category-page-number">– page {page} of {pages}</span>
            </h1>
          </div>
        </section>
      )}
      <section className="category-products" id="products">
        <div className="category-section-head">
          <div>
            <p className="eyebrow">{category.label}</p>
            <h2>
              {pages > 1
                ? `Products ${first}–${first + onPage.length - 1} of ${products.length}`
                : `All ${products.length} products`}
            </h2>
          </div>
          <a href="/shop">
            Search all products <ArrowRight size={15} />
          </a>
        </div>
        <ProductListing
          products={onPage}
          page={page}
          pages={pages}
          hrefFor={(number) => categoryPageHref(category, number)}
          label={`${category.label} pages`}
        />
      </section>
      {topBrandsInCategory(category.label).length > 0 && (
        <section className="category-guides" aria-labelledby="category-brands">
          <h2 id="category-brands">Top brands in {category.label.toLowerCase()}</h2>
          <ul className="brand-list">
            {topBrandsInCategory(category.label).map(({ brand, count }) => (
              <li key={brand.slug}>
                <a href={brand.href!}>
                  {brand.name} <span className="brand-count">{count}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className="category-guides" aria-labelledby="related-categories">
        <h2 id="related-categories">More in {category.group.toLowerCase()}</h2>
        <ul className="related-categories">
          {siblings.map((item) => (
            <li key={item.slug}>
              <a href={item.href}>
                {item.label} <ArrowRight size={15} />
              </a>
            </li>
          ))}
        </ul>
      </section>
      {guides.length > 0 && (
        <section className="category-guides" aria-labelledby="category-guides">
          <h2 id="category-guides">Planning guides</h2>
          <ul>
            {guides.map((post) => (
              <li key={post.slug}>
                <a href={`/blog/${post.slug}`}>
                  {post.title} <ArrowRight size={15} />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
