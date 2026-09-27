'use client';
/* oxlint-disable next/no-html-link-for-pages -- native links preserve product navigation when client routing is delayed. */

import { useState, type ReactNode } from 'react';
import { Check, ShieldCheck, ShoppingCart } from 'lucide-react';
import { addToCart } from '@/lib/cart';
import { storefrontCategories } from '@/lib/catalog/categories';
import type { CatalogProduct } from '@/lib/catalog/types';
import type { ProductCopy } from '@/lib/catalog/product-copy';
import { business } from '@/lib/business';
import { useLocale } from '@/components/locale-provider';
import { ProductGallery } from '@/components/product-gallery';
import {
  DELIVERY_ESTIMATE,
  FLAT_DELIVERY_FEE,
  SHOW_REFERENCE_PRICES,
  PROCESSING_TIME,
  WARRANTY_SHORT,
  WARRANTY_TERM,
  discountPercentFor,
  whatsappUrl,
} from '@/lib/commerce';

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

/**
 * Receives the product without supplier records (they would be serialized
 * into the page); stock status is computed on the server and passed in.
 */
export function ProductDetail({
  product,
  inStock,
  stock,
  overview,
  copy,
  guide,
  children,
}: {
  product: Omit<CatalogProduct, 'supplierOffers'>;
  inStock: boolean;
  /** Where the stock claim comes from (lib/catalog/offer.ts). */
  stock: 'warehouse' | 'supplier' | null;
  /** Our overview, written on the server from verified fields (lib/catalog/overview.ts). */
  overview: string;
  /** Verified rewrite for this product, when one exists (lib/catalog/product-copy.ts). */
  copy?: ProductCopy;
  guide?: { slug: string; title: string };
  /** Server-rendered sections shown at the end of the page (related products). */
  children?: ReactNode;
}) {
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
          {category ? (
            <li>
              <a href={category.href}>{category.label}</a>
            </li>
          ) : (
            <li>
              <a href="/shop">Shop</a>
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
          {product.brand && <p className="product-brand">{product.brand}</p>}
          <h1>{product.name}</h1>
          <div className="detail-price">
            <strong>
              {product.retailPrice !== null && product.retailPrice !== undefined
                ? money.format(product.retailPrice)
                : t('requestPricing')}
            </strong>
            {SHOW_REFERENCE_PRICES &&
              product.sourcePrice !== null &&
              product.sourcePrice !== undefined && (
                <del>{money.format(product.sourcePrice)}</del>
              )}
            {SHOW_REFERENCE_PRICES && discount > 0 && (
              <small>Save {discount}%</small>
            )}
          </div>
          <div className="fulfillment-strip">
            <span>
              <Check size={16} />
              <b>
                {stock === 'warehouse'
                  ? 'In stock'
                  : stock === 'supplier'
                    ? 'In stock at supplier'
                    : 'Availability'}
              </b>
              <small>
                {stock === 'warehouse'
                  ? `Ships from ${business.shipsFrom}`
                  : 'Confirmed at order review, before payment'}
              </small>
            </span>
            <span>
              <ShieldCheck size={16} />
              <b>{WARRANTY_SHORT}</b>
              <small>From delivery, on eligible products</small>
            </span>
            <span>
              <ShoppingCart size={16} />
              <b>Flat ${FLAT_DELIVERY_FEE} US delivery</b>
              <small>
                Processing {PROCESSING_TIME}; delivery {DELIVERY_ESTIMATE}
              </small>
            </span>
          </div>
          <p className="policy-links">
            <a href="/shipping-delivery">Shipping & delivery</a>
            <a href="/returns">30-day returns</a>
            <a href="/warranty">Warranty</a>
          </p>
          {product.retailPrice != null ? (
            <button className="button primary" type="button" onClick={add}>
              <ShoppingCart size={16} />
              {t('addToCart')}
            </button>
          ) : (
            // No list price: ask for a quote rather than adding a $0.00 line to the cart.
            <a
              className="button primary"
              href={whatsappUrl(`Hello SolarHome Energy Backup, please send me a price for ${product.name}.`)}
              target="_blank"
              rel="noreferrer"
            >
              Request a price on WhatsApp
            </a>
          )}
          <output className="added-message" key={addedCount}>
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
          <h2>Overview</h2>
          <p>{copy?.intro ?? overview}</p>
          {guide && (
            <p>
              Planning a system? Read our guide:{' '}
              <a href={`/blog/${guide.slug}`}>{guide.title}</a>.
            </p>
          )}
        </section>
        {copy && copy.benefits.length > 0 && (
          <section>
            <h2>Key benefits</h2>
            <ul>
              {copy.benefits.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}
        {copy && copy.features.length > 0 && (
          <section>
            <h2>Key features</h2>
            <ul>
              {copy.features.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}
        {copy?.idealUse && (
          <section>
            <h2>Ideal use</h2>
            <p>{copy.idealUse}</p>
          </section>
        )}
        {copy && copy.included.length > 0 && (
          <section>
            <h2>What is included</h2>
            <ul>
              {copy.included.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}
        <section>
          <h2>Key specifications</h2>
          <dl>
            {Object.entries(product.specifications)
              .filter(([label]) => label !== 'Gallery images')
              .map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
          </dl>
        </section>
        {(product.rawSpecifications || product.shortDescription) && (
          <section>
            <h2>From the manufacturer</h2>
            <p>{product.rawSpecifications || product.shortDescription}</p>
            <p className="warranty-note">
              Warranty terms mentioned in this description are the
              manufacturer’s. Our own coverage is the{' '}
              <a href="/warranty">{WARRANTY_TERM}</a>.
            </p>
          </section>
        )}
        <section>
          <h2>Before you order</h2>
          <p>
            We confirm compatibility, installation requirements, and delivery
            details with you during order review, before any payment. Home
            electrical work may require a qualified installer.
          </p>
          <p>
            {copy ? `${copy.cta} ` : 'Questions about this product? '}
            <a
              href={whatsappUrl(`Hello SolarHome Energy Backup, I have a question about ${product.name}.`)}
              target="_blank"
              rel="noreferrer"
            >
              Message our team on WhatsApp
            </a>
            .
          </p>
        </section>
      </div>
      {children}
    </main>
  );
}
