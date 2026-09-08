import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gridwell | Backup Power Built for Real Life',
  description: 'Whole-home batteries, solar generators, expandable power stations and energy systems with source-attributed specifications.',
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
