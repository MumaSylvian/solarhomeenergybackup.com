export type ProductStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  model: string;
  sku?: string | null;
  category: 'Whole-home backup' | 'Portable power' | 'Batteries' | 'Solar panels' | 'Home integration' | 'Accessories';
  shortDescription: string;
  status: ProductStatus;
  wholeHomeCapable: boolean;
  continuousOutputWatts?: number | null;
  surgeOutputWatts?: number | null;
  batteryCapacityWh?: number | null;
  maxExpandableCapacityWh?: number | null;
  solarInputWatts?: number | null;
  acVoltage?: string | null;
  batteryChemistry?: string | null;
  weightLb?: number | null;
  warranty?: string | null;
  specifications: Record<string, string>;
  rawSpecifications: string;
  supplierOffers: SupplierOffer[];
  imageUsageApproved: boolean;
  sourceImageUrl?: string | null;
};

export type SupplierOffer = {
  supplier: 'Signature Solar' | 'Current Connected' | 'EcoFlow' | 'Anker SOLIX' | 'BLUETTI';
  supplierUrl: string;
  supplierSku?: string | null;
  supplierPrice?: number | null;
  availability: 'UNKNOWN' | 'IN_STOCK' | 'OUT_OF_STOCK';
  lastCheckedAt: string;
};
