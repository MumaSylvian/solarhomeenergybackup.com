export const SUPPORT_HOURS = 'Monday–Saturday, 9:00 AM–5:00 PM Pacific Time';
export const WARRANTY_TERM = '6-month limited warranty';

export const deliveryOptions = {
  priority: { label: 'Priority delivery', window: '2–3 business days' },
  express: { label: 'Express delivery', window: '4–7 business days' },
} as const;

export type DeliveryOption = keyof typeof deliveryOptions;

export const paymentOptions = [
  { id: 'zelle', label: 'Zelle', detail: 'Payment details are sent after the order is confirmed.' },
  { id: 'apple-pay', label: 'Apple Pay', detail: 'Available after Apple Pay merchant verification is completed.' },
  { id: 'bank-transfer', label: 'Bank transfer', detail: 'Secure bank instructions are sent after order confirmation.' },
  { id: 'bitcoin', label: 'Bitcoin', detail: 'A wallet address and payment amount are sent after order confirmation.' },
] as const;

export function shippingFor(subtotal: number) {
  return subtotal >= 1000 ? 0 : Math.round(subtotal * 0.2 * 100) / 100;
}
