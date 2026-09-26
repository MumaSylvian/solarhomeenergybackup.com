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
/**
 * Owner confirmation, 2026-09-26: every product listed on the site is on hand
 * in the Baton Rouge, LA warehouse. While this is true, all listed products
 * are shown and submitted as in stock. Set to false and fill in
 * warehouseStock below if some products stop being on hand; an in-stock claim
 * must always match what the warehouse can ship.
 */
export const ALL_LISTED_IN_STOCK = true;

export const warehouseStock: Record<string, number> = {
  // Waiting for the warehouse inventory list.
};
