/**
 * Warehouse stock: the store's own on-hand inventory, keyed by product SKU
 * (the "Model / SKU" shown on each product page) with the quantity on hand.
 *
 * A product listed here with a quantity above zero is shown as "In stock",
 * described as shipping from our warehouse, and included in the Merchant
 * Center feed. Products not listed keep the supplier-based status from
 * lib/catalog/offer.ts. Update this list whenever inventory changes; an
 * "In stock" claim must match what the warehouse can actually ship.
 *
 * Example:
 *   'AC180-US-GY-BL-SPFUS': 12,
 */
export const warehouseStock: Record<string, number> = {
  // Waiting for the warehouse inventory list.
};
