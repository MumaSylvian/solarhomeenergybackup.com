import type { Metadata } from 'next';

export const siteUrl = 'https://www.solarhomeenergybackup.com';
export const siteName = 'SolarHome Energy Backup';
export const defaultOgImage = {
  url: '/og-default.jpg',
  width: 1200,
  height: 630,
  alt: 'Portable power station, home battery, and folding solar panel outside a home at sunset',
};

/** WhatsApp is the published support channel (see lib/commerce.ts). */
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'OnlineStore',
  '@id': `${siteUrl}/#organization`,
  name: siteName,
  url: siteUrl,
  logo: `${siteUrl}/solarhome-energy-backup-logo.png`,
  image: `${siteUrl}/og-default.jpg`,
  description:
    'Online store for solar panels, home batteries, portable power stations, and whole-home backup power equipment.',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    telephone: '+1-938-263-4728',
    availableLanguage: ['English'],
    hoursAvailable: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '17:00',
    },
  },
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  name: siteName,
  url: siteUrl,
  publisher: { '@id': `${siteUrl}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteUrl}/shop?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

/** Serializes JSON-LD safely for a <script> tag. */
export const jsonLd = (data: unknown) =>
  JSON.stringify(data).replace(/</g, '\\u003c');

type PageSeo = {
  /** Page title; the root layout appends " | SolarHome Energy Backup". */
  title: string;
  /** 120–155 characters: what the page answers or offers. */
  description: string;
  /** Path beginning with "/", used for the self-referencing canonical. */
  path: string;
  /** Keep utility pages (cart, invoice, admin) out of search results. */
  noindex?: boolean;
};

/**
 * Every indexable page needs its own title, description, and self-referencing
 * canonical. Without this, pages inherit the root layout's values and search
 * engines treat them as duplicates of the homepage.
 */
export function pageMetadata({
  title,
  description,
  path,
  noindex,
}: PageSeo): Metadata {
  const url = `${siteUrl}${path === '/' ? '' : path}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      url,
      siteName,
      title,
      description,
      images: [defaultOgImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [defaultOgImage.url],
    },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}
