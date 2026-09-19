'use client';

import Link from 'next/link';
import { Check, MessageCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { WHATSAPP_PHONE_DISPLAY, whatsappUrl } from '@/lib/commerce';

const updates = [
  { title: 'SolarHome order review', text: 'Availability, delivery timing, and your final total are confirmed before payment.', href: '/invoice' },
  { title: 'Delivery update', text: 'Priority delivery is 2–3 business days. Express delivery is 4–7 business days.', href: '/shipping-delivery' },
  { title: 'Warranty coverage', text: 'Eligible purchases include a 6-month warranty. Review the product page before ordering.', href: '/warranty' },
  { title: 'Planning support', text: 'System planning support is available Monday–Saturday, 9 AM–5 PM Pacific Time.', href: '/support' },
  { title: 'Established business', text: 'Authorized business since 2021, serving customers with solar and backup power equipment.', href: '/support' },
] as const;

export function StoreUpdates() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const show = () => { setVisible(true); window.setTimeout(() => setVisible(false), 12000); };
    const initial = window.setTimeout(show, 75000);
    const cycle = window.setInterval(() => { setIndex((current) => (current + 1) % updates.length); show(); }, 90000);
    return () => { window.clearTimeout(initial); window.clearInterval(cycle); };
  }, []);
  const update = updates[index];
  return <>
    {visible && <aside className="store-update" aria-live="polite"><span className="update-check"><Check size={20}/></span><div><b>{update.title}</b><p>{update.text}</p><Link href={update.href}>Learn more</Link></div><button type="button" onClick={() => setVisible(false)} aria-label="Dismiss update"><X size={17}/></button></aside>}
    <a className="whatsapp-contact" href={whatsappUrl('Hello SolarHome Energy Backup, I need help with my order or system plan.')} target="_blank" rel="noreferrer" aria-label={`Chat with SolarHome support on WhatsApp at ${WHATSAPP_PHONE_DISPLAY}`}><MessageCircle size={22}/><span>WhatsApp chat</span></a>
  </>;
}
