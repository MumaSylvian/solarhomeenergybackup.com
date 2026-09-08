import type { CatalogProduct } from './types';

const twentyPercentBelow = (sourcePrice: number) => Math.round(sourcePrice * 0.8 * 100) / 100;

/**
 * Curated public-reference catalog. Prices deliberately stay unset until an
 * administrator defines retail pricing; source URLs remain attached to offers.
 */
export const catalog: CatalogProduct[] = [
  {
    id: 'eg4-6000xp', slug: 'eg4-6000xp', name: 'EG4 6000XP', brand: 'EG4', model: '6000XP', category: 'Whole-home backup', status: 'APPROVED', wholeHomeCapable: true,
    shortDescription: 'Off-grid hybrid inverter for 120V / 240V backup systems.', continuousOutputWatts: 6000, batteryCapacityWh: null, maxExpandableCapacityWh: null, solarInputWatts: null, acVoltage: '120V / 240V', batteryChemistry: null, warranty: '5-year standard warranty',
    specifications: { Output: '6,000W', Voltage: '120V / 240V', Warranty: '5-year standard warranty', 'Battery expansion': 'Specification not provided.' }, rawSpecifications: 'Official spec sheet references model EG4-6000XP and a 5-year standard warranty.',
    sourcePrice: 1499.99, retailPrice: twentyPercentBelow(1499.99), supplierOffers: [{ supplier: 'Signature Solar', supplierUrl: 'https://signaturesolar.com/all-products/inverters/', supplierSku: '1511090', supplierPrice: 1499.99, availability: 'UNKNOWN', lastCheckedAt: '2026-09-08' }], imageUsageApproved: false,
  },
  {
    id: 'ecoflow-delta-pro-ultra', slug: 'ecoflow-delta-pro-ultra', name: 'DELTA Pro Ultra', brand: 'EcoFlow', model: 'DELTA Pro Ultra', category: 'Whole-home backup', status: 'APPROVED', wholeHomeCapable: true,
    shortDescription: 'Modular 120V / 240V backup platform designed around expandable battery storage.', continuousOutputWatts: 7200, batteryCapacityWh: 6000, maxExpandableCapacityWh: 90000, solarInputWatts: 5600, acVoltage: '120V / 240V', batteryChemistry: null, warranty: 'Specification not provided.',
    specifications: { Output: '7,200W', Battery: '6kWh starting capacity', Voltage: '120V / 240V', 'Solar input': '5,600W maximum', 'Expandable capacity': 'Up to 90kWh', Warranty: 'Specification not provided.' }, rawSpecifications: 'Public product information lists 7.2kW output, up to 90kWh capacity and up to 5.6kW solar input.',
    sourcePrice: 4199, retailPrice: twentyPercentBelow(4199), supplierOffers: [{ supplier: 'EcoFlow', supplierUrl: 'https://us.ecoflow.com/collections/delta-pro-series/products/delta-pro-ultra', supplierPrice: 4199, availability: 'UNKNOWN', lastCheckedAt: '2026-09-08' }], imageUsageApproved: false,
  },
  {
    id: 'anker-solix-f3800', slug: 'anker-solix-f3800', name: 'SOLIX F3800', brand: 'Anker SOLIX', model: 'F3800', category: 'Portable power', status: 'APPROVED', wholeHomeCapable: true,
    shortDescription: 'Dual-voltage portable power station with a path to whole-home backup.', continuousOutputWatts: 6000, surgeOutputWatts: 9000, batteryCapacityWh: 3840, maxExpandableCapacityWh: 53800, solarInputWatts: 2400, acVoltage: '120V / 240V', batteryChemistry: 'LiFePO4', weightLb: 132.3, warranty: '5-year warranty',
    specifications: { Output: '6,000W continuous', Surge: '9,000W', Battery: '3.84kWh LiFePO4', Voltage: '120V / 240V', 'Solar input': '2,400W maximum', 'Expandable capacity': 'Up to 53.8kWh system', Warranty: '5-year warranty' }, rawSpecifications: 'Official product page technical specifications.',
    sourcePrice: 2199.99, retailPrice: twentyPercentBelow(2199.99), supplierOffers: [{ supplier: 'Anker SOLIX', supplierUrl: 'https://www.ankersolix.com/products/f3800', supplierPrice: 2199.99, availability: 'UNKNOWN', lastCheckedAt: '2026-09-08' }], imageUsageApproved: false,
  },
  {
    id: 'anker-solix-f3800-plus', slug: 'anker-solix-f3800-plus', name: 'SOLIX F3800 Plus', brand: 'Anker SOLIX', model: 'F3800 Plus', category: 'Portable power', status: 'PENDING_REVIEW', wholeHomeCapable: true,
    shortDescription: '6kW portable backup system with dual-voltage output and high-voltage solar capability.', continuousOutputWatts: 6000, batteryCapacityWh: 3840, solarInputWatts: 3200, acVoltage: '120V / 240V', batteryChemistry: 'LiFePO4', weightLb: 136.7, warranty: 'Specification not provided.',
    specifications: { Output: '6,000W', Battery: '3.84kWh LiFePO4', Voltage: '120V / 240V', 'Solar input': '3,200W maximum', Warranty: 'Specification not provided.' }, rawSpecifications: 'Official product page technical specifications.',
    sourcePrice: 2599.99, retailPrice: twentyPercentBelow(2599.99), supplierOffers: [{ supplier: 'Anker SOLIX', supplierUrl: 'https://www.ankersolix.com/f3800-plus', supplierPrice: 2599.99, availability: 'UNKNOWN', lastCheckedAt: '2026-09-08' }], imageUsageApproved: false,
  },
  {
    id: 'eg4-12000xp', slug: 'eg4-12000xp', name: 'EG4 12000XP', brand: 'EG4', model: '12000XP', category: 'Whole-home backup', status: 'APPROVED', wholeHomeCapable: true,
    shortDescription: 'Off-grid split-phase inverter for higher-output backup system planning.', continuousOutputWatts: 12000, batteryCapacityWh: null, maxExpandableCapacityWh: null, solarInputWatts: null, acVoltage: '120V / 240V', batteryChemistry: null, warranty: 'Specification not provided.',
    specifications: { Output: '12,000W', Voltage: '120V / 240V', Warranty: 'Specification not provided.' }, rawSpecifications: 'Public Signature Solar category listing.',
    sourcePrice: 1899.99, retailPrice: twentyPercentBelow(1899.99), supplierOffers: [{ supplier: 'Signature Solar', supplierUrl: 'https://signaturesolar.com/shop-all/inverters/off-grid-inverters/', supplierSku: '1510979-NF', supplierPrice: 1899.99, availability: 'UNKNOWN', lastCheckedAt: '2026-09-08' }], imageUsageApproved: false,
  },
  {
    id: 'ecoflow-400w-portable-solar-panel', slug: 'ecoflow-400w-portable-solar-panel', name: '400W Portable Solar Panel', brand: 'EcoFlow', model: '400W Portable Solar Panel', category: 'Solar panels', status: 'APPROVED', wholeHomeCapable: false,
    shortDescription: 'Folding 400W portable solar panel for compatible portable power systems.', continuousOutputWatts: 400, batteryCapacityWh: null, maxExpandableCapacityWh: null, solarInputWatts: null, acVoltage: null, batteryChemistry: null, weightLb: 35.3, warranty: 'Specification not provided.',
    specifications: { Output: '400W', Weight: '35.3 lb', 'Cell protection': 'IP68', Warranty: 'Specification not provided.' }, rawSpecifications: 'Public EcoFlow product page information.',
    sourcePrice: 549, retailPrice: twentyPercentBelow(549), supplierOffers: [{ supplier: 'EcoFlow', supplierUrl: 'https://us.ecoflow.com/collections/delta-pro-series/products/delta-pro-ultra', supplierPrice: 549, availability: 'UNKNOWN', lastCheckedAt: '2026-09-08' }], imageUsageApproved: false,
  },
];

/** One storefront record per brand + normalized model; supplier offers remain attached to that record. */
export const uniqueCatalog = catalog.filter((product, index, products) => products.findIndex((candidate) =>
  `${candidate.brand}:${candidate.model}`.replace(/[^a-z0-9]/gi, '').toLowerCase() === `${product.brand}:${product.model}`.replace(/[^a-z0-9]/gi, '').toLowerCase(),
) === index);
export const approvedCatalog = uniqueCatalog.filter((product) => product.status === 'APPROVED');
export const bySlug = (slug: string) => catalog.find((product) => product.slug === slug);
