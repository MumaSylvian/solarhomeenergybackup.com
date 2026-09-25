import { TrustPage } from '@/components/trust-page';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: "Shipping & Delivery",
  description:
    "Delivery options, timing, and shipping costs: priority delivery in 2–3 business days, express in 4–7, and free shipping on orders of $2,000+.",
  path: '/shipping-delivery',
});

export default function ShippingDeliveryPage() { return <TrustPage eyebrow="Shipping & delivery" title="Delivery terms, clearly stated." intro="Every product listing is shown as in stock. Delivery timing and delivery address are confirmed during order review before payment instructions are issued." sections={[{ title: 'Delivery choices', body: 'Priority delivery is estimated at 2–3 business days. Express delivery is estimated at 4–7 business days. These estimates begin after an order is confirmed and payment is verified.' }, { title: 'Shipping cost', body: 'For an order subtotal below $1,000, shipping is 20% of the product value. Orders worth $1,000 or more qualify for free shipping. Taxes, if applicable, are presented during order review.' }, { title: 'Order confirmation', body: 'We verify product configuration, delivery address, and final availability before scheduling fulfillment. Delivery estimates are not a guarantee and may change for remote locations, carrier disruptions, or installation-related equipment.' }]}/>; }
