import { TrustPage } from '@/components/trust-page';
import { SHIPPING_POLICY } from '@/lib/commerce';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: "Shipping & Delivery",
  description:
    "Delivery options, timing, and shipping costs: priority delivery in 2–3 business days, express in 4–7, and free shipping on orders of $2,000+.",
  path: '/shipping-delivery',
});

// Shipping cost text comes from lib/commerce.ts, the same values checkout
// charges. Do not restate the rate or threshold here by hand.
export default function ShippingDeliveryPage() { return <TrustPage eyebrow="Shipping & delivery" title="Delivery terms, clearly stated." intro="Availability, delivery timing, and the delivery address are confirmed during order review, before payment instructions are issued. Product pages show “In stock at supplier” only where current supplier data confirms stock." sections={[{ title: 'Delivery choices', body: 'Priority delivery is estimated at 2–3 business days. Express delivery is estimated at 4–7 business days. These estimates begin after an order is confirmed and payment is verified.' }, { title: 'Shipping cost', body: `${SHIPPING_POLICY} Taxes, if applicable, are presented during order review.` }, { title: 'Order confirmation', body: 'We verify product configuration, delivery address, and final availability before scheduling fulfillment. Delivery estimates are not a guarantee and may change for remote locations, carrier disruptions, or installation-related equipment.' }]}/>; }
