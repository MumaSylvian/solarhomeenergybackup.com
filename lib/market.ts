/**
 * Country markets used by the storefront, product feeds, and price display.
 *
 * Catalog source prices are stored in USD. The rates below are deliberately
 * versioned so a feed rebuild is reproducible; refresh them before a future
 * commercial price change. Rates are based on the 2026-10-12 ECB reference
 * snapshot for EUR, GBP, PLN, and AUD, with the USD-pegged Gulf currencies
 * represented by their published pegs.
 */
export const markets = [
  { code: 'US', country: 'US', language: 'en', locale: 'en-US', currency: 'USD', rateFromUsd: 1, label: 'United States · USD' },
  { code: 'GB', country: 'GB', language: 'en', locale: 'en-GB', currency: 'GBP', rateFromUsd: 0.7555, label: 'United Kingdom · GBP' },
  { code: 'AU', country: 'AU', language: 'en', locale: 'en-AU', currency: 'AUD', rateFromUsd: 1.4328, label: 'Australia · AUD' },
  { code: 'DE', country: 'DE', language: 'de', locale: 'de-DE', currency: 'EUR', rateFromUsd: 0.8944, label: 'Deutschland · EUR' },
  { code: 'IT', country: 'IT', language: 'it', locale: 'it-IT', currency: 'EUR', rateFromUsd: 0.8944, label: 'Italia · EUR' },
  { code: 'KW', country: 'KW', language: 'ar', locale: 'ar-KW', currency: 'KWD', rateFromUsd: 0.3067, label: 'الكويت · KWD' },
  { code: 'NL', country: 'NL', language: 'nl', locale: 'nl-NL', currency: 'EUR', rateFromUsd: 0.8944, label: 'Nederland · EUR' },
  { code: 'PL', country: 'PL', language: 'pl', locale: 'pl-PL', currency: 'PLN', rateFromUsd: 3.9200, label: 'Polska · PLN' },
  { code: 'SA', country: 'SA', language: 'ar', locale: 'ar-SA', currency: 'SAR', rateFromUsd: 3.75, label: 'السعودية · SAR' },
  { code: 'AE', country: 'AE', language: 'ar', locale: 'ar-AE', currency: 'AED', rateFromUsd: 3.6725, label: 'الإمارات · AED' },
] as const;

export type MarketCode = (typeof markets)[number]['code'];
export type Market = (typeof markets)[number];

export const defaultMarket: MarketCode = 'US';

export function marketFor(code: string | null | undefined): Market {
  return markets.find((market) => market.code === code) ?? markets[0];
}

export function marketForLanguage(language: string | null | undefined): Market {
  const normalized = (language ?? '').toLowerCase();
  return markets.find((market) => market.language === normalized) ?? markets[0];
}

export function convertUsd(amount: number, market: Market | MarketCode) {
  const target = typeof market === 'string' ? marketFor(market) : market;
  return Math.round(amount * target.rateFromUsd * 100) / 100;
}

export function formatMarketPrice(amount: number, market: Market | MarketCode) {
  const target = typeof market === 'string' ? marketFor(market) : market;
  return new Intl.NumberFormat(target.locale, {
    style: 'currency',
    currency: target.currency,
    maximumFractionDigits: 2,
  }).format(convertUsd(amount, target));
}

export function marketCurrencyAmount(amount: number, market: Market | MarketCode) {
  const target = typeof market === 'string' ? marketFor(market) : market;
  return `${convertUsd(amount, target).toFixed(2)} ${target.currency}`;
}
