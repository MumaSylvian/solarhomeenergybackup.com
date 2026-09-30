import type { Metadata } from 'next';
// Self-hosted variable fonts (no request to Google Fonts): Inter for text,
// Plus Jakarta Sans for headings. Families are applied in globals.css.
import '@fontsource-variable/inter/wght.css';
import '@fontsource-variable/plus-jakarta-sans/wght.css';
import './globals.css';
import { SiteHeader } from '@/components/site-header';
import { StoreUpdates } from '@/components/store-updates';
import { LocaleProvider } from '@/components/locale-provider';
import { SiteFooter } from '@/components/site-footer';
import { defaultOgImage, jsonLd, organizationSchema, siteName, siteUrl, websiteSchema } from '@/lib/seo';

// Site-wide defaults only. Each page sets its own title, description, and
// canonical via lib/seo.ts; a canonical here would mark every page that
// forgot one as a duplicate of the homepage.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'SolarHome Energy Backup | Solar, Battery & Backup Power', template: '%s | SolarHome Energy Backup' },
  description: 'Shop solar panels, batteries, portable power, and whole-home backup equipment with clear specifications and practical planning support.',
  openGraph: { type: 'website', siteName, images: [defaultOgImage] },
  twitter: { card: 'summary_large_image', images: [defaultOgImage.url] },
  robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd([organizationSchema, websiteSchema]) }}/><a className="skip-link" href="#main-content">Skip to main content</a><LocaleProvider><SiteHeader/><div id="main-content" tabIndex={-1}>{children}</div><SiteFooter/><StoreUpdates/></LocaleProvider></body></html>;
}
