import { TrustPage } from '@/components/trust-page';
import { addressLines, business } from '@/lib/business';
import { DELIVERY_FEE_POLICY, PAYMENT_METHODS, PROCESSING_TIME, SUPPORT_HOURS, WARRANTY_TERM } from '@/lib/commerce';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'About Us',
  description:
    'SolarHome Energy Backup LLC sells backup power equipment and home appliances from its warehouse in Baton Rouge, Louisiana, shipping to all 50 states.',
  path: '/about',
});

// Every statement here was confirmed by the owner (see the business facts
// used for the policies and Merchant Center). Keep it factual: no claims
// about years in business, awards, or reviews unless they are documented.
export default function AboutPage() {
  return (
    <TrustPage
      eyebrow="About us"
      title="Backup power and home appliances, shipped from Baton Rouge."
      intro={[
        `${business.legalName}, trading as ${business.tradingName}, is an online store for solar panels, home batteries, portable power stations, whole-home backup equipment, EV chargers, and home appliances.`,
        'We hold the products we list in our own warehouse in Baton Rouge, Louisiana, and ship them to customers across the United States.',
      ]}
      sections={[
        {
          title: 'Where our stock comes from',
          body: [
            'Much of our inventory is bought as overstock and liquidation stock. That is how we can price many items below typical retail.',
            'Every unit we list is new and sealed.',
          ],
        },
        {
          title: 'How ordering works',
          items: [
            'Add products to your cart and request an invoice. We confirm availability, delivery, and the total with you before you pay.',
            `Accepted payment methods: ${PAYMENT_METHODS.join(', ')}. Payment instructions are sent after your order is confirmed.`,
            `Orders are generally processed within ${PROCESSING_TIME}. ${DELIVERY_FEE_POLICY}`,
          ],
          after: 'See our Shipping & Delivery and Payment & Billing policies for the full terms.',
        },
        {
          title: 'After you buy',
          body: [
            `Eligible products may be returned within 30 days after delivery under our Return & Refund Policy, and they carry our ${WARRANTY_TERM} from delivery.`,
            'For installation of home-integration equipment, we recommend a qualified, licensed electrician.',
          ],
        },
        {
          title: 'Contact us',
          body: [
            business.legalName,
            `Trading as ${business.tradingName}`,
            ...addressLines,
            `Email: ${business.email}`,
            `Phone and WhatsApp: ${business.phoneDisplay}`,
            `Support hours: ${SUPPORT_HOURS}`,
          ],
        },
      ]}
    />
  );
}
