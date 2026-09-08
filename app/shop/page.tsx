'use client';

import { useMemo, useState } from 'react';
import { ProductCard } from '@/components/storefront';
import { approvedCatalog } from '@/lib/catalog/products';

export default function ShopPage() {
  const [query, setQuery] = useState('');
  const [wholeHome, setWholeHome] = useState(false);
  const [voltage240, setVoltage240] = useState(false);
  const products = useMemo(() => approvedCatalog.filter((product) => {
    const haystack = `${product.name} ${product.brand} ${product.category} ${product.model}`.toLowerCase();
    return haystack.includes(query.toLowerCase()) && (!wholeHome || product.wholeHomeCapable) && (!voltage240 || product.acVoltage?.includes('240'));
  }), [query, wholeHome, voltage240]);
  return <main className="page-shell"><header><p className="eyebrow">Approved catalog</p><h1>Equipment with a clear source trail.</h1><p>Every listed price is calculated at 20% below the recorded public source price. Products are deduplicated by brand, model and SKU before publication.</p></header><div className="shop-layout"><aside className="filters"><h2>Filter products</h2><label>Search <input aria-label="Search products" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Brand, model, category"/></label><label><input type="checkbox" checked={wholeHome} onChange={(event) => setWholeHome(event.target.checked)}/> Whole-home capable</label><label><input type="checkbox" checked={voltage240} onChange={(event) => setVoltage240(event.target.checked)}/> 120V / 240V</label></aside><section className="shop-products">{products.map((product) => <ProductCard key={product.id} id={product.id} name={product.name} brand={product.brand} category={product.category} output={product.continuousOutputWatts} capacity={product.batteryCapacityWh} voltage={product.acVoltage} sourcePrice={product.sourcePrice} retailPrice={product.retailPrice}/>)}</section></div></main>;
}
