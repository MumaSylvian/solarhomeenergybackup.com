import { Storefront } from '@/components/storefront';
import { HomeFeatured } from '@/components/home-featured';
import { CategoryShowcase } from '@/components/category-showcase';

export default function HomePage() {
  return <><Storefront /><CategoryShowcase /><HomeFeatured /></>;
}
