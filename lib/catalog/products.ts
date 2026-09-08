import type { CatalogProduct } from './types';

/**
 * Curated public-reference catalog. Prices deliberately stay unset until an
 * administrator defines retail pricing; source URLs remain attached to offers.
 */
export const catalog: CatalogProduct[] = [
  {
    id: 'eg4-6000xp', slug: 'eg4-6000xp', name: 'EG4 6000XP', brand: 'EG4', model: '6000XP', category: 'Whole-home backup', status: 'APPROVED', wholeHomeCapable: true,
    shortDescription: 'Off-grid hybrid inverter for 120V / 240V backup systems.', continuousOutputWatts: 6000, batteryCapacityWh: null, maxExpandableCapacityWh: null, solarInputWatts: null, acVoltage: '120V / 240V', batteryChemistry: null, warranty: '5-year standard warranty',
    specifications: { Output: '6,000W', Voltage: '120V / 240V', Warranty: '5-year standard warranty', 'Battery expansion': 'Specification not provided.' }, rawSpecifications: 'Official spec sheet references model EG4-6000XP and a 5-year standard warranty.',
    supplierOffers: [{ supplier: 'Signature Solar', supplierUrl: 'https://signaturesolar.com/product_images/EG4%206000XP%20Inverter%20Spec%20Sheet%201.2.1.pdf', availability: 'UNKNOWN', lastCheckedAt: '2026-09-08' }], imageUsageApproved: false,
  },
  {
    id: 'ecoflow-delta-pro-ultra', slug: 'ecoflow-delta-pro-ultra', name: 'DELTA Pro Ultra', brand: 'EcoFlow', model: 'DELTA Pro Ultra', category: 'Whole-home backup', status: 'APPROVED', wholeHomeCapable: true,
    shortDescription: 'Modular 120V / 240V backup platform designed around expandable battery storage.', continuousOutputWatts: 7200, batteryCapacityWh: 6000, maxExpandableCapacityWh: 90000, solarInputWatts: 5600, acVoltage: '120V / 240V', batteryChemistry: null, warranty: 'Specification not provided.',
    specifications: { Output: '7,200W', Battery: '6kWh starting capacity', Voltage: '120V / 240V', 'Solar input': '5,600W maximum', 'Expandable capacity': 'Up to 90kWh', Warranty: 'Specification not provided.' }, rawSpecifications: 'Public product information lists 7.2kW output, up to 90kWh capacity and up to 5.6kW solar input.',
    supplierOffers: [{ supplier: 'EcoFlow', supplierUrl: 'https://us.ecoflow.com/collections/delta-pro-series/products/delta-pro-ultra', availability: 'UNKNOWN', lastCheckedAt: '2026-09-08' }], imageUsageApproved: false,
  },
  {
    id: 'anker-solix-f3800', slug: 'anker-solix-f3800', name: 'SOLIX F3800', brand: 'Anker SOLIX', model: 'F3800', category: 'Portable power', status: 'APPROVED', wholeHomeCapable: true,
    shortDescription: 'Dual-voltage portable power station with a path to whole-home backup.', continuousOutputWatts: 6000, surgeOutputWatts: 9000, batteryCapacityWh: 3840, maxExpandableCapacityWh: 53800, solarInputWatts: 2400, acVoltage: '120V / 240V', batteryChemistry: 'LiFePO4', weightLb: 132.3, warranty: '5-year warranty',
    specifications: { Output: '6,000W continuous', Surge: '9,000W', Battery: '3.84kWh LiFePO4', Voltage: '120V / 240V', 'Solar input': '2,400W maximum', 'Expandable capacity': 'Up to 53.8kWh system', Warranty: '5-year warranty' }, rawSpecifications: 'Official product page technical specifications.',
    supplierOffers: [{ supplier: 'Anker SOLIX', supplierUrl: 'https://www.ankersolix.com/products/f3800', availability: 'UNKNOWN', lastCheckedAt: '2026-09-08' }], imageUsageApproved: false,
  },
  {
    id: 'anker-solix-f3800-plus', slug: 'anker-solix-f3800-plus', name: 'SOLIX F3800 Plus', brand: 'Anker SOLIX', model: 'F3800 Plus', category: 'Portable power', status: 'PENDING_REVIEW', wholeHomeCapable: true,
    shortDescription: '6kW portable backup system with dual-voltage output and high-voltage solar capability.', continuousOutputWatts: 6000, batteryCapacityWh: 3840, solarInputWatts: 3200, acVoltage: '120V / 240V', batteryChemistry: 'LiFePO4', weightLb: 136.7, warranty: 'Specification not provided.',
    specifications: { Output: '6,000W', Battery: '3.84kWh LiFePO4', Voltage: '120V / 240V', 'Solar input': '3,200W maximum', Warranty: 'Specification not provided.' }, rawSpecifications: 'Official product page technical specifications.',
    supplierOffers: [{ supplier: 'Anker SOLIX', supplierUrl: 'https://www.ankersolix.com/f3800-plus', availability: 'UNKNOWN', lastCheckedAt: '2026-09-08' }], imageUsageApproved: false,
  },
];

export const approvedCatalog = catalog.filter((product) => product.status === 'APPROVED');
export const bySlug = (slug: string) => catalog.find((product) => product.slug === slug);
