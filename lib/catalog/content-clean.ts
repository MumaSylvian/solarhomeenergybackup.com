import type { CatalogProduct } from './types';

/**
 * Removes other businesses' material from imported product copy: retailer
 * names and promotions, their support phone numbers and emails, "click here /
 * shop more" navigation text, and raw URLs. Manufacturer facts (brand, model,
 * features, certifications, manufacturer warranties) are kept.
 *
 * Runs at catalog load, so the generated source data stays untouched and
 * every page, schema block, and feed row reads the cleaned text.
 */

const retailerNames = /\b(the\s+)?home\s*depot\b|homedepot|\bsignature\s*solar\b|\bcurrent\s*connected\b|\blowe'?s\b|\bwalmart\b|\bbest\s*buy\b|\bamazon\.com\b/i;

/** Retailer boilerplate that appears as fragments without sentence punctuation. */
const boilerplate: RegExp[] = [
  /Need help with a home project\?\s*Let us do it for you\s*-?\s*1\s*800\s*HOME\s*DEPOT\s*or visit\s*Home\s*Depot\.com\/services/gi,
  // Retailer "Click here" links. Each pattern is bounded: imported text often
  // has no full stops for thousands of characters, so an open-ended match
  // would swallow real product copy.
  /Click here for more information on Electronic Recycling Programs/gi,
  /Click here for details on the services included with [^.]{0,160}?installation options for major appliances(?:,? and appliance return policy information)?/gi,
  /,?\s*(?:and\s+)?Appliance Return Policy Information/gi,
  /Click here to learn more about Eco Options and Energy Efficiency/gi,
  /Click here to view our Buying Guide to help you find the right [\w -]{0,40}? for you/gi,
  /Click here to find the compatible water filter/gi,
  /Click here to shop (?:for )?(?:more |all )?[\w&'-]+(?: \d+ Series)?(?: (?:appliances|refrigerators|dishwashers|dryers|washing machines|washers|products|bottom freezers?|ranges))?/gi,
  /For any questions regarding your purchase, product, or replacement parts please call 1-800-HOME-DEPOT \(1-800-466-3337\) for customer support/gi,
  // Remaining "Click here for/to learn more about X": keep X, drop the link text.
  /Click here (?:for the |to learn more about |for )?/gi,
  // First-person support and service promises made by the original seller or
  // manufacturer. On this site they would read as our commitments.
  /From purchase to installation and beyond, our USA-based team offers lifetime support\s*[—-]\s*contact us with any questions\.?/gi,
  /We provide a solution for this cable!?/gi,
  /Inverters purchased from\s+are powered on and pre-?programm?ed[^.]{0,80}? prior to shipping\./gi,
  /Additionally, our support team is able to assist with [^.]{0,160}\./gi,
  /For any additional (?:questions|assistance)[^.]{0,160}\./gi,
  /Reliable after-sales support\s*[：:][^()]{0,200}?\(PST\)/gi,
  /(?:Customer Support|Reliable after-sales support)\s*:\s*For any inquiries (?:or|and) (?:after-sales )?support,?\s*(?:please )?contact us at\s*\.?/gi,
  /If you have any questions before or during installation[^.]{0,200}?contact us at\s+\S+/gi,
  /We are confident you will love your purchase\.\s*If for any reason you are not completely satisfied, we offer a \d+-day money back guarantee\.(?:\s*See [^.]*?for more details\.)?/gi,
  /\bSee\s+\S+\.com\/\S+ for more details\.?/gi,
  // Seller warranty promises; the store's own warranty is set by its policy.
  /Your purchase is backed by an? [\w-]+ warranty\.?/gi,
  /Have questions or need assistance\?\s*Our support team is here to help!?/gi,
  /\bProduct (?:Image|Information)\b/g,
  /NOTE:\s*The Installation Service excluded from [^.]*?promotion/gi,
  /\bexcluded from (?:the )?Spend & Get promotion\b/gi,
];

/** Contact details and links, with their lead-in phrases. */
const contactBits: RegExp[] = [
  /(?:for any questions,?\s*)?(?:please\s+)?contact\s+[\w.+-]+@[\w.-]+\.\w+(?:\s+for help)?\.?/gi,
  /(?:give us a call|call us|call)\s+(?:at\s+)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\.?/gi,
  /(?:visit\s+)?(?:https?:\/\/|www\.)\S+(?:\s+for more information(?: on [^.]*)?)?\.?/gi,
  /[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi,
  /\(?\b\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/g,
];

const decodeEntities = (text: string) =>
  text.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&nbsp;/g, ' ');

/** Retailer-exclusivity clauses such as "Exclusively sold at The Home Depot". */
const retailerClauses =
  /\b(?:exclusive(?:ly)?\s+(?:sold\s+)?(?:at|to)|only at|available (?:only )?at|sold (?:only )?(?:at|by))\s+(?:the\s+)?(?:home\s*depot|lowe'?s|walmart|best\s*buy)\b/gi;

/**
 * Removes retailer mentions. A short sentence that names a retailer (a store
 * promotion, "ships from…") is dropped whole; in long run-on text only the
 * retailer phrase is removed, so product facts in the same run survive.
 */
function dropRetailerSentences(text: string) {
  return text
    .replace(retailerClauses, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => {
      const mentions =
        retailerNames.test(sentence) ||
        /\s['’]s free shipping/i.test(sentence) ||
        /\b(contact us|our (?:support )?team|money[- ]back guarantee)\b/i.test(sentence);
      if (!mentions) return sentence;
      if (sentence.length <= 300) return '';
      return sentence.replace(new RegExp(retailerNames.source, 'gi'), ' ');
    })
    .join(' ');
}

export function cleanCopy(text: string | null | undefined) {
  if (!text) return text ?? '';
  let out = decodeEntities(text);
  // Manufacturer accessory offers worded as the original seller: keep the
  // fact, drop the first person.
  out = out.replace(/we offer a stainless steel handle upgrade \("TBSet"\) that allows/gi, 'an optional stainless steel handle upgrade ("TBSet") allows');
  for (const pattern of boilerplate) out = out.replace(pattern, ' ');
  for (const pattern of contactBits) out = out.replace(pattern, ' ');
  out = dropRetailerSentences(out);
  return out
    .replace(/\s+([.,;:!?])/g, '$1')
    .replace(/([.!?])\s*\1+/g, '$1')
    .replace(/:\s*(?=[.!?]|$)/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Manufacturers that appear at the start of product names whose Brand field
 * held the distributor ("Signature Solar", "Current Connected"). Longest first.
 */
const knownBrands = [
  'Briggs & Stratton', 'EMP Shield', 'EMP', 'OutBack Power', 'Lion Energy', 'Mission Solar',
  'Rich Solar', 'Trina Solar', 'ECO-WORTHY', 'SoftStartUSA', 'BigBattery', 'SolaTrim',
  'Growatt', 'Enphase', 'Cummins', 'Solis', 'Epoch', 'OutBack', 'Tucker', 'LG', 'Emporia',
  'Hyundai', 'Sirius', 'MidNite', 'Duracell', 'GoodWe', 'Eneramp', 'Eaton', 'IMO', 'Trina',
  'SunEarth', 'NEP', 'ABB', 'ChikoUSA', 'Chiko', 'Indepwr', 'Mission', 'Lion', 'Renon',
  'Axitec', 'Burndy', 'Victron', 'EG4', 'Sol-Ark', 'Tigo', 'Fortress', 'Canadian Solar',
  'Champion', 'Lumina', 'Peimar', 'Satic', 'SunPro', 'MNP',
].sort((a, b) => b.length - a.length);

const distributorBrands = /^(signature solar|current connected|the home depot)$/i;

/** Real manufacturer from the name, or null when it cannot be determined. */
export function brandFor(product: Pick<CatalogProduct, 'brand' | 'name'>) {
  if (!distributorBrands.test(product.brand.trim())) return product.brand;
  const name = product.name.replace(/^\s*\d+\s*[x×*]\s*/i, '').toLowerCase();
  const match = knownBrands.find(
    (brand) =>
      name.startsWith(brand.toLowerCase()) &&
      !/[a-z0-9]/.test(name.charAt(brand.length)),
  );
  return match ? (brandAliases[match] ?? match) : null;
}

/** Short prefixes seen in names, mapped to the manufacturer's full name. */
const brandAliases: Record<string, string> = {
  EMP: 'EMP Shield',
  OutBack: 'OutBack Power',
  Trina: 'Trina Solar',
  Mission: 'Mission Solar',
  Lion: 'Lion Energy',
  Chiko: 'ChikoUSA',
};

export function cleanProductContent<T extends CatalogProduct>(product: T): T {
  const brand = brandFor(product);
  const specifications = { ...product.specifications };
  if (brand) specifications.Brand = brand;
  else delete specifications.Brand;
  return {
    ...product,
    brand: brand ?? '',
    shortDescription: cleanCopy(product.shortDescription),
    rawSpecifications: cleanCopy(product.rawSpecifications),
    specifications,
  };
}
