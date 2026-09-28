/* oxlint-disable next/no-html-link-for-pages -- listing links must work before client routing is available. */
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/storefront';
import { isInStock } from '@/lib/catalog/offer';
import { copyFor } from '@/lib/catalog/product-copy';
import type { CatalogProduct } from '@/lib/catalog/types';

/**
 * A page of product cards with numbered page links, shared by category and
 * brand pages. Every product is a plain link in the HTML, so shoppers and
 * search engines can reach it without client-side filters.
 */
export function ProductListing({
  products,
  page,
  pages,
  hrefFor,
  label,
}: {
  /** Only the products on this page. */
  products: CatalogProduct[];
  page: number;
  pages: number;
  /** URL of page n. */
  hrefFor: (page: number) => string;
  /** Accessible name for the page links, e.g. "Refrigerators pages". */
  label: string;
}) {
  return (
    <>
      <div className="shop-products">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            id={product.id}
            slug={product.slug}
            name={product.name}
            brand={product.brand}
            category={product.category}
            shortDescription={copyFor(product.id)?.intro ?? product.shortDescription}
            sourcePrice={product.sourcePrice}
            retailPrice={product.retailPrice}
            imageUrl={product.sourceImageUrl}
            sourceImageUrl={product.sourceDetailImageUrl}
            galleryImageUrls={product.galleryImageUrls}
            output={product.continuousOutputWatts}
            capacity={product.batteryCapacityWh}
            voltage={product.acVoltage}
            priority={index < 3}
            inStock={isInStock(product)}
          />
        ))}
      </div>
      {pages > 1 && (
        <nav className="pagination" aria-label={label}>
          {page > 1 && (
            <a href={hrefFor(page - 1)} rel="prev">
              <ArrowLeft size={15} /> Previous
            </a>
          )}
          <ol>
            {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
              <li key={number}>
                {number === page ? <span aria-current="page">{number}</span> : <a href={hrefFor(number)}>{number}</a>}
              </li>
            ))}
          </ol>
          {page < pages && (
            <a href={hrefFor(page + 1)} rel="next">
              Next <ArrowRight size={15} />
            </a>
          )}
        </nav>
      )}
    </>
  );
}
