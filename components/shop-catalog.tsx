'use client';
/* oxlint-disable react-compiler -- URL query changes must reset the hydrated catalog controls. */
/* oxlint-disable next/no-html-link-for-pages -- the cart link must work even if client routing is delayed. */

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import {
  Check,
  CircleHelp,
  PackageOpen,
  Search,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';
import { ProductCard, type ProductPreview } from '@/components/storefront';
import { addToCart } from '@/lib/cart';
import { storefrontCategories } from '@/lib/catalog/categories';
import type { ShopItem } from '@/lib/catalog/shop-index';
import { useLocale } from '@/components/locale-provider';

const pageSize = 24;

/**
 * The page's query string (?category=, ?search=), read in the browser. The
 * shop is a static page, so the server render has no query; next/navigation's
 * useSearchParams stayed empty after hydration, and category links and header
 * searches showed the whole catalog.
 */
const subscribeToLocation = (onChange: () => void) => {
  window.addEventListener('popstate', onChange);
  return () => window.removeEventListener('popstate', onChange);
};
const useQueryParam = (name: string) =>
  useSyncExternalStore(
    subscribeToLocation,
    () => new URLSearchParams(window.location.search).get(name) ?? '',
    () => '',
  );

// Browse in menu order so power equipment leads and appliances follow.
const categoryRank = (category: string) => {
  const rank = storefrontCategories.findIndex((item) => item.label === category);
  return rank === -1 ? storefrontCategories.length : rank;
};

export function ShopCatalog({ catalog }: { catalog: ShopItem[] }) {
  const { t } = useLocale();
  const categoryParam = useQueryParam('category');
  const searchParam = useQueryParam('search');
  const [query, setQuery] = useState(searchParam);
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState(categoryParam);
  const [wholeHome, setWholeHome] = useState(false);
  const [voltage240, setVoltage240] = useState(false);
  const [shown, setShown] = useState(pageSize);
  const [added, setAdded] = useState({ name: '', count: 0 });
  const sentinel = useRef<HTMLDivElement>(null);
  const brands = [
    ...new Set(catalog.map((product) => product.brand).filter(Boolean)),
  ].sort();
  const categories = [
    ...new Set(catalog.map((product) => product.category)),
  ].sort();

  useEffect(() => {
    setCategory(categoryParam);
    setQuery(searchParam);
    setShown(pageSize);
  }, [categoryParam, searchParam]);
  const searchTerms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const products = catalog
    .filter((product) => {
      return (
        // Every word must match, in any order ("ecoflow delta", "bluetti 2000w").
        searchTerms.every((term) => product.searchText.includes(term)) &&
        (!brand || product.brand === brand) &&
        (!category || product.category === category) &&
        (!wholeHome || product.wholeHomeCapable) &&
        (!voltage240 || /240/i.test(product.acVoltage ?? ''))
      );
    })
    .sort(
      (left, right) =>
        categoryRank(left.category) - categoryRank(right.category) ||
        left.brand.localeCompare(right.brand) ||
        left.name.localeCompare(right.name),
    );
  const visibleProducts = products.slice(0, shown);

  useEffect(() => {
    const element = sentinel.current;
    if (!element || shown >= products.length) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting)
          setShown((current) => Math.min(current + pageSize, products.length));
      },
      { rootMargin: '480px 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [products.length, shown]);

  const add = (product: ProductPreview) => {
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      category: product.category,
      sourcePrice: product.sourcePrice,
      retailPrice: product.retailPrice,
    });
    setAdded((last) => ({ name: product.name, count: last.count + 1 }));
  };

  return (
    <main className="power-hub">
      <header className="hub-hero">
        <div>
          <p className="eyebrow">SolarHome Energy Backup / {t('powerHub')}</p>
          <h1>Equipment organized around the way you power.</h1>
          <p>
            Browse {catalog.length.toLocaleString()} products from{' '}
            {brands.length} recognized brands, with specifications and
            prices shown in US dollars.
          </p>
        </div>
        <div className="hub-stats" aria-label="Catalog commitments">
          <div>
            <ShieldCheck size={19} />
            <strong>{brands.length}</strong>
            <span>brands represented</span>
          </div>
          <div>
            <PackageOpen size={19} />
            <strong>{catalog.length}</strong>
            <span>products ready to browse</span>
          </div>
          <div>
            <CircleHelp size={19} />
            <strong>30 days</strong>
            <span>limited warranty from delivery</span>
          </div>
        </div>
      </header>
      <section className="trust-strip" aria-label="Store assurances">
        <div className="assurance-badge">
          <ShieldCheck size={19} />
          <span>
            <b>Secure order review</b>
            <small>Confirmation before payment</small>
          </span>
        </div>
        <div className="assurance-badge">
          <Check size={19} />
          <span>
            <b>In-stock listings</b>
            <small>Availability confirmed with order review</small>
          </span>
        </div>
        <div className="assurance-badge">
          <CircleHelp size={19} />
          <span>
            <b>Practical support</b>
            <small>Mon–Sat, 9 AM–5 PM CT</small>
          </span>
        </div>
      </section>
      <div className="shop-layout">
        <aside className="filters">
          <div className="filter-title">
            <SlidersHorizontal size={17} />
            <h2>Refine your view</h2>
          </div>
          <label className="search-field">
            <Search size={16} />
            <input
              aria-label="Search products"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Brand, model, category"
            />
          </label>
          <label>
            Brand
            <select
              aria-label="Filter by brand"
              value={brand}
              onChange={(event) => setBrand(event.target.value)}
            >
              <option value="">All brands</option>
              {brands.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label>
            Category
            <select
              aria-label="Filter by category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label>
            <input
              type="checkbox"
              checked={wholeHome}
              onChange={(event) => setWholeHome(event.target.checked)}
            />{' '}
            Whole-home capable
          </label>
          <label>
            <input
              type="checkbox"
              checked={voltage240}
              onChange={(event) => setVoltage240(event.target.checked)}
            />{' '}
            120V / 240V
          </label>
        </aside>
        <section className="catalog-area">
          {/* Only the count is announced to screen readers, not the whole grid. */}
          <p className="catalog-count" aria-live="polite">
            {/* Counts change as filters do; translate="no" keeps Google's translator from freezing them. */}
            Showing <span translate="no">{visibleProducts.length.toLocaleString()}</span> /{' '}
            <span translate="no">{products.length.toLocaleString()}</span> products
            <span translate="no">
              {brand ? ` · ${brand}` : ''}
              {category ? ` · ${category}` : ''}
            </span>
          </p>
          {added.name && (
            // Keyed so each add renders fresh text (translated pages freeze text updated in place).
            <output className="added-message" key={added.count}>
              <Check size={15} />
              {added.name} was added to your cart.{' '}
              <a href="/checkout">View cart</a>
            </output>
          )}
          <div className="shop-products">
            {visibleProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                id={product.id}
                slug={product.slug}
                name={product.name}
                brand={product.brand}
                category={product.category}
                shortDescription={product.shortDescription}
                sourcePrice={product.sourcePrice}
                retailPrice={product.retailPrice}
                imageUrl={product.imageUrl}
                sourceImageUrl={product.fallbackImageUrl}
                output={product.continuousOutputWatts}
                capacity={product.batteryCapacityWh}
                voltage={product.acVoltage}
                inStock={product.inStock}
                add={add}
                priority={index < 6}
              />
            ))}
          </div>
          {products.length === 0 && (
            <div className="catalog-empty">
              <PackageOpen size={28} />
              <h2>No matching products</h2>
              <p>Try a different search term, brand, category, or filter.</p>
            </div>
          )}
          <div ref={sentinel} className="catalog-scroll-sentinel">
            {visibleProducts.length < products.length ? (
              <span key="more">Loading more products as you scroll…</span>
            ) : (
              <span key="done">
                <span translate="no">{products.length.toLocaleString()}</span> products shown
              </span>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
