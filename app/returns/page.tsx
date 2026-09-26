import { TrustPage } from '@/components/trust-page';
import { addressLines, business } from '@/lib/business';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Return & Refund Policy',
  description:
    'Return eligible products within 30 days of delivery. No restocking fee, refunds processed in 1–7 business days after inspection, and how to request a return.',
  path: '/returns',
});

// Text supplied by the business (effective September 26, 2026). Edit wording
// only with the owner's approval; update "Last Updated" whenever it changes.
export default function ReturnsPage() {
  const contactLines = [`Email: ${business.email}`, `Phone: ${business.phoneDisplay}`];
  return (
    <TrustPage
      eyebrow="Return & refund policy · Effective Date: September 26, 2026 · Last Updated: September 26, 2026"
      title="Return & Refund Policy"
      intro={`This Return & Refund Policy applies to eligible purchases from ${business.legalName}, trading as ${business.tradingName}.`}
      sections={[
        {
          title: '1. Return window',
          body: [
            'Eligible products may be returned within 30 days after delivery.',
            'The return period begins on the recorded delivery date.',
          ],
        },
        {
          title: '2. Return condition',
          body: [
            'Products must be returned in their original condition to qualify for a standard return.',
            'This generally means the product must be:',
          ],
          items: ['Unmodified.', 'Free from customer-caused damage.', 'Complete with original components.', 'Complete with accessories.', 'Complete with manuals and documentation where applicable.', 'Returned with original packaging where reasonably applicable.'],
          after: 'Products materially damaged, modified, misused, or altered after delivery may not qualify for a standard return.',
        },
        {
          title: '3. Special and custom orders',
          body: 'Custom, special-order, or specially configured products may be eligible for return when they otherwise satisfy this policy.',
        },
        {
          title: '4. How to request a return',
          body: ['To request a return, contact:', ...contactLines, 'Please provide:'],
          items: ['Your order information.', 'Your name.', 'The product being returned.', 'The reason for the return.', 'Photographs or video where reasonably requested.'],
          after: 'Do not return a product before receiving return instructions.',
        },
        {
          title: '5. Return shipping',
          body: [
            'For standard returns, the customer is responsible for return shipping or freight costs.',
            'For a verified damaged, defective, or incorrect product, Solar Home Energy Backup will cover reasonable return transportation costs.',
          ],
        },
        {
          title: '6. Restocking fees',
          body: 'Solar Home Energy Backup does not currently charge a restocking fee for approved returns.',
        },
        {
          title: '7. Refunds',
          body: [
            'After an eligible returned product has been received and inspected, approved refunds are normally processed within 1–7 business days.',
            'Banks, payment services, or financial institutions may require additional time before funds become available to the customer.',
          ],
        },
        {
          title: '8. Refund method',
          body: [
            'Approved refunds will generally be made through an appropriate payment method corresponding to the original transaction or another mutually agreed refund method.',
            'For bank transfers, wire transfers, Zelle, Cash App, Chime, Apple Pay, or Bitcoin transactions, additional verification may be required before a refund is issued.',
          ],
        },
        {
          title: '9. Original shipping and delivery fees',
          body: 'Original shipping, freight, or delivery charges are non-refundable unless required by applicable law or Solar Home Energy Backup expressly agrees otherwise.',
        },
        {
          title: '10. Damaged, defective, or incorrect products',
          body: 'Customers must report products that arrive:',
          items: ['Damaged.', 'Defective.', 'Incomplete.', 'Incorrect.'],
          after: [
            'within a maximum of 3 days after delivery.',
            'Contact us promptly and provide reasonable documentation, which may include: photographs; video; serial numbers; packaging photographs; freight or delivery documentation.',
            'For a verified claim, Solar Home Energy Backup may provide an appropriate remedy such as: repair; replacement; refund; warranty service.',
            'Solar Home Energy Backup will cover reasonable return freight for a verified damaged, defective, or incorrect product.',
          ],
        },
        {
          title: '11. Exchanges',
          body: [
            'Solar Home Energy Backup does not currently offer direct product exchanges.',
            'Customers may return an eligible product according to this policy and place a separate new order.',
          ],
        },
        {
          title: '12. Cancellations',
          body: [
            'Orders may be cancelled before shipment.',
            'Contact us as soon as possible if you need to cancel an order.',
            'Once an order has been shipped, the standard Return & Refund Policy applies.',
          ],
        },
        {
          title: '13. Warranty claims',
          body: 'Defects covered by an applicable manufacturer warranty or Solar Home Energy Backup warranty may be handled under our Warranty Policy.',
        },
        {
          title: '14. Fraud and return abuse',
          body: 'We may refuse a return or refund where reasonably permitted by law if there is evidence of:',
          items: ['Fraud.', 'Product substitution.', 'Deliberate damage.', 'False claims.', 'Abuse of the return process.'],
        },
        {
          title: '15. Statutory rights',
          body: 'Nothing in this policy limits rights or remedies that cannot legally be excluded.',
        },
        {
          title: '16. Contact',
          body: [
            business.legalName,
            `Trading as ${business.tradingName}`,
            ...addressLines,
            ...contactLines,
            'Website: https://www.solarhomeenergybackup.com/',
          ],
        },
      ]}
    />
  );
}
