/* oxlint-disable next/no-html-link-for-pages -- footer navigation must remain usable without client routing. */
import Image from 'next/image';
import { addressLines, business } from '@/lib/business';

export function SiteFooter() {
  return <footer className="site-footer">
    <div>
      <a href="/" className="brand footer-logo" aria-label="SolarHome Energy Backup home">
        <Image src="/solarhome-energy-backup-logo.png" alt="SolarHome Energy Backup" width={320} height={107} />
      </a>
      <p>Solar equipment for backup power, solar charging, and home energy storage.</p>
      <address className="footer-contact">
        <strong>{business.legalName}</strong>
        {addressLines.map((line) => <span key={line}>{line}</span>)}
        <a href={`mailto:${business.email}`}>{business.email}</a>
        <a href={`tel:${business.phoneE164}`}>{business.phoneDisplay}</a>
      </address>
    </div>
    <div><h3>Explore</h3><a href="/shop">Power Hub</a><a href="/whole-home-backup">Whole-home backup</a><a href="/portable-power">Portable power</a><a href="/solar-panels">Solar panels</a><a href="/ev-chargers">EV chargers</a><a href="/blog">Backup power guides</a></div>
    <div><h3>Support & policies</h3><a href="/support">Customer support</a><a href="/shipping-delivery">Shipping & delivery</a><a href="/returns">Returns & refunds</a><a href="/warranty">Warranty</a><a href="/payment-options">Payment & billing</a><a href="/privacy">Privacy</a><a href="/cookies">Cookies & tracking</a><a href="/terms">Terms & conditions</a><a href="/invoice">Request an invoice</a></div>
    <small>© 2026 {business.legalName}, trading as {business.tradingName}. Delivery charges and taxes are disclosed before payment.</small>
  </footer>;
}
