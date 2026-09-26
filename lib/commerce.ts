/** Confirmed by the owner on 2026-09-26: Central Time, matching the Baton Rouge address. */
export const SUPPORT_HOURS = 'Monday–Saturday, 9:00 AM–5:00 PM Central Time';
/** From the Warranty Policy (effective September 26, 2026). */
export const WARRANTY_TERM = '30-day limited warranty';
export const WARRANTY_SHORT = '30-day warranty';
export const WHATSAPP_PHONE_DISPLAY = '+1 (938) 263-4728';
export const WHATSAPP_URL = 'https://wa.me/19382634728';

export function whatsappUrl(message: string) {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
}

/**
 * Delivery terms from the Shipping & Delivery Policy (effective September 26,
 * 2026). Checkout, invoice, product pages, and the header read these, so they
 * always match the published policy.
 */
export const PROCESSING_TIME = '1–3 business days after payment';
export const DELIVERY_ESTIMATE = 'about 5–7 business days after dispatch';
/** Owner-confirmed on 2026-09-26: flat $45 delivery per order within the United States. */
export const FLAT_DELIVERY_FEE = 45;
export const DELIVERY_FEE_POLICY =
  'Delivery within the United States is a flat $45 per order. International delivery is quoted separately.';

/** Delivery charge for a US order; zero for an empty cart. */
export const deliveryFeeFor = (itemCount: number) => (itemCount > 0 ? FLAT_DELIVERY_FEE : 0);
export const DELIVERY_SUMMARY = `Orders are generally processed within ${PROCESSING_TIME}; typical delivery is ${DELIVERY_ESTIMATE}. ${DELIVERY_FEE_POLICY}`;

/** Accepted methods from the Payment & Billing Policy (effective September 26, 2026). */
export const PAYMENT_METHODS = ['Bank transfer', 'Wire transfer', 'Zelle', 'Cash App', 'Chime', 'Apple Pay', 'Bitcoin'] as const;

/**
 * Crossed-out "was" prices and "Save X%" labels. Off: the struck price is the
 * supplier's price, not a price this store charged, which Google Merchant
 * Center treats as a misleading reference price. Turn on only if the struck
 * price is one we genuinely charged.
 */
export const SHOW_REFERENCE_PRICES = false;

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
