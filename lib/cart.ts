export type CartProduct = { id: string; slug: string; name: string; brand: string; category: string; retailPrice?: number | null };
export type StoredCart = Record<string, { product: CartProduct; quantity: number }>;
const cartKey = 'solarhome-reserve-cart-v1';

export function readCart(): StoredCart {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(window.localStorage.getItem(cartKey) ?? '{}') as StoredCart; } catch { return {}; }
}

export function saveCart(cart: StoredCart) {
  if (typeof window !== 'undefined') window.localStorage.setItem(cartKey, JSON.stringify(cart));
}

export function addToCart(product: CartProduct) {
  const cart = readCart();
  cart[product.id] = { product, quantity: (cart[product.id]?.quantity ?? 0) + 1 };
  saveCart(cart);
  return cart;
}
