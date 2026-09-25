/* oxlint-disable react-compiler -- server-rendered route content is passed through shared navigation components. */
/* oxlint-disable next/no-html-link-for-pages -- browsing links must work before client routing is available. */
import { ArrowRight, CircleHelp, ShieldCheck } from 'lucide-react';
import { ProductCard } from '@/components/storefront';
import { approvedCatalog } from '@/lib/catalog/products';
import type { CatalogProduct } from '@/lib/catalog/types';
import { postsForCategory } from '@/lib/blog/posts';
import { isInStock } from '@/lib/catalog/offer';

type Category = CatalogProduct['category'];
type CategoryPageProps = { category: Category; eyebrow: string; title: string; copy: string; planning: string; useCases: string[] };

export function CategoryPage({ category, eyebrow, title, copy, planning, useCases }: CategoryPageProps) {
  const products = approvedCatalog.filter((product) => product.category === category).sort((left, right) => left.brand.localeCompare(right.brand) || left.name.localeCompare(right.name));
  const guides = postsForCategory(category);
  return <main className="category-page"><section className="category-hero"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{copy}</p><div className="hero-actions"><a href={`/shop?category=${encodeURIComponent(category)}`} className="button primary">Browse {products.length} products <ArrowRight size={16}/></a><a href="/system-finder" className="button outline-button">Plan your energy needs</a></div></div><aside><CircleHelp size={22}/><strong>Planning support</strong><span>Use the guides to organize the requirements for your future system.</span><ShieldCheck size={22}/><strong>{products.length} products</strong><span>Available across recognized brands in this category.</span></aside></section><section className="category-content"><div><p className="eyebrow">What to consider</p><h2>{planning}</h2><div className="use-case-grid">{useCases.map((item, index) => <article key={item}><span>0{index + 1}</span><p>{item}</p></article>)}</div></div></section><section className="category-products"><div className="category-section-head"><div><p className="eyebrow">Browse {category}</p><h2>Selected products</h2></div><a href={`/shop?category=${encodeURIComponent(category)}`}>View all {products.length} <ArrowRight size={15}/></a></div><div className="shop-products">{products.slice(0, 6).map((product, index) => <ProductCard key={product.id} id={product.id} slug={product.slug} name={product.name} brand={product.brand} category={product.category} shortDescription={product.shortDescription} sourcePrice={product.sourcePrice} retailPrice={product.retailPrice} imageUrl={product.sourceImageUrl} sourceImageUrl={product.sourceDetailImageUrl} galleryImageUrls={product.galleryImageUrls} output={product.continuousOutputWatts} capacity={product.batteryCapacityWh} voltage={product.acVoltage} priority={index < 3} inStock={isInStock(product)}/>)}</div></section>{guides.length > 0 && <section className="category-guides" aria-labelledby="category-guides"><h2 id="category-guides">Planning guides</h2><ul>{guides.map((post) => <li key={post.slug}><a href={`/blog/${post.slug}`}>{post.title} <ArrowRight size={15}/></a></li>)}</ul></section>}</main>;
}
