'use client';
/* oxlint-disable react-compiler -- cart data is intentionally hydrated from browser-only storage. */

import { useEffect, useState } from 'react';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { invoiceRequestSchema } from '@/lib/validations';
import { readCart, type StoredCart } from '@/lib/cart';
import { WHATSAPP_PHONE_DISPLAY, whatsappUrl } from '@/lib/commerce';

export default function InvoicePage() {
  const [message, setMessage] = useState('');
  const [cart, setCart] = useState<StoredCart>({});
  useEffect(() => setCart(readCart()), []);

  async function submit(event: { preventDefault: () => void; currentTarget: HTMLFormElement }) {
    event.preventDefault();
    const form = event.currentTarget;
    const raw = Object.fromEntries(new FormData(form));
    const request = invoiceRequestSchema.safeParse({ firstName: raw.firstName, lastName: raw.lastName, email: raw.email, phone: raw.phone, address: raw.billingAddress, city: raw.city, postalCode: raw.postalCode, company: raw.company, taxId: raw.taxId, purchaseOrder: raw.purchaseOrder, notes: raw.notes });
    if (!request.success) { setMessage('Please complete the required fields with a valid email and contact number.'); return; }
    const items = Object.values(cart).map(({ product, quantity }) => `• ${product.name} (${product.brand}) × ${quantity}${product.retailPrice ? ` — $${product.retailPrice.toFixed(2)} each` : ''}`);
    const details = [
      'Hello SolarHome Energy Backup, I would like to request an invoice.',
      '',
      `Name: ${request.data.firstName} ${request.data.lastName}`,
      request.data.company ? `Company: ${request.data.company}` : '',
      `Email: ${request.data.email}`,
      `Phone: ${request.data.phone}`,
      `Billing address: ${request.data.address}, ${request.data.city}, ${request.data.postalCode}`,
      request.data.taxId ? `Tax/VAT number: ${request.data.taxId}` : '',
      request.data.purchaseOrder ? `PO number: ${request.data.purchaseOrder}` : '',
      request.data.notes ? `Notes: ${request.data.notes}` : '',
      '',
      'Requested items:',
      ...(items.length ? items : ['• I will confirm the selected products with the support team.']),
    ].filter(Boolean).join('\n');
    setMessage('Opening WhatsApp with your invoice request…');
    window.location.assign(whatsappUrl(details));
  }

  const items = Object.values(cart);
  return <main className="page-shell"><header><p className="eyebrow">Invoice checkout</p><h1>Purchase the way your business works.</h1><p>Request an invoice for your selected products, contractor purchases, or a business order. Final products, delivery, and pricing are reviewed before payment.</p></header><div className="invoice-grid"><form className="form-card" onSubmit={submit}><h2>Request an invoice</h2><div className="form-grid"><label>First name *<input required name="firstName"/></label><label>Last name *<input required name="lastName"/></label><label>Company<input name="company" autoComplete="organization"/></label><label>Email *<input required name="email" type="email" autoComplete="email"/></label><label>Phone *<input required name="phone" type="tel" autoComplete="tel"/></label><label>City *<input required name="city" autoComplete="address-level2"/></label><label className="wide">Billing address *<input required name="billingAddress" autoComplete="street-address"/></label><label>Postal code *<input required name="postalCode" autoComplete="postal-code"/></label><label>Tax/VAT number<input name="taxId"/></label><label className="wide">PO number<input name="purchaseOrder"/></label><label className="wide">Order notes<textarea name="notes" rows={4} placeholder="Tell us about the equipment or system you are planning for."/></label></div><button className="button dark" type="submit">Request invoice on WhatsApp</button>{message && <p className="notice" style={{ marginTop: 18 }}>{message}</p>}</form><aside className="aside-card"><CheckCircle2 size={24}/><h2>What happens next</h2>{items.length ? <div className="order-lines">{items.map(({ product, quantity }) => <div key={product.id}><span>{product.name}</span><b>Qty {quantity}</b></div>)}</div> : <p>Add products to your cart and they will be included with this invoice request.</p>}<ol><li>We review your request and selected equipment.</li><li>We confirm availability, delivery, and your final total.</li><li>We send an invoice and the selected payment instructions after approval.</li></ol><div className="invoice-whatsapp"><MessageCircle size={21}/><div><b>Need invoice help?</b><span>Chat with our invoice team on WhatsApp.</span></div><a href={whatsappUrl('Hello SolarHome Energy Backup, I need help with an invoice request.')} target="_blank" rel="noreferrer">{WHATSAPP_PHONE_DISPLAY}</a></div></aside></div></main>;
}
