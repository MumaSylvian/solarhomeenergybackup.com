'use client';
/* oxlint-disable next/no-html-link-for-pages -- native links preserve product navigation when client routing is delayed. */

import { useState } from 'react';
import { Check, ShieldCheck, ShoppingCart } from 'lucide-react';
import { addToCart } from '@/lib/cart';
import { storefrontCategories } from '@/lib/catalog/categories';
import { isInStock } from '@/lib/catalog/offer';
import type { CatalogProduct } from '@/lib/catalog/types';
import { useLocale } from '@/components/locale-provider';
import { ProductGallery } from '@/components/product-gallery';
import { discountPercentFor } from '@/lib/commerce';

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function ProductDetail({ product }: { product: CatalogProduct }) {
  const { t } = useLocale();
  // Counts adds on this page so repeated clicks are visibly acknowledged.
  const [addedCount, setAddedCount] = useState(0);
  const add = () => {
    setAddedCount((count) => count + 1);
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      category: product.category,
      sourcePrice: product.sourcePrice,
      retailPrice: product.retailPrice,
    });
  };
  const discount = discountPercentFor(product.sourcePrice);
  const inStock = isInStock(product);
  const category = storefrontCategories.find(
    (item) => item.label === product.category,
  );

  return (
    <main className="page-shell product-page">
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <ol>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/shop">Shop</a>
          </li>
          {category && (
            <li>
              <a href={category.href}>{category.label}</a>
            </li>
          )}
          <li aria-current="page">{product.name}</li>
        </ol>
      </nav>
      <div className="details-grid">
        <ProductGallery
          key={product.id}
          name={product.name}
          images={product.galleryImageUrls}
          fallbackImage={product.sourceDetailImageUrl}
        />
        <div className="detail-info">
          <div className="product-meta">
            <p className="product-category">{product.category}</p>
            {inStock ? (
              <p className="availability-line">
                <Check size={13} />
                {t('inStock')}
              </p>
            ) : (
              <p className="availability-line pending">
                {t('confirmAvailability')}
              </p>
            )}
          </div>
          <p className="product-brand">{product.brand}</p>
          <h1>{product.name}</h1>
          <p>{product.shortDescription}</p>
          <div className="detail-price">
            <strong>
              {product.retailPrice !== null && product.retailPrice !== undefined
                ? money.format(product.retailPrice)
                : t('requestPricing')}
            </strong>
            {product.sourcePrice !== null &&
              product.sourcePrice !== undefined && (
                <del>{money.format(product.sourcePrice)}</del>
              )}
            {discount > 0 && <small>Save {discount}%</small>}
          </div>
          <div className="fulfillment-strip">
            <span>
              <Check size={16} />
              <b>{inStock ? 'In stock at supplier' : 'Availability'}</b>
              <small>Confirmed at order review, before payment</small>
            </span>
            <span>
              <ShieldCheck size={16} />
              <b>6-month warranty</b>
              <small>Eligible purchases</small>
            </span>
            <span>
              <ShoppingCart size={16} />
              <b>Delivery estimate</b>
              <small>
                Priority 2–3 business days, starting after order confirmation
                and payment
              </small>
            </span>
          </div>
          <button className="button primary" type="button" onClick={add}>
            <ShoppingCart size={16} />
            {t('addToCart')}
          </button>
          <output className="added-message">
            {addedCount > 0 && (
              <>
                <Check size={15} />
                {addedCount === 1
                  ? 'Added to your cart.'
                  : `Added to your cart (${addedCount} in this visit).`}{' '}
                <a href="/checkout">View cart</a>
              </>
            )}
          </output>
        </div>
      </div>
      <div className="detail-sections">
        <section>
          <h2>Product information</h2>
          <p>{product.rawSpecifications || product.shortDescription}</p>
        </section>
        <section>
          <h2>Key specifications</h2>
          <dl>
            {Object.entries(product.specifications).map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section>
          <h2>Before you order</h2>
          <p>
            Confirm compatibility, installation requirements, and delivery
            details during order review. Home electrical work may require a
            qualified installer.
          </p>
        </section>
      </div>
    </main>
  );
}
