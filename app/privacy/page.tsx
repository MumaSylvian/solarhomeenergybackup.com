import { TrustPage } from '@/components/trust-page';
import { addressLines, business } from '@/lib/business';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Privacy Policy',
  description:
    'What personal information Solar Home Energy Backup collects, how it is used and shared, how it is protected, and the privacy choices available to you.',
  path: '/privacy',
});

// Text supplied by the business (effective September 26, 2026). Edit wording
// only with the owner's approval; update "Last Updated" whenever it changes.
export default function PrivacyPage() {
  return (
    <TrustPage
      eyebrow="Privacy policy · Effective Date: September 26, 2026 · Last Updated: September 26, 2026"
      title="Privacy Policy"
      intro={[
        `${business.legalName}, doing business as ${business.tradingName} ("${business.tradingName}," "we," "us," or "our"), operates https://www.solarhomeenergybackup.com/.`,
        'This Privacy Policy explains what personal information we collect, how we use it, when it may be disclosed, how it is protected, and the choices that may be available to you.',
      ]}
      sections={[
        {
          title: '1. Information we collect',
          body: 'Depending on how you interact with us, we may collect:',
          items: ['Name.', 'Email address.', 'Telephone number.', 'Billing address.', 'Shipping or delivery address.', 'Order information.', 'Product information.', 'Payment status and transaction information.', 'Shipping and freight information.', 'Return, refund, and warranty information.', 'Communications you send to us.', 'IP address.', 'Browser and device information.', 'Technical and security information reasonably necessary to operate our website.'],
        },
        {
          title: '2. Payment information',
          body: 'Solar Home Energy Backup currently accepts payment methods that may include:',
          items: ['Bank or wire transfer.', 'Zelle.', 'Cash App.', 'Chime.', 'Apple Pay.', 'Bitcoin.'],
          after: [
            "Solar Home Energy Backup does not store customers' full debit-card or credit-card information on its website.",
            'Banks, payment services, cryptocurrency networks, financial institutions, and other payment providers may separately process information according to their own privacy and security practices.',
            'We may receive or maintain limited transaction information necessary to confirm a payment, including payment status, transaction references, transfer information, or cryptocurrency transaction identifiers where applicable.',
          ],
        },
        {
          title: '3. How we collect information',
          body: 'We may collect information:',
          items: ['Directly from you when you contact us.', 'When you place an order.', 'When you make or confirm payment.', 'When you communicate with customer support.', 'When you request delivery or freight service.', 'When you request a return or refund.', 'When you submit a warranty claim.', 'Automatically through necessary website and security technologies.', 'From financial institutions and payment providers.', 'From freight carriers and transportation companies.', 'From manufacturers or suppliers involved in fulfilling or supporting your order.'],
        },
        {
          title: '4. How we use information',
          body: 'We may use personal information to:',
          items: ['Process and fulfill orders.', 'Confirm payments.', 'Arrange freight and delivery.', 'Calculate delivery charges.', 'Provide shipment and tracking information.', 'Communicate regarding transactions.', 'Provide customer support.', 'Process returns and refunds.', 'Administer warranties.', 'Prevent fraud and unauthorized transactions.', 'Maintain website security.', 'Maintain accounting and business records.', 'Comply with applicable legal and regulatory obligations.', 'Operate and improve our business.'],
        },
        {
          title: '5. Sharing of information',
          body: 'We may disclose information where reasonably necessary to:',
          items: ['Banks and financial institutions.', 'Payment services.', 'Cryptocurrency payment services where applicable.', 'Freight carriers and transportation providers.', 'Manufacturers and suppliers.', 'Website hosting and infrastructure providers.', 'Technology and security providers.', 'Accounting, insurance, legal, and other professional advisers.', 'Government authorities where disclosure is legally required.'],
          after: [
            "Solar Home Energy Backup does not sell customers' personal information.",
            'We do not currently share customer personal information with advertising companies for cross-context behavioral advertising.',
          ],
        },
        {
          title: '6. Analytics and advertising tracking',
          body: 'Solar Home Energy Backup does not currently use:',
          items: ['Google Analytics.', 'Google Ads tracking.', 'Meta/Facebook Pixel.', 'TikTok advertising tracking.', 'Microsoft Advertising tracking.', 'Other disclosed behavioral-advertising tracking systems.'],
          after: 'If these practices change, this Privacy Policy and any applicable tracking notice will be updated.',
        },
        {
          title: '7. Marketing communications',
          body: [
            'Solar Home Energy Backup does not currently use customer information for promotional email or SMS marketing campaigns.',
            'We may still send transactional communications concerning:',
          ],
          items: ['Orders.', 'Payments.', 'Shipping.', 'Delivery.', 'Returns.', 'Refunds.', 'Warranties.', 'Customer-service requests.'],
        },
        {
          title: '8. Data security',
          body: [
            'We use reasonable administrative, technical, and organizational measures designed to protect personal information against unauthorized access, misuse, loss, alteration, or disclosure.',
            'Our website uses appropriate security measures for information transmitted through protected website pages.',
            "Solar Home Energy Backup does not store customers' full payment-card information.",
            'No internet transmission or electronic storage system can be guaranteed to be completely secure.',
          ],
        },
        {
          title: '9. Data retention',
          body: 'Personal information may be retained for as long as reasonably necessary for:',
          items: ['Order fulfillment.', 'Payment confirmation.', 'Freight and delivery.', 'Returns and refunds.', 'Warranty administration.', 'Customer service.', 'Accounting and tax requirements.', 'Fraud prevention.', 'Dispute resolution.', 'Legal compliance.'],
          after: 'When information is no longer reasonably necessary, we may delete, anonymize, or otherwise securely dispose of it.',
        },
        {
          title: '10. Your privacy rights',
          body: [
            'Depending on applicable law and your location, you may have rights relating to your personal information.',
            'These may include rights to request:',
          ],
          items: ['Access.', 'Correction.', 'Deletion.', 'A copy of certain information.', 'Restriction of certain processing.', 'Objection to certain uses.'],
          after: [
            'We may take reasonable steps to verify your identity before completing certain requests.',
            `Privacy requests may be submitted to: ${business.email}`,
          ],
        },
        {
          title: "11. Children's privacy",
          body: [
            'Our website is intended for a general commercial audience and is not intentionally directed toward children.',
            'We do not knowingly collect personal information from children in circumstances prohibited by applicable law.',
          ],
        },
        {
          title: '12. Third-party services',
          body: [
            'Our business may involve independent third parties such as banks, payment services, manufacturers, suppliers, freight carriers, cryptocurrency networks, and technology providers.',
            'Those third parties may process information under their own privacy policies and legal obligations.',
          ],
        },
        {
          title: '13. Changes to this Privacy Policy',
          body: [
            'We may update this Privacy Policy when our website, technology, business practices, or legal obligations change.',
            'The Last Updated date above identifies the current version.',
          ],
        },
        {
          title: '14. Contact us',
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
