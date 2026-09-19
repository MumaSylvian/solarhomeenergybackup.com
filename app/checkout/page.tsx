'use client';
/* oxlint-disable react-compiler -- cart data is intentionally hydrated from browser-only storage. */
/* oxlint-disable next/no-html-link-for-pages -- checkout navigation must remain available without client routing. */

import { useEffect, useMemo, useState } from 'react';
import { CircleHelp, ShoppingCart, ShieldCheck, X } from 'lucide-react';
import { readCart, saveCart, type StoredCart } from '@/lib/cart';
import { shippingFor } from '@/lib/commerce';

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export default function CheckoutPage() {
  const [cart, setCart] = useState<StoredCart>({});
  useEffect(() => setCart(readCart()), []);
  const entries = Object.values(cart);
  const subtotal = useMemo(() => entries.reduce((total, item) => total + (item.product.retailPrice ?? 0) * item.quantity, 0), [entries]);
  const shipping = shippingFor(subtotal);
  const remove = (id: string) => { const next = { ...cart }; delete next[id]; setCart(next); saveCart(next); };
  return <main className="page-shell"><header><p className="eyebrow">Checkout</p><h1>Review your power equipment.</h1><p>Final availability, delivery timing, and payment instructions are confirmed before payment.</p></header>{entries.length ? <div className="checkout-layout"><section className="form-card"><h2>Your cart</h2><div className="order-lines">{entries.map(({ product, quantity }) => <div key={product.id}><span><b>{product.name}</b><br/>{product.brand} · Qty {quantity}</span><span>{money.format((product.retailPrice ?? 0) * quantity)} <button className="restart-button" type="button" onClick={() => remove(product.id)} aria-label={`Remove ${product.name}`}><X size={15}/></button></span></div>)}</div><p className="notice">Priority delivery is 2–3 business days. Express delivery is 4–7 business days. Shipping is 20% for orders below $1,000 and free at $1,000 or more.</p></section><aside className="form-card order-summary"><h2>Order summary</h2><dl><div><dt>Subtotal</dt><dd>{money.format(subtotal)}</dd></div><div><dt>Shipping</dt><dd>{shipping === 0 ? 'Free' : money.format(shipping)}</dd></div><div className="total"><dt>Estimated total</dt><dd>{money.format(subtotal + shipping)}</dd></div></dl><a href="/invoice" className="button primary"><ShieldCheck size={16}/> Continue with invoice</a><p className="summary-note"><CircleHelp size={15}/> Zelle, Apple Pay, bank transfer, and Bitcoin instructions are confirmed after review.</p></aside></div> : <section className="form-card" style={{ maxWidth: 720 }}><ShoppingCart size={28}/><h2>Your cart is empty</h2><p className="notice">Choose a product from the catalog to begin an order review.</p><div className="hero-actions"><a href="/shop" className="button primary">Browse products</a><a href="/support" className="button secondary"><CircleHelp size={16}/> Contact support</a></div></section>}</main>;
}
