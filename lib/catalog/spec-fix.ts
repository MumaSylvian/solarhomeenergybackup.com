import type { CatalogProduct } from './types';

/**
 * Corrects rated power and capacity parsed by the original importers, which
 * (a) dropped the thousands digit from comma-formatted numbers ("1,800W" was
 * read as 800 W) and (b) did not read "Wh" values at all.
 *
 * A figure stated in the product name (the manufacturer's title) wins. If the
 * name has no figure and the stored value is a truncated comma number, the
 * value is removed: the importer took the first figure in the description,
 * which is often solar input or expandable capacity, so re-reading it would
 * swap one wrong number for another.
 */

// A number with optional thousands separators and decimals, not preceded by
// another digit, comma, or decimal point (so "1,800" is never read as "800").
const numberPattern = String.raw`(?<![\d.,])(\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?)`;
const wattsPattern = new RegExp(`${numberPattern}\\s*(kW|W)(?!h)\\b`, 'i');
const energyPattern = new RegExp(`${numberPattern}\\s*(kWh|Wh)\\b`, 'i');

const toNumber = (value: string) => Number(value.replace(/,/g, ''));

function watts(text: string) {
  const match = text.match(wattsPattern);
  if (!match) return null;
  return Math.round(toNumber(match[1]) * (match[2].toLowerCase() === 'kw' ? 1000 : 1));
}

function wattHours(text: string) {
  const match = text.match(energyPattern);
  if (!match) return null;
  return Math.round(toNumber(match[1]) * (match[2].toLowerCase() === 'kwh' ? 1000 : 1));
}

const formatWatts = (value: number) => `${value.toLocaleString('en-US')} W`;
// Whole kilowatt-hours read as kWh ("10 kWh"); anything else keeps the exact
// manufacturer figure ("1,152 Wh") instead of a rounded decimal.
const formatEnergy = (value: number) =>
  value >= 1000 && value % 1000 === 0
    ? `${(value / 1000).toLocaleString('en-US')} kWh`
    : `${value.toLocaleString('en-US')} Wh`;

const powerKeys = ['Rated power', 'Rated product power'];
const energyKey = 'Energy capacity';

/** Categories where rated output and stored energy describe the product. */
const powerCategories = new Set(['Portable power', 'Batteries', 'Whole-home backup']);

/**
 * True when the importer's first match in `text` sat right after a
 * thousands separator, e.g. it read "200" out of "3,200W".
 */
function wasTruncated(text: string, importerPattern: RegExp) {
  const match = text.match(importerPattern);
  return match?.index !== undefined && /\d,$/.test(text.slice(0, match.index));
}

// The importers' original patterns, used only to detect truncation.
const importerWatts = /\b(\d+(?:\.\d+)?)\s*(kW|W)\b/i;
const importerKwh = /\b(\d+(?:\.\d+)?)\s*kWh\b/i;

export function correctRatings<T extends CatalogProduct>(product: T): T {
  if (!powerCategories.has(product.category)) return product;

  const text = `${product.name} ${product.rawSpecifications ?? ''}`;
  const stored = {
    output: product.continuousOutputWatts ?? null,
    capacity: product.batteryCapacityWh ?? null,
  };
  const output =
    watts(product.name) ??
    (stored.output !== null && wasTruncated(text, importerWatts)
      ? null
      : stored.output);
  const capacity =
    wattHours(product.name) ??
    (stored.capacity !== null && wasTruncated(text, importerKwh)
      ? null
      : stored.capacity);

  if (output === stored.output && capacity === stored.capacity) return product;

  const specifications = { ...product.specifications };
  const powerKey =
    powerKeys.find((item) => item in specifications) ?? 'Rated power';
  if (output === null) for (const key of powerKeys) delete specifications[key];
  else specifications[powerKey] = formatWatts(output);
  if (capacity === null) delete specifications[energyKey];
  else specifications[energyKey] = formatEnergy(capacity);

  return {
    ...product,
    continuousOutputWatts: output,
    batteryCapacityWh: capacity,
    specifications,
  };
}
