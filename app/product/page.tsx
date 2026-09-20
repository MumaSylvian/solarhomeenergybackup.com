'use client';
/* oxlint-disable next/no-html-link-for-pages -- product navigation remains available even if client routing is delayed. */

import { useSyncExternalStore } from 'react';
import { ChevronLeft } from 'lucide-react';
import { approvedCatalog } from '@/lib/catalog/products';
import { ProductDetail } from '@/components/product-detail';

const subscribeToLocation = (notify: () => void) => {
  window.addEventListener('popstate', notify);
  return () => window.removeEventListener('popstate', notify);
};
const getLocationSearch = () => window.location.search;
const getServerSearch = () => '';

export default function ProductPage() {
  const search = useSyncExternalStore(subscribeToLocation, getLocationSearch, getServerSearch);
  const slug = new URLSearchParams(search).get('slug') ?? '';
  if (!slug) return <main className="page-shell loading-page"><p>Loading product details…</p></main>;
  const product = approvedCatalog.find((candidate) => candidate.slug === slug);
  if (!product) return <main className="page-shell"><a href="/shop" className="back-link"><ChevronLeft size={16}/>Back to catalog</a><p className="eyebrow">Product details</p><h1>This product is not available.</h1><p>This link does not match a product in the current catalog.</p><a className="button primary" href="/shop">Browse the catalog</a></main>;
  return <ProductDetail product={product}/>;
}
