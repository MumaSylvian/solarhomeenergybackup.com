import Image from 'next/image';
import Link from 'next/link';

export function SiteFooter() {
  return <footer className="site-footer">
    <div>
      <Link href="/" className="brand footer-logo" aria-label="SolarHome Energy Backup home">
        <Image src="/solarhome-energy-backup-logo.png" alt="SolarHome Energy Backup" width={320} height={107} />
      </Link>
      <p>Solar equipment for backup power, solar charging, and home energy storage.</p>
    </div>
    <div><h3>Explore</h3><Link href="/shop">Power Hub</Link><Link href="/whole-home-backup">Whole-home backup</Link><Link href="/portable-power">Portable power</Link><Link href="/solar-panels">Solar panels</Link><Link href="/ev-chargers">EV chargers</Link></div>
    <div><h3>Support & policies</h3><Link href="/support">Support hours</Link><Link href="/shipping-delivery">Shipping & delivery</Link><Link href="/warranty">Warranty</Link><Link href="/returns">Returns & refunds</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/payment-options">Payment options</Link><Link href="/invoice">Request an invoice</Link></div>
    <small>Availability, delivery windows, product suitability, and installation requirements are confirmed before purchase.</small>
  </footer>;
}
