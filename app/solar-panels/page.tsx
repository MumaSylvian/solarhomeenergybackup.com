import { CategoryPage } from '@/components/category-page';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: "Solar Panels for Home & Portable Power",
  description:
    "Solar panels and charging equipment for portable power stations, home battery storage, and fixed rooftop or ground-mount solar systems.",
  path: '/solar-panels',
});

export default function SolarPanelsPage() { return <CategoryPage category="Solar panels" eyebrow="Solar charging" title="Turn daylight into stored power." copy="Browse solar panels and charging equipment for portable power stations, battery storage, and fixed solar systems." planning="Choose panels around site conditions, compatibility, and your charging goal." useCases={['Confirm the selected panel and power station or charge controller are electrically compatible.', 'Plan for real-world sunlight, available mounting space, cable length, and shading.', 'Use manufacturer documentation and qualified installation help for fixed home installations.']}/>; }
