'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/storefront';
import { approvedCatalog } from '@/lib/catalog/products';

export default function ShopPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const [query, setQuery] = useState('');
  const [wholeHome, setWholeHome] = useState(false);
  const [voltage240, setVoltage240] = useState(false);
  const [shown, setShown] = useState(48);
  const products = useMemo(() => approvedCatalog.filter((product) => {
    const haystack = `${product.name} ${product.brand} ${product.category} ${product.model}`.toLowerCase();
    return haystack.includes(query.toLowerCase()) && (!category || product.category === category) && (!wholeHome || product.wholeHomeCapable) && (!voltage240 || product.acVoltage?.includes('240'));
  }), [category, query, wholeHome, voltage240]);
  const visibleProducts = products.slice(0, shown);
  const search = (value: string) => { setQuery(value); setShown(48); };
  return <main className="page-shell"><header><p className="eyebrow">Approved catalog</p><h1>{category ?? 'Equipment with a clear source trail.'}</h1><p>Every listed price is calculated at 20% below the source price in the imported supplier CSV. Products are deduplicated before publication.</p></header><div className="shop-layout"><aside className="filters"><h2>Filter products</h2><label>Search <input aria-label="Search products" value={query} onChange={(event) => search(event.target.value)} placeholder="Brand, model, category"/></label><label><input type="checkbox" checked={wholeHome} onChange={(event) => { setWholeHome(event.target.checked); setShown(48); }}/> Whole-home capable</label><label><input type="checkbox" checked={voltage240} onChange={(event) => { setVoltage240(event.target.checked); setShown(48); }}/> 120V / 240V</label></aside><section><p className="catalog-count">Showing {visibleProducts.length.toLocaleString()} of {products.length.toLocaleString()} products{category ? ` in ${category}` : ''}</p><div className="shop-products">{visibleProducts.map((product) => <ProductCard key={product.id} id={product.id} slug={product.slug} name={product.name} brand={product.brand} category={product.category} output={product.continuousOutputWatts} capacity={product.batteryCapacityWh} voltage={product.acVoltage} sourcePrice={product.sourcePrice} retailPrice={product.retailPrice}/>)}</div>{visibleProducts.length < products.length && <button className="button dark catalog-more" onClick={() => setShown((value) => value + 48)}>Show more products</button>}</section></div></main>;
}
