/* oxlint-disable next/no-html-link-for-pages -- footer navigation must remain usable without client routing. */
import Image from 'next/image';
import { addressLines, business } from '@/lib/business';
import { categoryGroups } from '@/lib/catalog/categories';

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
    {categoryGroups.map(({ group, categories }) => (
      <div key={group}>
        <h3>{group}</h3>
        {categories.map((category) => <a key={category.slug} href={category.href}>{category.label}</a>)}
        {group === 'Backup power' && <a href="/shop">Shop all products</a>}
        {group === 'Home appliances' && <a href="/brands">Shop by brand</a>}
      </div>
    ))}
    <div><h3>Help</h3><a href="/support">Customer support</a><a href="/system-finder">System Finder</a><a href="/blog">Backup power guides</a><a href="/shipping-delivery">Shipping & delivery</a><a href="/returns">Returns & refunds</a><a href="/warranty">Warranty</a><a href="/payment-options">Payment & billing</a><a href="/invoice">Request an invoice</a></div>
    <div><h3>Company</h3><a href="/about">About us</a><a href="/privacy">Privacy</a><a href="/terms">Terms & conditions</a><a href="/cookies">Cookies & tracking</a></div>
    <small>© 2026 {business.legalName}, trading as {business.tradingName}. Delivery charges and taxes are disclosed before payment.</small>
  </footer>;
}
