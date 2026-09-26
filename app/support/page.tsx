/* oxlint-disable next/no-html-link-for-pages -- support-to-invoice navigation must remain available without client routing. */
import { ArrowRight, Mail, MessageCircle } from 'lucide-react';
import { addressLines, business } from '@/lib/business';
import { SUPPORT_HOURS, WARRANTY_TERM, whatsappUrl } from '@/lib/commerce';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Customer Support',
  description:
    'Get help with product compatibility, orders, delivery, returns, and warranty claims. Contact our team by email, phone, or WhatsApp.',
  path: '/support',
});

export default function SupportPage() {
  return <main className="page-shell trust-page"><header><p className="eyebrow">Customer support</p><h1>Help for planning, orders, and product questions.</h1><p>Support is available {SUPPORT_HOURS}. Contact our team by email, phone, or WhatsApp for product compatibility, order updates, delivery, returns, and warranty questions.</p></header><div className="trust-layout"><section><article className="trust-section"><h2>Before ordering</h2><p>Use the System Finder for a starting point, then review the listed product specifications and compatibility details. Home integration should be reviewed with a qualified installer.</p></article><article className="trust-section"><h2>After ordering</h2><p>We confirm availability, your delivery charge, and payment instructions before you pay. Keep your order reference for any follow-up. See the <a href="/shipping-delivery">Shipping & Delivery Policy</a> for processing and delivery times.</p></article><article className="trust-section"><h2>Returns and warranty</h2><p>Eligible products may be returned within 30 days after delivery under our <a href="/returns">Return & Refund Policy</a>. Eligible products also carry our {WARRANTY_TERM} from delivery; see the <a href="/warranty">Warranty Policy</a>. Include the product model and order reference with any request.</p></article><article className="trust-section"><h2>Contact details</h2><p>{business.legalName}, trading as {business.tradingName}</p><p>{addressLines.join(', ')}</p><p>Email: <a href={`mailto:${business.email}`}>{business.email}</a></p><p>Phone: <a href={`tel:${business.phoneE164}`}>{business.phoneDisplay}</a></p></article></section><aside className="aside-card"><MessageCircle size={25}/><h2>Contact our team</h2><p>Send a message for customer support, product questions, or invoice help.</p><a className="button primary" href={whatsappUrl('Hello SolarHome Energy Backup, I need customer support.')} target="_blank" rel="noreferrer">WhatsApp {business.phoneDisplay} <ArrowRight size={16}/></a><a href={`mailto:${business.email}`}><Mail size={15}/> {business.email}</a><a href="/invoice">Request an invoice <ArrowRight size={15}/></a></aside></div></main>;
}
