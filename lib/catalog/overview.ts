import type { CatalogProduct } from './types';
import { conditionOf } from './offer';

/**
 * Our own overview for a product, written only from verified catalog fields
 * (name, brand, category, ratings, condition). Nothing is inferred beyond
 * those fields; the manufacturer's description is shown separately and
 * labelled as the manufacturer's.
 */

const watts = (value: number) => `${value.toLocaleString('en-US')} W`;
const energy = (value: number) =>
  value >= 1000 && value % 1000 === 0
    ? `${(value / 1000).toLocaleString('en-US')} kWh`
    : `${value.toLocaleString('en-US')} Wh`;

type OverviewInput = Pick<
  CatalogProduct,
  'name' | 'brand' | 'category' | 'shortDescription' | 'continuousOutputWatts' | 'batteryCapacityWh'
>;

export function overviewFor(product: OverviewInput) {
  const condition = conditionOf(product);
  // State only listing facts. Describing the item by category ("this battery…")
  // would turn category mistakes in the imported data into false claims.
  const maker = product.brand ? ` by ${product.brand}` : '';
  const sentences = [`${product.name}${maker}, listed in our ${product.category} category.`];

  const ratings = [
    product.continuousOutputWatts ? `${watts(product.continuousOutputWatts)} rated output` : null,
    product.batteryCapacityWh ? `${energy(product.batteryCapacityWh)} energy capacity` : null,
  ].filter(Boolean);
  if (ratings.length) sentences.push(`Listed rating: ${ratings.join(', ')}.`);
  if (condition === 'refurbished') sentences.push('This is a refurbished unit; ask our team about its condition and warranty before ordering.');
  if (condition === 'used') sentences.push('This is a pre-owned unit; ask our team about its condition before ordering.');
  return sentences.join(' ');
}

/**
 * Meta description: our listing facts, then the start of the manufacturer's
 * own summary for detail, trimmed to 155 characters.
 */
export function productMetaDescription(product: OverviewInput) {
  const text = `${overviewFor(product)} ${product.shortDescription ?? ''}`.trim();
  return text.length > 155 ? `${text.slice(0, 155).replace(/\s+\S*$/, '')}…` : text;
}
