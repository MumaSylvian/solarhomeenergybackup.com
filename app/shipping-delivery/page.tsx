import { TrustPage } from '@/components/trust-page';
import { addressLines, business } from '@/lib/business';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Shipping & Delivery Policy',
  description:
    'We ship to all 50 states and the United Kingdom, Canada, Australia, and France. Orders are handled within 1 business day before dispatch; carrier transit is free and typically takes 2–7 business days after dispatch.',
  path: '/shipping-delivery',
});

// Text supplied by the business (effective September 26, 2026). Delivery
// terms shown elsewhere (checkout, product pages) must match this page; they
// read their wording from lib/commerce.ts.
export default function ShippingDeliveryPage() {
  return (
    <TrustPage
      eyebrow="Shipping & delivery policy · Effective Date: October 8, 2026 · Last Updated: October 8, 2026"
      title="Shipping & Delivery Policy"
      intro={[
        'This Shipping & Delivery Policy explains how Solar Home Energy Backup processes and delivers customer orders.',
        `Orders ship from our warehouse in ${business.shipsFrom}.`,
      ]}
      sections={[
        {
          title: '1. U.S. shipping',
          body: [
            'Solar Home Energy Backup currently ships throughout all 50 United States.',
            'Shipping may also be available to eligible U.S. territories.',
          ],
        },
        {
          title: '2. International shipping',
          body: [
            'We currently ship to the United Kingdom, Canada, Australia, and France.',
            'Shipping is free. Orders are handled within 1 business day before dispatch, then carrier transit typically takes 2–7 business days after dispatch, subject to customs clearance and carrier availability.',
            'International customers are responsible for applicable:',
          ],
          items: ['Customs duties.', 'Import taxes.', 'Brokerage charges.', 'Government assessments.', 'Other destination-country import charges.'],
          after: 'These amounts are separate from our product and delivery charges unless expressly stated otherwise.',
        },
        {
          title: '3. Delivery addresses',
          body: 'Delivery may be available to:',
          items: ['Residential addresses.', 'Commercial addresses.', 'PO Boxes where the applicable carrier and product type permit.', 'APO/FPO addresses where carrier service is available.'],
          after: [
            'Large freight products may require a physical address suitable for commercial freight delivery.',
            'If an address cannot be serviced by the applicable freight carrier, we will contact the customer to arrange an alternative delivery method or address where possible.',
          ],
        },
        {
          title: '4. Delivery fees',
          body: [
            'Shipping to the United States, United Kingdom, Canada, Australia, and France is free.',
            'Any customs, tax, brokerage, or government charges are separate from shipping and are paid by the customer.',
          ],
        },
        {
          title: '5. Order processing',
          body: ['Orders are generally handled within 1 business day after payment has been received.', 'Processing may include:'],
          items: ['Payment confirmation.', 'Order verification.', 'Product preparation.', 'Freight coordination.', 'Shipping documentation.', 'Dispatch scheduling.'],
          after: 'Weekends and recognized holidays may affect processing times.',
        },
        {
          title: '6. Delivery estimates',
          body: [
            'Carrier transit to all supported markets is typically approximately 2–7 business days after dispatch. Including the normal 1 business-day handling period before dispatch, the overall order-to-delivery estimate is approximately 3–8 business days.',
            'Delivery estimates are not guaranteed arrival dates unless Solar Home Energy Backup expressly provides a guaranteed delivery commitment in writing.',
          ],
        },
        {
          title: '7. Freight delivery',
          body: [
            'Solar Home Energy Backup primarily uses freight transportation for applicable products.',
            'Large products may require commercial freight delivery.',
          ],
        },
        {
          title: '8. Curbside delivery',
          body: [
            'Unless otherwise agreed, freight delivery may be curbside.',
            'Curbside delivery generally means that the carrier delivers the product to an accessible location at or near the delivery address.',
            'The carrier may not be required to:',
          ],
          items: ['Carry products inside a building.', 'Move products into a garage.', 'Carry products upstairs.', 'Install products.', 'Assemble products.', 'Move products through restricted access areas.'],
          after: 'Customers should arrange appropriate assistance where necessary.',
        },
        {
          title: '9. Delivery access',
          body: ['Customers are responsible for informing us of access restrictions that may affect freight delivery.', 'Examples include:'],
          items: ['Narrow roads.', 'Gates.', 'Low bridges.', 'Unpaved roads.', 'Weight restrictions.', 'Limited turning space.', 'Restricted commercial access.'],
        },
        {
          title: '10. Tracking',
          body: ['Tracking or freight information will be provided where available.', 'Information may include:'],
          items: ['Tracking number.', 'Freight reference.', 'Carrier information.', 'Shipment status.', 'Delivery estimate.'],
        },
        {
          title: '11. Delivery appointments',
          body: [
            'Freight carriers may contact customers directly to coordinate delivery.',
            'An adult may be required to be present to receive or sign for certain freight shipments.',
          ],
        },
        {
          title: '12. Customer pickup',
          body: [
            'Customer pickup is available when confirmed with Solar Home Energy Backup in advance.',
            'Do not travel to collect an order until we confirm that the product is ready.',
          ],
        },
        {
          title: '13. Damaged shipments',
          body: [
            'Customers should inspect freight and packaging when reasonably possible upon delivery.',
            'Visible or concealed damage must be reported to Solar Home Energy Backup within 3 days after delivery.',
            'Photographs, video, freight documents, or other supporting information may be required.',
          ],
        },
        {
          title: '14. Address accuracy',
          body: [
            'Customers are responsible for providing accurate and complete delivery information.',
            'Contact us promptly if an address needs to be corrected.',
            'Address changes may not be possible after dispatch.',
          ],
        },
        {
          title: '15. Delays',
          body: 'Shipping may be affected by circumstances outside our reasonable control, including:',
          items: ['Severe weather.', 'Freight congestion.', 'Transportation disruption.', 'Customs processing.', 'Road closures.', 'Natural disasters.', 'Government restrictions.', 'Carrier scheduling.'],
        },
        {
          title: '16. Contact',
          body: [
            business.legalName,
            `Trading as ${business.tradingName}`,
            ...addressLines,
            `Email: ${business.email}`,
            `Phone: ${business.phoneDisplay}`,
            'Website: https://www.solarhomeenergybackup.com/',
          ],
        },
      ]}
    />
  );
}
