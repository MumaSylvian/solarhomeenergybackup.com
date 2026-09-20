'use client';

import { MessageCircle } from 'lucide-react';
import { WHATSAPP_PHONE_DISPLAY, whatsappUrl } from '@/lib/commerce';

export function StoreUpdates() {
  return <a className="whatsapp-contact" href={whatsappUrl('Hello SolarHome Energy Backup, I need help with my order or system plan.')} target="_blank" rel="noreferrer" aria-label={`Chat with SolarHome support on WhatsApp at ${WHATSAPP_PHONE_DISPLAY}`}><MessageCircle size={22}/><span>WhatsApp chat</span></a>;
}
