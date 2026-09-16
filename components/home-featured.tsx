import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/storefront';
import { approvedCatalog } from '@/lib/catalog/products';

export function HomeFeatured() {
  const products = approvedCatalog.slice().sort((left, right) => left.brand.localeCompare(right.brand) || left.name.localeCompare(right.name)).slice(0, 3);
  return <section className="featured"><div className="section featured-head"><div><p className="eyebrow">Featured brands</p><h2>Current equipment.<br/>Clear product details.</h2></div><p>Every product has its supplied image, product name, brand, category, and a storefront price set 20% below the supplied catalog price.</p></div><div className="product-row">{products.map((product, index) => <ProductCard key={product.id} id={product.id} slug={product.slug} name={product.name} brand={product.brand} category={product.category} shortDescription={product.shortDescription} sourcePrice={product.sourcePrice} retailPrice={product.retailPrice} imageUrl={product.sourceImageUrl} sourceImageUrl={product.sourceDetailImageUrl} galleryImageUrls={product.galleryImageUrls} output={product.continuousOutputWatts} capacity={product.batteryCapacityWh} voltage={product.acVoltage} priority={index < 3}/>)}</div><div className="featured-link"><Link href="/shop">Browse all {approvedCatalog.length.toLocaleString()} products <ArrowRight size={16}/></Link></div></section>;
}
