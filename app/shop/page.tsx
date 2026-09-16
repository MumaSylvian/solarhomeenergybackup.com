'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, CircleHelp, PackageOpen, Search, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { ProductCard, type ProductPreview } from '@/components/storefront';
import { addToCart } from '@/lib/cart';
import type { CatalogProduct } from '@/lib/catalog/types';
import { useLocale } from '@/components/locale-provider';

const pageSize = 24;

export default function ShopPage() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') ?? '');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') ?? '');
  const [wholeHome, setWholeHome] = useState(false);
  const [voltage240, setVoltage240] = useState(false);
  const [shown, setShown] = useState(pageSize);
  const [addedName, setAddedName] = useState('');
  const [catalog, setCatalog] = useState<CatalogProduct[] | null>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  const brands = useMemo(() => [...new Set((catalog ?? []).map((product) => product.brand))].sort(), [catalog]);
  const categories = useMemo(() => [...new Set((catalog ?? []).map((product) => product.category))].sort(), [catalog]);
  const products = useMemo(() => (catalog ?? []).filter((product) => {
    const haystack = `${product.name} ${product.brand} ${product.category} ${product.model} ${product.sku ?? ''}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase()) && (!brand || product.brand === brand) && (!category || product.category === category) && (!wholeHome || product.wholeHomeCapable) && (!voltage240 || /240/i.test(product.acVoltage ?? ''));
  }).sort((left, right) => left.brand.localeCompare(right.brand) || left.category.localeCompare(right.category) || left.name.localeCompare(right.name)), [brand, catalog, category, query, voltage240, wholeHome]);
  const visibleProducts = products.slice(0, shown);

  useEffect(() => { let active = true; void import('@/lib/catalog/products').then(({ approvedCatalog }) => { if (active) setCatalog(approvedCatalog); }, () => { if (active) setCatalog([]); }); return () => { active = false; }; }, []);
  useEffect(() => {
    const element = sentinel.current;
    if (!element || shown >= products.length) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setShown((current) => Math.min(current + pageSize, products.length)); }, { rootMargin: '480px 0px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, [products.length, shown]);

  const add = (product: ProductPreview) => {
    addToCart({ id: product.id, slug: product.slug, name: product.name, brand: product.brand, category: product.category, retailPrice: product.retailPrice });
    setAddedName(product.name);
  };

  return <main className="power-hub"><header className="hub-hero"><div><p className="eyebrow">SolarHome Energy Backup / {t('powerHub')}</p><h1>Equipment organized around the way you power.</h1><p>{catalog ? `Browse ${catalog.length.toLocaleString()} products from ${brands.length} recognized brands. Every storefront price is set 20% below the supplied catalog price.` : 'Loading the current catalog and product images.'}</p></div><div className="hub-stats" aria-label="Catalog commitments"><div><ShieldCheck size={19}/><strong>{catalog ? brands.length : '—'}</strong><span>brands represented</span></div><div><PackageOpen size={19}/><strong>{catalog ? catalog.length : '—'}</strong><span>products ready to browse</span></div><div><CircleHelp size={19}/><strong>6 mo.</strong><span>limited warranty coverage</span></div></div></header><section className="trust-strip" aria-label="Store assurances"><div className="assurance-badge"><ShieldCheck size={19}/><span><b>Secure order review</b><small>Confirmation before payment</small></span></div><div className="assurance-badge"><Check size={19}/><span><b>In-stock listings</b><small>Availability confirmed with order review</small></span></div><div className="assurance-badge"><CircleHelp size={19}/><span><b>Practical support</b><small>Mon–Sat, 9 AM–5 PM PT</small></span></div></section><div className="shop-layout"><aside className="filters"><div className="filter-title"><SlidersHorizontal size={17}/><h2>Refine your view</h2></div><label className="search-field"><Search size={16}/><input aria-label="Search products" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Brand, model, category"/></label><label>Brand<select aria-label="Filter by brand" value={brand} onChange={(event) => setBrand(event.target.value)}><option value="">All brands</option>{brands.map((item) => <option key={item} value={item}>{item}</option>)}</select></label><label>Category<select aria-label="Filter by category" value={category} onChange={(event) => setCategory(event.target.value)}><option value="">All categories</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></label><label><input type="checkbox" checked={wholeHome} onChange={(event) => setWholeHome(event.target.checked)}/> Whole-home capable</label><label><input type="checkbox" checked={voltage240} onChange={(event) => setVoltage240(event.target.checked)}/> 120V / 240V</label></aside><section className="catalog-area" aria-live="polite"><p className="catalog-count">{catalog ? `Showing ${visibleProducts.length.toLocaleString()} / ${products.length.toLocaleString()} products${brand ? ` · ${brand}` : ''}${category ? ` · ${category}` : ''}` : 'Loading products…'}</p>{addedName && <p className="added-message"><Check size={15}/>{addedName} was added to your cart.</p>}<div className="shop-products">{visibleProducts.map((product, index) => <ProductCard key={product.id} id={product.id} slug={product.slug} name={product.name} brand={product.brand} category={product.category} shortDescription={product.shortDescription} sourcePrice={product.sourcePrice} retailPrice={product.retailPrice} imageUrl={product.sourceImageUrl} sourceImageUrl={product.sourceDetailImageUrl} galleryImageUrls={product.galleryImageUrls} output={product.continuousOutputWatts} capacity={product.batteryCapacityWh} voltage={product.acVoltage} add={add} priority={index < 6}/>)}</div>{catalog && products.length === 0 && <div className="catalog-empty"><PackageOpen size={28}/><h2>No matching products</h2><p>Try a different search term, brand, category, or filter.</p></div>}<div ref={sentinel} className="catalog-scroll-sentinel">{catalog && (visibleProducts.length < products.length ? 'Loading more products as you scroll…' : `${products.length.toLocaleString()} products shown`)}</div></section></div></main>;
}
