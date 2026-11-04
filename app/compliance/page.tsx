import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Product compatibility and compliance documents',
  description: 'How SolarHome verifies voltage, plugs, installation requirements, and country-specific product documentation before dispatch.',
};

export default function CompliancePage() {
  return (
    <main className="page-shell legal-page">
      <p className="eyebrow">Product information</p>
      <h1>Compatibility and compliance documents</h1>
      <p className="lead">Electrical products must match the destination country and the intended installation. We do not claim certification, voltage compatibility, or country eligibility when the manufacturer documentation does not provide it.</p>
      <section>
        <h2>What we verify before dispatch</h2>
        <ul>
          <li>Manufacturer voltage, frequency, plug, and connector information.</li>
          <li>Installation requirements, including electrician or permit requirements where stated by the manufacturer.</li>
          <li>Available manufacturer certification, safety, and conformity documents for the destination market.</li>
          <li>Whether the selected model is suitable for the customer’s country and intended use.</li>
        </ul>
      </section>
      <section>
        <h2>When documentation is missing</h2>
        <p>The product remains listed with the missing information clearly identified. We ask the customer to request compatibility confirmation before payment, and we do not represent the product as certified or approved for a country without supporting evidence.</p>
      </section>
      <section>
        <h2>Request a product file</h2>
        <p>Send the product name, destination country, and intended installation to customer support. We will provide the available specification, voltage, plug, and certification documents before the order is confirmed.</p>
        <Link className="button button-primary" href="/support">Contact customer support</Link>
      </section>
    </main>
  );
}
