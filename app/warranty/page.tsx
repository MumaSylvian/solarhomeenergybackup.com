import { TrustPage } from '@/components/trust-page';
import { addressLines, business } from '@/lib/business';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Warranty Policy',
  description:
    'Our 30-day limited warranty from delivery covers qualifying defects in materials or workmanship; manufacturer warranties may continue after it.',
  path: '/warranty',
});

// Text supplied by the business (effective September 26, 2026). The warranty
// length shown elsewhere reads WARRANTY_TERM from lib/commerce.ts.
export default function WarrantyPage() {
  return (
    <TrustPage
      eyebrow="Warranty policy · Effective Date: September 26, 2026 · Last Updated: September 26, 2026"
      title="Warranty Policy"
      intro="This Warranty Policy applies to eligible products purchased from Solar Home Energy Backup."
      sections={[
        {
          title: '1. Manufacturer warranty',
          body: [
            'Products sold by Solar Home Energy Backup may include warranty coverage provided by the applicable manufacturer.',
            'Manufacturer warranty terms, duration, coverage, exclusions, and claim procedures vary depending on the manufacturer and product.',
            "Customers should review the applicable manufacturer's documentation for specific coverage.",
          ],
        },
        {
          title: '2. Solar Home Energy Backup 30-day limited warranty',
          body: [
            'Solar Home Energy Backup provides a 30-day limited warranty on eligible products.',
            'The 30-day warranty period begins on the recorded delivery date.',
          ],
        },
        {
          title: '3. Warranty coverage',
          body: [
            'The Solar Home Energy Backup limited warranty is intended to cover qualifying defects in materials or workmanship that arise during normal and intended use.',
            'Depending on the verified problem, an appropriate remedy may include:',
          ],
          items: ['Repair.', 'Replacement component.', 'Product replacement.', 'Refund.', 'Another appropriate warranty remedy.'],
        },
        {
          title: '4. Warranty exclusions',
          body: 'The Solar Home Energy Backup limited warranty does not cover damage resulting from:',
          items: ['Misuse.', 'Abuse.', 'Unauthorized modifications.', 'Collision or impact damage.', 'Improper installation.', 'Improper maintenance.', 'Use contrary to manufacturer instructions.', 'Customer-caused physical damage.', 'Unauthorized repairs or alterations.'],
          after: 'Normal wear or deterioration that does not result from a covered manufacturing or workmanship defect may also be excluded.',
        },
        {
          title: '5. Manufacturer warranty coverage',
          body: [
            "After the Solar Home Energy Backup 30-day warranty period, eligible products may continue to be protected by the applicable manufacturer's warranty.",
            'Manufacturer warranty duration varies by product and manufacturer.',
          ],
        },
        {
          title: '6. Warranty claims',
          body: ['To request warranty service, contact:', `Email: ${business.email}`, `Phone: ${business.phoneDisplay}`, 'Please provide:'],
          items: ['Order information.', 'Product name and model.', 'Serial number where applicable.', 'Description of the problem.', 'Photographs where relevant.', 'Video where relevant.', 'Any reasonable diagnostic information requested.'],
          after: 'Do not return a product before receiving warranty instructions.',
        },
        {
          title: '7. Warranty transportation',
          body: [
            'Return transportation for a verified claim will depend on the nature of the defect and applicable warranty.',
            'Solar Home Energy Backup will provide return or freight instructions where required.',
          ],
        },
        {
          title: '8. Proof of purchase',
          body: [
            'Proof of purchase may be required for warranty service.',
            'Customers should retain their order confirmation, invoice, receipt, and applicable product documentation.',
          ],
        },
        { title: '9. Statutory rights', body: 'This Warranty Policy does not limit rights or remedies that cannot legally be excluded.' },
        {
          title: '10. Contact',
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
