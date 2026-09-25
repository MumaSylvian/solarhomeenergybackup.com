import { CategoryPage } from '@/components/category-page';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: "Portable Power Stations",
  description:
    "Portable power stations from EcoFlow, Anker SOLIX, BLUETTI, and more for outages, RVs, job sites, and camping. Compare capacity and output.",
  path: '/portable-power',
});

export default function PortablePowerPage() { return <CategoryPage category="Portable power" eyebrow="Portable power" title="Reliable energy that moves with you." copy="Find portable stations for outage readiness, travel, remote work, and everyday power where an outlet is not an option." planning="Match the station to the devices you actually use." useCases={['Add the running watts of the equipment you expect to power at the same time.', 'Use battery capacity to estimate your desired runtime, allowing room for real-world losses.', 'Check the required plugs, charging inputs, and weight before choosing a portable setup.']}/>; }
