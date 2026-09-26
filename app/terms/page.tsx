import { TrustPage } from '@/components/trust-page';
import { addressLines, business } from '@/lib/business';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Terms & Conditions',
  description:
    'Terms governing use of our website and purchases from SolarHome Energy Backup LLC: orders, payment, delivery, returns, warranties, and governing law.',
  path: '/terms',
});

// Text supplied by the business (effective September 26, 2026). Edit wording
// only with the owner's approval; update "Last Updated" whenever it changes.
export default function TermsPage() {
  const contact = [
    business.legalName,
    `Trading as ${business.tradingName}`,
    ...addressLines,
    `Email: ${business.email}`,
    `Phone: ${business.phoneDisplay}`,
    'Website: https://www.solarhomeenergybackup.com/',
  ];
  return (
    <TrustPage
      eyebrow="Terms & conditions · Effective Date: September 26, 2026 · Last Updated: September 26, 2026"
      title="Terms & Conditions"
      intro={[
        `These Terms & Conditions govern the use of https://www.solarhomeenergybackup.com/ and purchases from ${business.legalName}, trading as ${business.tradingName}.`,
        'By using our website or completing a purchase, you agree to these Terms to the extent permitted by applicable law.',
      ]}
      sections={[
        {
          title: '1. Business information',
          body: [
            `Legal Entity: ${business.legalName}`,
            `Trading Name: ${business.tradingName}`,
            `Address: ${addressLines.join(', ')}`,
            `Email: ${business.email}`,
            `Phone: ${business.phoneDisplay}`,
            'Website: https://www.solarhomeenergybackup.com/',
          ],
        },
        {
          title: '2. Eligibility',
          body: [
            'Customers must be legally capable of entering into the applicable transaction.',
            'Solar Home Energy Backup does not currently impose an additional general minimum-purchase age beyond applicable legal requirements.',
          ],
        },
        {
          title: '3. Product information',
          body: ['We make reasonable efforts to accurately describe the products offered through our website.', 'Product information may include:'],
          items: ['Product specifications.', 'Capacity.', 'Power output.', 'Battery specifications.', 'Compatibility.', 'Dimensions.', 'Weight.', 'Warranty information.', 'Product images.'],
          after: 'Certain technical specifications may originate from the applicable manufacturer.',
        },
        {
          title: '4. Product suitability',
          body: [
            'Customers are responsible for ensuring that a product is suitable for their intended application.',
            'Electrical, battery, solar, inverter, backup-power, or related equipment may require professional installation or compatibility verification.',
            'Customers should follow applicable manufacturer instructions and electrical-safety requirements.',
          ],
        },
        {
          title: '5. Pricing',
          body: [
            'Prices are displayed in United States Dollars unless otherwise stated.',
            'Applicable delivery charges and taxes will be disclosed before the customer completes payment.',
          ],
        },
        {
          title: '6. Orders',
          body: [
            'Submitting an order does not automatically guarantee acceptance.',
            'An order becomes accepted when payment has been made and confirmed by Solar Home Energy Backup.',
          ],
        },
        {
          title: '7. Order refusal',
          body: 'Solar Home Energy Backup may decline or cancel an order where reasonably necessary, including because of:',
          items: ['Payment failure.', 'Payment-verification problems.', 'Product unavailability.', 'Obvious pricing errors.', 'Technical errors.', 'Suspected fraud.', 'Delivery restrictions.', 'Legal restrictions.'],
        },
        {
          title: '8. Payment',
          body: 'Depending on the transaction, accepted payment methods may include:',
          items: ['Bank transfer.', 'Wire transfer.', 'Zelle.', 'Cash App.', 'Chime.', 'Apple Pay.', 'Bitcoin.'],
          after: 'Payment practices are governed by our Payment & Billing Policy.',
        },
        {
          title: '9. Delivery fees',
          body: [
            'Delivery within the United States is a flat $45 per order.',
            'International delivery charges are calculated based on the destination and will be disclosed before payment.',
          ],
        },
        {
          title: '10. Shipping',
          body: [
            'Orders are generally processed within 1–3 business days after payment.',
            'Typical delivery is approximately 5–7 business days after dispatch.',
            'Shipping and delivery are governed by our Shipping & Delivery Policy.',
          ],
        },
        {
          title: '11. International orders',
          body: [
            'International delivery may be available where freight service can be arranged.',
            'International customers are responsible for applicable customs duties, import taxes, brokerage fees, and other destination-country charges unless expressly stated otherwise.',
          ],
        },
        {
          title: '12. Returns',
          body: [
            'Eligible returns are governed by our Return & Refund Policy.',
            'Eligible products may generally be returned within 30 days after delivery when returned in their original condition.',
          ],
        },
        { title: '13. Refunds', body: 'Approved refunds are generally processed within 1–7 business days after an eligible return has been received and approved.' },
        {
          title: '14. Cancellations',
          body: ['Orders may be cancelled before shipment.', 'Once an order has shipped, the Return & Refund Policy applies.'],
        },
        {
          title: '15. Exchanges',
          body: ['Solar Home Energy Backup does not currently offer direct exchanges.', 'Customers may return an eligible product and place a new order.'],
        },
        {
          title: '16. Warranties',
          body: 'Eligible products may include:',
          items: ['A 30-day limited warranty provided by Solar Home Energy Backup.', 'Manufacturer warranty coverage that varies by product and manufacturer.'],
          after: 'See our Warranty Policy for additional information.',
        },
        { title: '17. Customer accounts', body: 'Solar Home Energy Backup does not currently require customers to create an online account to place an order.' },
        {
          title: '18. Customer pickup',
          body: [
            'Customer pickup may be available where arrangements are confirmed in advance.',
            'Customers should not travel to collect an order until Solar Home Energy Backup confirms that it is ready.',
          ],
        },
        {
          title: '19. Product installation and use',
          body: 'Customers are responsible for using products according to:',
          items: ['Manufacturer instructions.', 'Applicable electrical codes.', 'Installation instructions.', 'Safety requirements.', 'Applicable laws and regulations.'],
          after: 'Where professional installation is recommended or required, customers should use appropriately qualified personnel.',
        },
        {
          title: '20. Intellectual property',
          body: [
            'Original website content owned by SolarHome Energy Backup LLC, including branding, logos, graphics, designs, and original written material, may be protected by applicable intellectual-property laws.',
            'Use of the website does not transfer ownership of that intellectual property.',
          ],
        },
        {
          title: '21. Acceptable use',
          body: 'You may not use the website to:',
          items: ['Commit fraud.', 'Conduct unlawful activity.', 'Attempt unauthorized system access.', 'Introduce malicious software.', 'Interfere with website operation.', "Infringe another person's rights.", 'Provide deliberately false transaction information.'],
        },
        {
          title: '22. Third-party services',
          body: 'Transactions may involve independent third parties including:',
          items: ['Manufacturers.', 'Suppliers.', 'Freight carriers.', 'Financial institutions.', 'Payment providers.', 'Cryptocurrency networks.', 'Technology providers.'],
          after: 'Their services may be governed by separate terms and privacy practices.',
        },
        {
          title: '23. Events outside our control',
          body: 'Solar Home Energy Backup is not responsible for delays caused by circumstances outside our reasonable control, including:',
          items: ['Severe weather.', 'Freight disruption.', 'Customs delays.', 'Transportation-network interruptions.', 'Supplier disruption.', 'Natural disasters.', 'Labor disputes.', 'Government restrictions.'],
        },
        { title: '24. Consumer rights', body: 'Nothing in these Terms excludes or limits rights or remedies that cannot legally be excluded.' },
        {
          title: '25. Governing law',
          body: 'These Terms are governed by the laws of the State of Louisiana and applicable federal law, subject to any mandatory consumer protections that apply.',
        },
        {
          title: '26. Disputes',
          body: 'Unless applicable law requires otherwise, disputes relating to these Terms, the website, or transactions with Solar Home Energy Backup may be brought before a court of competent jurisdiction in the State of Louisiana.',
        },
        {
          title: '27. Severability',
          body: 'If any provision of these Terms is found invalid or unenforceable, the remaining provisions will continue to apply to the extent legally permitted.',
        },
        {
          title: '28. Changes to these Terms',
          body: ['Solar Home Energy Backup may update these Terms from time to time.', 'The Last Updated date above identifies the current version.'],
        },
        { title: '29. Contact', body: contact },
      ]}
    />
  );
}
