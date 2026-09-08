import type { SupplierAdapter } from './types';

export const currentConnected: SupplierAdapter = { name: 'Current Connected', async importPublicCatalog() { return []; } };
