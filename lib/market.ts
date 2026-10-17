/**
 * Country markets used by the storefront, product feeds, and price display.
 *
 * Catalog source prices are stored in USD. The rates below are deliberately
 * versioned so a feed rebuild is reproducible; refresh them before a future
 * commercial price change.
 */
export const markets = [
  { code: 'US', country: 'US', language: 'en', locale: 'en-US', currency: 'USD', rateFromUsd: 1, label: 'United States · USD' },
  { code: 'GB', country: 'GB', language: 'en', locale: 'en-GB', currency: 'GBP', rateFromUsd: 0.7555, label: 'United Kingdom · GBP' },
  { code: 'CA', country: 'CA', language: 'en', locale: 'en-CA', currency: 'CAD', rateFromUsd: 1.3650, label: 'Canada · CAD' },
  { code: 'AU', country: 'AU', language: 'en', locale: 'en-AU', currency: 'AUD', rateFromUsd: 1.4328, label: 'Australia · AUD' },
  { code: 'FR', country: 'FR', language: 'fr', locale: 'fr-FR', currency: 'EUR', rateFromUsd: 0.8944, label: 'France · EUR' },
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
