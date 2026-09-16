import { CategoryPage } from '@/components/category-page';

export default function EvChargersPage() {
  return <CategoryPage
    category="EV chargers"
    eyebrow="EV charging"
    title="Charge at home with a clearer energy plan."
    copy="Browse Level 2 chargers and compatible home-energy equipment from the current catalog."
    planning="Plan the circuit, connector, and location before you choose."
    useCases={[
      'Confirm the vehicle connector and charger compatibility.',
      'Review the charging circuit and installation requirements with a qualified installer.',
      'Match the charger to your home-energy equipment and daily driving needs.',
    ]}
  />;
}
