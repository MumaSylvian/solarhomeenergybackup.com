import { TrustPage } from '@/components/trust-page';
import { addressLines, business } from '@/lib/business';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Cookie & Tracking Notice',
  description:
    'We do not use Google Analytics, ad pixels, or behavioral-advertising tracking. Only technologies needed to run the site, forms, and orders are used.',
  path: '/cookies',
});

// Text supplied by the business (effective September 26, 2026). Update this
// page before adding any analytics, pixel, or remarketing script.
export default function CookiesPage() {
  return (
    <TrustPage
      eyebrow="Cookie & tracking notice · Effective Date: September 26, 2026 · Last Updated: September 27, 2026"
      title="Cookie & Tracking Notice"
      intro="This Cookie & Tracking Notice explains the current use of cookies and similar technologies on https://www.solarhomeenergybackup.com/."
      sections={[
        {
          title: '1. Current tracking practices',
          body: 'Solar Home Energy Backup does not currently use:',
          items: ['Google Analytics.', 'Google Ads tracking.', 'Meta/Facebook Pixel.', 'TikTok advertising tracking.', 'Microsoft Advertising tracking.', 'Other disclosed advertising or behavioral-tracking technologies.'],
        },
        {
          title: '2. Necessary website technologies',
          body: ['Our website is built using Next.js.', 'The website may use technical technologies reasonably necessary for functions such as:'],
          items: ['Website security.', 'Session functionality.', 'Forms.', 'Order processing.', 'Fraud prevention.', 'Technical website operation.'],
          after: 'These technologies are not intended for cross-site behavioral advertising.',
        },
        {
          title: '3. Advertising tracking',
          body: 'Solar Home Energy Backup does not currently use tracking technologies to create behavioral advertising profiles or track customers across unrelated websites for targeted advertising.',
        },
        {
          title: '4. Analytics',
          body: [
            'Solar Home Energy Backup does not currently use Google Analytics or another disclosed analytics platform.',
            'If analytics technologies are added in the future, this notice will be updated.',
          ],
        },
        {
          title: '5. Your browser controls',
          body: [
            'Most browsers allow users to delete, restrict, or block cookies and stored website information.',
            'Disabling technical technologies may affect certain website features.',
          ],
        },
        {
          title: '6. Future technology changes',
          body: [
            'If Solar Home Energy Backup later introduces analytics, advertising pixels, remarketing technologies, or other non-essential tracking technologies, this notice will be updated.',
            'Where required by applicable law, appropriate consent controls will be implemented.',
          ],
        },
        {
          title: '7. Website translation',
          body: [
            'The website is shown in English by default, and nothing is loaded from Google while it is.',
            'If you choose another language from the language menu, the page is translated by Google’s website translation service. Your browser then loads a script from Google, the page text is sent to Google for translation, and a cookie named "googtrans" stores your language choice. Your choice is also saved in your browser’s local storage.',
            'Choosing English again removes the cookie. Machine translations may contain errors; the English version governs prices, product information, and our policies.',
          ],
        },
        { title: '8. Privacy', body: 'For additional information regarding personal information, review our Privacy Policy.' },
        {
          title: '9. Contact',
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
