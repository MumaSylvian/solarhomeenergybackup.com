import Link from 'next/link';
import { notFound } from 'next/navigation';
import { approvedCatalog, bySlug } from '@/lib/catalog/products';

export function generateStaticParams() {
  return approvedCatalog.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const product = bySlug(slug); if (!product || product.status !== 'APPROVED') notFound();
  const specs = Object.entries(product.specifications);
  return <main className="page-shell"><p className="eyebrow">{product.category} / {product.brand}</p><div className="details-grid"><div className="detail-art"><div className="product-device"><span/><span/><span/></div></div><article className="detail-info"><p className="product-brand">{product.brand} · {product.model}</p><h1>{product.name}</h1><p>{product.shortDescription}</p>{product.retailPrice && <p className="detail-price"><strong>${product.retailPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong><del>${product.sourcePrice?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</del><small>20% below recorded source price</small></p>}<p className="notice">Price source checked September 8, 2026. Availability, delivery and final taxes are confirmed before purchase.</p><div className="spec-grid">{specs.slice(0, 6).map(([name, value]) => <div key={name}><small>{name}</small><strong>{value}</strong></div>)}</div><div className="hero-actions"><Link className="button dark" href="/invoice">Request invoice</Link><Link className="button" style={{ border: '1px solid #d8e2dc' }} href="/compare">Compare</Link></div></article></div><div className="detail-sections"><section><h2>Technical specifications</h2><dl>{specs.map(([name, value]) => <div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}</dl></section><section><h2>Source and image handling</h2><p className="source-note">This catalog record has <b>not</b> been approved to locally re-publish supplier imagery. Its supplier reference remains available for catalog administration: <a href={product.supplierOffers[0].supplierUrl} target="_blank" rel="noreferrer">view original source</a>.</p></section><section><h2>Compatibility and installation</h2><p>Compatible batteries, panels and accessories are listed only after confirmation. Consult the product documentation and a qualified installer for home integration requirements.</p></section></div></main>;
}
