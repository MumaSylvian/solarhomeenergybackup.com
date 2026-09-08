import type { SupplierAdapter } from './types';

export const bluetti: SupplierAdapter = { name: 'BLUETTI', async importPublicCatalog() { return []; } };
