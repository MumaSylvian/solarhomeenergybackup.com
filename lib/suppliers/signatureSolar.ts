import type { SupplierAdapter } from './types';

export const signatureSolar: SupplierAdapter = {
  name: 'Signature Solar',
  async importPublicCatalog() {
    // Add only fields observed on an openly accessible product/specification page.
    // A blocked response must throw and be recorded by importFrom(), never retried by bypassing controls.
    return [];
  },
};
