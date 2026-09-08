import type { SupplierAdapter } from './types';

export const ecoFlow: SupplierAdapter = { name: 'EcoFlow', async importPublicCatalog() { return []; } };
