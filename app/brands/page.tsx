/* oxlint-disable next/no-html-link-for-pages -- brand links keep native navigation for crawlers and non-JS readers. */
import { brands, MIN_BRAND_PRODUCTS } from '@/lib/catalog/brands';
import { storefrontCategories, type CategoryGroup } from '@/lib/catalog/categories';
import { jsonLd, pageMetadata, siteUrl } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Shop by Brand',
  description:
    'Every brand we carry, from EcoFlow, BLUETTI, Anker SOLIX, and Victron Energy to GE, Whirlpool, LG, and Samsung appliances.',
  path: '/brands',
});

const groupOf = (label: string): CategoryGroup =>
  storefrontCategories.find((category) => category.label === label)?.group ?? 'Backup power';

/** A brand belongs to the group where most of its products are. */
const grouped = (['Backup power', 'Home appliances'] as const).map((group) => ({
  group,
  brands: brands.filter((brand) => {
    const inGroup = brand.categories.filter((category) => groupOf(category.label) === group).reduce((total, category) => total + category.count, 0);
    return inGroup * 2 > brand.count || (inGroup * 2 === brand.count && group === 'Backup power');
  }),
}));

export default function BrandsPage() {
  const linked = brands.filter((brand) => brand.href);
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Shop by brand',
    url: `${siteUrl}/brands`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: linked.length,
      itemListElement: linked.map((brand, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${siteUrl}${brand.href}`,
        name: brand.name,
      })),
    },
  };
  return (
    <main className="page-shell brands-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <ol>
          <li>
            <a href="/">Home</a>
          </li>
          <li aria-current="page">Brands</li>
        </ol>
      </nav>
      <header>
        <p className="eyebrow">Shop by brand</p>
        <h1>Every brand we carry.</h1>
        <p>
          {brands.length} brands across backup power and home appliances. Brands with {MIN_BRAND_PRODUCTS} or more
          products have their own page; the rest open a search for that brand.
        </p>
      </header>
      {grouped.map(({ group, brands: members }) => (
        <section key={group} className="brand-group" aria-labelledby={group === 'Backup power' ? 'brands-power' : 'brands-appliances'}>
          <h2 id={group === 'Backup power' ? 'brands-power' : 'brands-appliances'}>{group === 'Backup power' ? 'Backup power brands' : 'Home appliance brands'}</h2>
          <ul className="brand-list">
            {members.map((brand) => (
              <li key={brand.name}>
                <a
                  href={brand.href ?? `/shop?search=${encodeURIComponent(brand.name)}`}
                  className={brand.href ? undefined : 'brand-minor'}
                >
                  {brand.name} <span className="brand-count">{brand.count}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
