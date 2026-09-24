import type { Metadata } from 'next';
import { LegacyProductRedirect } from './legacy-redirect';

// Old product URLs; hosting redirects these too (see vercel.json).
export const metadata: Metadata = { robots: { index: false, follow: true } };

export default function LegacyProductPage() {
  return <LegacyProductRedirect />;
}
