/* oxlint-disable next/no-html-link-for-pages -- category cards provide dependable native navigation. */
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { approvedCatalog } from '@/lib/catalog/products';
import type { CatalogProduct } from '@/lib/catalog/types';

type CategorySpotlight = {
  category: CatalogProduct['category'];
  title: string;
  copy: string;
  href: string;
};

const spotlights: CategorySpotlight[] = [
  {
    category: 'Whole-home backup',
    title: 'Whole-home backup',
    copy: 'Inverters, system bundles, and power equipment for essential circuits and home coverage.',
    href: '/whole-home-backup',
  },
  {
    category: 'Portable power',
    title: 'Portable power',
    copy: 'Portable stations and generators for outages, RVs, job sites, and travel.',
    href: '/portable-power',
  },
  {
    category: 'Batteries',
    title: 'Batteries',
    copy: 'Battery storage and expansion options for more backup capacity.',
    href: '/shop?category=Batteries',
  },
  {
    category: 'Solar panels',
    title: 'Solar panels',
    copy: 'Solar modules and charging equipment for portable and fixed systems.',
    href: '/solar-panels',
  },
  {
    category: 'Home integration',
    title: 'Home integration',
    copy: 'Transfer, distribution, and control equipment for home backup.',
    href: '/shop?category=Home%20integration',
  },
  {
    category: 'EV chargers',
    title: 'EV chargers',
    copy: 'Level 2 charging equipment and compatible home-energy charging solutions.',
    href: '/ev-chargers',
  },
  {
    category: 'Accessories',
    title: 'Accessories',
    copy: 'Cables, connectors, mounting, and compatible system essentials.',
    href: '/shop?category=Accessories',
  },
  {
    category: 'Refrigerators',
    title: 'Refrigerators',
    copy: 'Full-size and compact refrigeration for kitchens, bars, workshops, and backup planning.',
    href: '/shop?category=Refrigerators',
  },
  {
    category: 'Freezers',
    title: 'Freezers',
    copy: 'Chest and upright freezer options for dependable cold storage.',
    href: '/shop?category=Freezers',
  },
  {
    category: 'Dishwashers',
    title: 'Dishwashers',
    copy: 'Built-in, portable, and compact dishwashers for everyday kitchens.',
    href: '/shop?category=Dishwashers',
  },
  {
    category: 'Washers & Dryers',
    title: 'Washers & Dryers',
    copy: 'Laundry equipment for apartments, utility rooms, and larger homes.',
    href: '/shop?category=Washers%20%26%20Dryers',
  },
];

const categoryImageProductIds: Partial<
  Record<CatalogProduct['category'], string>
> = {
  'Whole-home backup': 'catalog-258',
  'Portable power': 'catalog-675',
  Batteries: 'catalog-602',
  'Solar panels': 'catalog-702',
  'Home integration': 'catalog-708',
  'EV chargers': 'catalog-634',
  Accessories: 'catalog-654',
};

export function CategoryShowcase() {
  const entries = spotlights
    .map((spotlight) => {
      const products = approvedCatalog.filter(
        (product) =>
          product.category === spotlight.category && product.sourceImageUrl,
      );
      const preferredProduct = products.find(
        (product) => product.id === categoryImageProductIds[spotlight.category],
      );
      return {
        ...spotlight,
        count: products.length,
        product: preferredProduct ?? products[0],
      };
    })
    .filter((entry) => entry.product);

  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Choose your path</p>
          <h2>
            Power for the way
            <br />
            you use it.
          </h2>
        </div>
        <p className="section-intro">
          Start with the job at hand, then choose from equipment in the current
          catalog.
        </p>
      </div>
      <div className="category-grid catalog-category-grid">
        {entries.map((entry, index) => (
          <a
            href={entry.href}
            className="category-card catalog-category-card"
            key={entry.title}
          >
            <Image
              src={entry.product!.sourceImageUrl!}
              alt={entry.product!.name}
              fill
              sizes="(max-width: 520px) 100vw, (max-width: 850px) 50vw, 33vw"
              unoptimized
            />
            <div className="category-card-content">
              <span className="category-number">
                {String(index + 1).padStart(2, '0')} · {entry.count} products
              </span>
              <h3>{entry.title}</h3>
              <p>{entry.copy}</p>
              <b>
                Explore <ArrowRight size={15} />
              </b>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
