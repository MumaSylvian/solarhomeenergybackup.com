import { TrustPage } from '@/components/trust-page';
import { addressLines, business } from '@/lib/business';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Payment & Billing Policy',
  description:
    'Accepted payment methods (bank or wire transfer, Zelle, Cash App, Chime, Apple Pay, Bitcoin), payment verification, delivery fees, and taxes.',
  path: '/payment-options',
});

// Text supplied by the business (effective September 26, 2026). Edit wording
// only with the owner's approval; update "Last Updated" whenever it changes.
export default function PaymentOptionsPage() {
  return (
    <TrustPage
      eyebrow="Payment & billing policy · Effective Date: September 26, 2026 · Last Updated: September 26, 2026"
      title="Payment & Billing Policy"
      intro="This Payment & Billing Policy explains payment practices for purchases from Solar Home Energy Backup."
      sections={[
        { title: '1. Currency', body: 'Prices displayed on our website are in United States Dollars (USD) unless expressly stated otherwise.' },
        {
          title: '2. Accepted payment methods',
          body: 'Depending on the transaction, Solar Home Energy Backup may accept:',
          items: ['Bank transfer.', 'Wire transfer.', 'Zelle.', 'Cash App.', 'Chime.', 'Apple Pay.', 'Bitcoin.'],
        },
        {
          title: '3. Order acceptance',
          body: [
            'Submitting an order does not guarantee acceptance.',
            'An order becomes accepted when the required payment has been made and confirmed for the transaction.',
          ],
        },
        {
          title: '4. Payment verification',
          body: ['We may verify payments before processing or shipping an order.', 'An order may be delayed, declined, or cancelled where:'],
          items: ['Payment cannot be confirmed.', 'Payment is incomplete.', 'Fraud is reasonably suspected.', 'Payment appears unauthorized.', 'Product availability has changed.', 'Incorrect order information has been provided.'],
        },
        {
          title: '5. Payment security',
          body: [
            "Solar Home Energy Backup does not store customers' full credit-card or debit-card information on its website.",
            'Third-party banks, payment services, digital wallets, or cryptocurrency networks may process transaction information separately.',
          ],
        },
        {
          title: '6. Bank and electronic transfers',
          body: ['Customers should carefully verify payment instructions before sending funds.', 'Payments through:'],
          items: ['Bank transfer.', 'Wire transfer.', 'Zelle.', 'Cash App.', 'Chime.'],
          after: [
            'may be difficult or impossible to reverse after completion.',
            'Only send funds using payment instructions provided through an authorized Solar Home Energy Backup communication channel.',
          ],
        },
        {
          title: '7. Bitcoin payments',
          body: ['Bitcoin transactions are processed through the applicable cryptocurrency network.', 'Customers are responsible for verifying:'],
          items: ['The destination wallet address.', 'The payment amount.', 'The network used.'],
          after: [
            'Blockchain transactions may be irreversible after confirmation.',
            'Approved refunds involving cryptocurrency will be handled according to the applicable transaction and our Return & Refund Policy.',
          ],
        },
        {
          title: '8. Delivery fees',
          body: [
            "Delivery fees apply and are calculated based on the customer's destination.",
            'The applicable delivery charge will be disclosed before payment is completed.',
          ],
        },
        {
          title: '9. Taxes',
          body: [
            "Applicable sales tax may be calculated according to the customer's delivery location and applicable tax requirements.",
            'Applicable taxes will be disclosed before payment is completed where required.',
          ],
        },
        {
          title: '10. Pricing errors',
          body: [
            'We make reasonable efforts to maintain accurate pricing.',
            'If an obvious pricing error is identified before an order is accepted, we may correct the error and notify the customer.',
            'The customer may then decide whether to continue with the corrected transaction.',
          ],
        },
        {
          title: '11. Additional charges',
          body: [
            'Solar Home Energy Backup will not intentionally impose an undisclosed mandatory business charge after a customer has committed to purchase.',
            'International customers may separately be responsible for customs duties, taxes, brokerage charges, and other import-related government or carrier charges.',
          ],
        },
        { title: '12. Refunds', body: 'Approved refunds are governed by our Return & Refund Policy.' },
        {
          title: '13. Contact',
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
