import { Storefront } from '@/components/storefront';
import { HomeFeatured } from '@/components/home-featured';
import { CategoryShowcase } from '@/components/category-showcase';
import { pageMetadata } from '@/lib/seo';

export const metadata = {
  ...pageMetadata({
  title: "Solar, Battery & Home Backup Power Equipment",
  description:
    "Shop solar panels, home batteries, portable power stations, and whole-home backup systems with clear specifications and planning support.",
  path: '/',
  }),
  // The homepage carries the full brand title instead of the page template.
  title: { absolute: 'SolarHome Energy Backup | Solar, Battery & Backup Power' },
};


export default function HomePage() {
  return <><Storefront /><CategoryShowcase /><HomeFeatured /></>;
}
