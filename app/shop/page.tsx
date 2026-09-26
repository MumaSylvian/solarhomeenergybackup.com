import type { Metadata } from 'next';
import { ShopCatalog } from '@/components/shop-catalog';
import { shopIndex } from '@/lib/catalog/shop-index';

export const metadata: Metadata = {
  title: 'Shop solar, battery & backup power equipment',
  description:
    'Browse portable power stations, batteries, solar panels, inverters, and whole-home backup equipment with clear specifications and US dollar pricing.',
  alternates: { canonical: '/shop' },
};

// The catalog is read on the server; the browser receives only the slim shop
// index, never the full generated catalog module.
export default function ShopPage() {
  return <ShopCatalog catalog={shopIndex} />;
}
