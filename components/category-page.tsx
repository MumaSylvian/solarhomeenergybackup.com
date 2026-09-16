/* oxlint-disable react-compiler -- server-rendered route content is passed through shared navigation components. */
import Link from 'next/link';
import { ArrowRight, CircleHelp, ShieldCheck } from 'lucide-react';
import { ProductCard } from '@/components/storefront';
import { approvedCatalog } from '@/lib/catalog/products';
import type { CatalogProduct } from '@/lib/catalog/types';

type Category = CatalogProduct['category'];
type CategoryPageProps = { category: Category; eyebrow: string; title: string; copy: string; planning: string; useCases: string[] };

export function CategoryPage({ category, eyebrow, title, copy, planning, useCases }: CategoryPageProps) {
  const products = approvedCatalog.filter((product) => product.category === category).sort((left, right) => left.brand.localeCompare(right.brand) || left.name.localeCompare(right.name));
  return <main className="category-page"><section className="category-hero"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{copy}</p><div className="hero-actions"><Link href={`/shop?category=${encodeURIComponent(category)}`} className="button primary">Browse {products.length} products <ArrowRight size={16}/></Link><Link href="/system-finder" className="button outline-button">Plan your energy needs</Link></div></div><aside><CircleHelp size={22}/><strong>Planning support</strong><span>Use the guides to organize the requirements for your future system.</span><ShieldCheck size={22}/><strong>{products.length} products</strong><span>Available across recognized brands in this category.</span></aside></section><section className="category-content"><div><p className="eyebrow">What to consider</p><h2>{planning}</h2><div className="use-case-grid">{useCases.map((item, index) => <article key={item}><span>0{index + 1}</span><p>{item}</p></article>)}</div></div></section><section className="category-products"><div className="category-section-head"><div><p className="eyebrow">Browse {category}</p><h2>Selected products</h2></div><Link href={`/shop?category=${encodeURIComponent(category)}`}>View all {products.length} <ArrowRight size={15}/></Link></div><div className="shop-products">{products.slice(0, 6).map((product, index) => <ProductCard key={product.id} id={product.id} slug={product.slug} name={product.name} brand={product.brand} category={product.category} shortDescription={product.shortDescription} sourcePrice={product.sourcePrice} retailPrice={product.retailPrice} imageUrl={product.sourceImageUrl} sourceImageUrl={product.sourceDetailImageUrl} galleryImageUrls={product.galleryImageUrls} output={product.continuousOutputWatts} capacity={product.batteryCapacityWh} voltage={product.acVoltage} priority={index < 3}/>)}</div></section></main>;
}
