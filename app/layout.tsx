import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Voltway Energy | Backup power that fits your life',
  description: 'Whole-home battery backup, solar generators, expandable power stations and solar energy systems.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
