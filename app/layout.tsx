import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/site-header';
import { StoreUpdates } from '@/components/store-updates';
import { LocaleProvider } from '@/components/locale-provider';
import { SiteFooter } from '@/components/site-footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.solarhomeenergybackup.com'),
  title: { default: 'SolarHome Energy Backup | Solar, Battery & Backup Power', template: '%s | SolarHome Energy Backup' },
  description: 'Shop solar panels, batteries, portable power, and whole-home backup equipment with clear specifications and practical planning support.',
  keywords: ['solar battery backup', 'portable power station', 'home backup power', 'solar panels', 'inverter', 'energy storage'],
  alternates: { canonical: '/' },
  openGraph: { type: 'website', url: 'https://www.solarhomeenergybackup.com', siteName: 'SolarHome Energy Backup', title: 'SolarHome Energy Backup | Solar, Battery & Backup Power', description: 'Solar and backup equipment with clear specifications and practical planning support.' },
  twitter: { card: 'summary_large_image', title: 'SolarHome Energy Backup', description: 'Solar and backup equipment with clear specifications and practical planning support.' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const siteSchema = { '@context': 'https://schema.org', '@type': 'WebSite', name: 'SolarHome Energy Backup', url: 'https://www.solarhomeenergybackup.com', potentialAction: { '@type': 'SearchAction', target: 'https://www.solarhomeenergybackup.com/shop?search={search_term_string}', 'query-input': 'required name=search_term_string' } };
  return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}/><LocaleProvider><SiteHeader/>{children}<SiteFooter/><StoreUpdates/></LocaleProvider></body></html>;
}
