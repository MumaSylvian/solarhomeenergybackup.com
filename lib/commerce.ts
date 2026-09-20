export const SUPPORT_HOURS = 'Monday–Saturday, 9:00 AM–5:00 PM Pacific Time';
export const WARRANTY_TERM = '6-month limited warranty';
export const WHATSAPP_PHONE_DISPLAY = '+1 (938) 263-4728';
export const WHATSAPP_URL = 'https://wa.me/19382634728';

export function whatsappUrl(message: string) {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
}

export const deliveryOptions = {
  priority: { label: 'Priority delivery', window: '2–3 business days' },
  express: { label: 'Express delivery', window: '4–7 business days' },
} as const;

export type DeliveryOption = keyof typeof deliveryOptions;

export const paymentOptions = [
  {
    id: 'zelle',
    label: 'Zelle',
    detail: 'Payment details are sent after the order is confirmed.',
  },
  {
    id: 'apple-pay',
    label: 'Apple Pay',
    detail: 'Available after Apple Pay merchant verification is completed.',
  },
  {
    id: 'bank-transfer',
    label: 'Bank transfer',
    detail: 'Secure bank instructions are sent after order confirmation.',
  },
  {
    id: 'bitcoin',
    label: 'Bitcoin',
    detail:
      'A wallet address and payment amount are sent after order confirmation.',
  },
] as const;

/** Price rules are kept here so listing, cart, checkout, and invoice totals agree. */
export function discountPercentFor(sourcePrice: number | null | undefined) {
  if (sourcePrice === null || sourcePrice === undefined || sourcePrice < 0)
    return 0;
  if (sourcePrice <= 500) return 10;
  if (sourcePrice <= 1000) return 15;
  if (sourcePrice <= 5000) return 20;
  return 25;
}

export function discountedPriceFor(sourcePrice: number | null | undefined) {
  if (sourcePrice === null || sourcePrice === undefined || sourcePrice < 0)
    return null;
  return (
    Math.round(
      sourcePrice * (1 - discountPercentFor(sourcePrice) / 100) * 100,
    ) / 100
  );
}

export function shippingFor(subtotal: number) {
  return subtotal >= 2000 ? 0 : Math.round(subtotal * 0.1 * 100) / 100;
}

export function shippingPolicyFor(subtotal: number) {
  return subtotal >= 2000
    ? 'Free shipping on this order.'
    : 'Shipping is 10% of the merchandise subtotal. Orders of $2,000 or more ship free.';
}
