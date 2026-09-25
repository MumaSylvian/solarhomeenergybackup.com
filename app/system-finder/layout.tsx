import { pageMetadata } from '@/lib/seo';

// The System Finder is a client component, so its metadata lives here.
export const metadata = pageMetadata({
  title: 'Backup Power System Finder',
  description: 'Answer a few questions about your outage needs, loads, and solar goals to get a starting checklist for a backup power system.',
  path: '/system-finder',
});

export default function SystemFinderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
