/* oxlint-disable next/no-html-link-for-pages -- footer navigation must remain usable without client routing. */
import Image from 'next/image';

export function SiteFooter() {
  return <footer className="site-footer">
    <div>
      <a href="/" className="brand footer-logo" aria-label="SolarHome Energy Backup home">
        <Image src="/solarhome-energy-backup-logo.png" alt="SolarHome Energy Backup" width={320} height={107} />
      </a>
      <p>Solar equipment for backup power, solar charging, and home energy storage.</p>
    </div>
    <div><h3>Explore</h3><a href="/shop">Power Hub</a><a href="/whole-home-backup">Whole-home backup</a><a href="/portable-power">Portable power</a><a href="/solar-panels">Solar panels</a><a href="/ev-chargers">EV chargers</a></div>
    <div><h3>Support & policies</h3><a href="/support">Support hours</a><a href="/shipping-delivery">Shipping & delivery</a><a href="/warranty">Warranty</a><a href="/returns">Returns & refunds</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/payment-options">Payment options</a><a href="/invoice">Request an invoice</a></div>
    <small>Availability, delivery windows, product suitability, and installation requirements are confirmed before purchase.</small>
  </footer>;
}
