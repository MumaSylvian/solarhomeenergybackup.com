'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { bySlug } from '@/lib/catalog/products';

export default function ProductPage() {
  const slug = useSearchParams().get('slug') ?? '';
  const product = bySlug(slug);

  if (!product) return <main className="page-shell"><p className="eyebrow">Product details</p><h1>We could not find that catalog record.</h1><p>Return to the catalog and choose a product to view its source details.</p><Link className="button dark" href="/shop">Browse the catalog</Link></main>;

  const specs = Object.entries(product.specifications);
  const supplierUrl = product.supplierOffers[0]?.supplierUrl.split(' | ')[0];
  return <main className="page-shell"><p className="eyebrow">{product.category} / {product.brand}</p><div className="details-grid"><div className="detail-art"><div className="product-device"><span/><span/><span/></div></div><article className="detail-info"><p className="product-brand">{product.brand} · {product.model}</p><h1>{product.name}</h1><p>{product.shortDescription}</p>{product.retailPrice ? <><p className="detail-price"><strong>${product.retailPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong><del>${product.sourcePrice?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</del><small>20% below CSV source price</small></p><p className="notice">Availability, delivery and final taxes are confirmed before purchase.</p></> : <p className="notice">No source price was provided in the imported CSV. Request pricing for this product.</p>}<div className="spec-grid">{specs.slice(0, 6).map(([name, value]) => <div key={name}><small>{name}</small><strong>{value}</strong></div>)}</div><div className="hero-actions"><Link className="button dark" href="/invoice">Request invoice</Link><Link className="button" style={{ border: '1px solid #d8e2dc' }} href="/compare">Compare</Link></div></article></div><div className="detail-sections"><section><h2>Technical specifications</h2><dl>{specs.map(([name, value]) => <div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}</dl></section><section><h2>Source and image handling</h2><p className="source-note">This catalog record has <b>not</b> been approved to locally re-publish supplier imagery. {supplierUrl ? <a href={supplierUrl} target="_blank" rel="noreferrer">View the original supplier source.</a> : 'No supplier link was supplied in the CSV.'}</p></section><section><h2>Compatibility and installation</h2><p>Compatible batteries, panels and accessories are listed only after confirmation. Consult the product documentation and a qualified installer for home integration requirements.</p></section></div></main>;
}
