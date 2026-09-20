'use client';
/* oxlint-disable next/no-html-link-for-pages -- native links preserve product navigation when client routing is delayed. */

import { Check, ChevronLeft, ShieldCheck, ShoppingCart } from 'lucide-react';
import { addToCart } from '@/lib/cart';
import type { CatalogProduct } from '@/lib/catalog/types';
import { useLocale } from '@/components/locale-provider';
import { ProductGallery } from '@/components/product-gallery';

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function ProductDetail({ product }: { product: CatalogProduct }) {
  const { t } = useLocale();
  const add = () => addToCart({ id: product.id, slug: product.slug, name: product.name, brand: product.brand, category: product.category, retailPrice: product.retailPrice });

  return <main className="page-shell product-page"><a href="/shop" className="back-link"><ChevronLeft size={16}/>Back to catalog</a><div className="details-grid"><ProductGallery key={product.id} name={product.name} images={product.galleryImageUrls} fallbackImage={product.sourceDetailImageUrl}/><div className="detail-info"><div className="product-meta"><p className="product-category">{product.category}</p><p className="availability-line"><Check size={13}/>{t('inStock')}</p></div><p className="product-brand">{product.brand}</p><h1>{product.name}</h1><p>{product.shortDescription}</p><div className="detail-price"><strong>{product.retailPrice !== null && product.retailPrice !== undefined ? money.format(product.retailPrice) : t('requestPricing')}</strong>{product.sourcePrice !== null && product.sourcePrice !== undefined && <del>{money.format(product.sourcePrice)}</del>}<small>{t('save20')}</small></div><div className="fulfillment-strip"><span><Check size={16}/><b>In stock</b><small>Availability confirmed before payment</small></span><span><ShieldCheck size={16}/><b>6-month warranty</b><small>Eligible purchases</small></span><span><ShoppingCart size={16}/><b>Delivery review</b><small>Priority 2–3 business days</small></span></div><button className="button primary" type="button" onClick={add}><ShoppingCart size={16}/>{t('addToCart')}</button></div></div><div className="detail-sections"><section><h2>Product information</h2><p>{product.rawSpecifications || product.shortDescription}</p></section><section><h2>Key specifications</h2><dl>{Object.entries(product.specifications).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section><section><h2>Before you order</h2><p>Confirm compatibility, installation requirements, and delivery details during order review. Home electrical work may require a qualified installer.</p></section></div></main>;
}
