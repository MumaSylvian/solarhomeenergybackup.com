import type { SupplierAdapter } from './types';

export const ankerSolix: SupplierAdapter = { name: 'Anker SOLIX', async importPublicCatalog() { return []; } };
