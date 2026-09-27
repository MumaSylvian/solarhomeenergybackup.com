'use client';
/* oxlint-disable react-compiler -- cart data is intentionally hydrated from browser-only storage. */
/* oxlint-disable next/no-html-link-for-pages -- checkout navigation must remain available without client routing. */

import { useSyncExternalStore } from 'react';
import {
  CircleHelp,
  Minus,
  Plus,
  ShoppingCart,
  ShieldCheck,
  X,
} from 'lucide-react';
import {
  cartSnapshot,
  removeFromCart,
  setCartQuantity,
  subscribeToCart,
} from '@/lib/cart';
import {
  DELIVERY_SUMMARY,
  PAYMENT_METHODS,
  deliveryFeeFor,
} from '@/lib/commerce';

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default function CheckoutPage() {
  // Live cart, kept in step with other open tabs. null until the browser's
  // saved cart has been read, so a full cart never flashes "empty".
  const cart = useSyncExternalStore(subscribeToCart, cartSnapshot, () => null);
  const entries = Object.values(cart ?? {});
  const subtotal = entries.reduce(
    (total, item) => total + (item.product.retailPrice ?? 0) * item.quantity,
    0,
  );
  const unpriced = entries.some((item) => item.product.retailPrice == null);
  const remove = (id: string) => removeFromCart(id);
  const changeQuantity = (id: string, quantity: number) =>
    setCartQuantity(id, quantity);
  return (
    <main className="page-shell">
      <header>
        <p className="eyebrow">Checkout</p>
        <h1>Review your power equipment.</h1>
        <p>
          Final availability, delivery timing, and payment instructions are
          confirmed before payment.
        </p>
      </header>
      {cart === null ? (
        <section className="form-card" style={{ maxWidth: 720 }} aria-busy="true">
          <p className="notice">Loading your cart…</p>
        </section>
      ) : entries.length ? (
        <div className="checkout-layout">
          <section className="form-card">
            <h2>Your cart</h2>
            <div className="order-lines">
              {entries.map(({ product, quantity }) => (
                <div key={product.id}>
                  <div className="order-line-info">
                    <b>{product.name}</b>
                    <br />
                    {product.brand}
                    <fieldset
                      className="qty-stepper"
                      aria-label={`Quantity for ${product.name}`}
                    >
                      <button
                        type="button"
                        onClick={() => changeQuantity(product.id, quantity - 1)}
                        aria-label={
                          quantity === 1
                            ? `Remove ${product.name}`
                            : `Decrease quantity of ${product.name}`
                        }
                      >
                        <Minus size={14} />
                      </button>
                      <output aria-live="polite" translate="no">{quantity}</output>
                      <button
                        type="button"
                        onClick={() => changeQuantity(product.id, quantity + 1)}
                        aria-label={`Increase quantity of ${product.name}`}
                        disabled={quantity >= 99}
                      >
                        <Plus size={14} />
                      </button>
                    </fieldset>
                  </div>
                  <span translate="no">
                    {product.retailPrice == null
                      ? 'Price confirmed at review'
                      : money.format(product.retailPrice * quantity)}{' '}
                    <button
                      className="restart-button"
                      type="button"
                      onClick={() => remove(product.id)}
                      aria-label={`Remove ${product.name}`}
                    >
                      <X size={15} />
                    </button>
                  </span>
                </div>
              ))}
            </div>
            <p className="notice">
              {DELIVERY_SUMMARY}
            </p>
          </section>
          <aside className="form-card order-summary">
            <h2>Order summary</h2>
            <dl>
              <div>
                <dt>Items subtotal</dt>
                <dd translate="no">{money.format(subtotal)}</dd>
              </div>
              <div>
                <dt>Delivery</dt>
                <dd translate="no">{money.format(deliveryFeeFor(entries.length))}</dd>
              </div>
              <div className="total">
                <dt>Total before tax</dt>
                <dd translate="no">{money.format(subtotal + deliveryFeeFor(entries.length))}</dd>
              </div>
            </dl>
            {unpriced && (
              <p className="summary-note">
                Items marked “Price confirmed at review” are not in this total;
                we quote them before you pay.
              </p>
            )}
            <a href="/invoice" className="button primary">
              <ShieldCheck size={16} /> Continue with invoice
            </a>
            <p className="summary-note">
              <CircleHelp size={15} /> Accepted: {PAYMENT_METHODS.join(', ')}.
              Payment instructions are sent after your order is confirmed.
            </p>
          </aside>
        </div>
      ) : (
        <section className="form-card" style={{ maxWidth: 720 }}>
          <ShoppingCart size={28} />
          <h2>Your cart is empty</h2>
          <p className="notice">
            Choose a product from the catalog to begin an order review.
          </p>
          <div className="hero-actions">
            <a href="/shop" className="button primary">
              Browse products
            </a>
            <a href="/support" className="button secondary">
              <CircleHelp size={16} /> Contact support
            </a>
          </div>
        </section>
      )}
    </main>
  );
}
