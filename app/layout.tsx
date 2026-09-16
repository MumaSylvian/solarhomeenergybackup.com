import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/site-header';
import { StoreUpdates } from '@/components/store-updates';
import { LocaleProvider } from '@/components/locale-provider';
import { SiteFooter } from '@/components/site-footer';

export const metadata: Metadata = {
  title: 'SolarHome Energy Backup | Power Today. A Brighter Tomorrow.',
  description: 'Solar and backup equipment with clear specifications, practical planning tools, and direct product paths.',
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><LocaleProvider><SiteHeader/>{children}<SiteFooter/><StoreUpdates/></LocaleProvider></body></html>;
}
