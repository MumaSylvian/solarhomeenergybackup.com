export type ProductStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  model: string;
  sku?: string | null;
  category:
    | 'Whole-home backup'
    | 'Portable power'
    | 'Batteries'
    | 'Solar panels'
    | 'Home integration'
    | 'EV chargers'
    | 'Accessories'
    | 'Dishwashers'
    | 'Freezers'
    | 'Refrigerators'
    | 'Washers & Dryers';
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
  sourcePrice?: number | null;
  retailPrice?: number | null;
  imageUsageApproved: boolean;
  sourceImageUrl?: string | null;
  sourceDetailImageUrl?: string | null;
  galleryImageUrls?: string[];
};

export type SupplierOffer = {
  supplier:
    | 'Signature Solar'
    | 'Current Connected'
    | 'EcoFlow'
    | 'Anker SOLIX'
    | 'BLUETTI'
    | 'The Home Depot';
  supplierUrl: string;
  supplierSku?: string | null;
  supplierPrice?: number | null;
  availability: 'UNKNOWN' | 'IN_STOCK' | 'OUT_OF_STOCK';
  lastCheckedAt: string;
};
