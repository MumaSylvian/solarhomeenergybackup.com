export type CartProduct = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  sourcePrice?: number | null;
  retailPrice?: number | null;
};
export type StoredCart = Record<
  string,
  { product: CartProduct; quantity: number }
>;
// A new key prevents pre-policy browser carts from showing an outdated sale price.
const cartKey = 'solarhome-reserve-cart-v2';

export function readCart(): StoredCart {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(
      window.localStorage.getItem(cartKey) ?? '{}',
    ) as StoredCart;
  } catch {
    return {};
  }
}

const cartChangeEvent = 'solarhome-cart-change';

export function saveCart(cart: StoredCart) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(cartKey, JSON.stringify(cart));
  window.dispatchEvent(new Event(cartChangeEvent));
}

/** Notifies on cart changes in this tab and in other open tabs. */
export function subscribeToCart(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === cartKey) onChange();
  };
  window.addEventListener(cartChangeEvent, onChange);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(cartChangeEvent, onChange);
    window.removeEventListener('storage', onStorage);
  };
}

export function cartItemCount() {
  return Object.values(readCart()).reduce(
    (total, item) => total + item.quantity,
    0,
  );
}

/** Sets a line's quantity; zero or less removes the line. */
export function setCartQuantity(id: string, quantity: number) {
  const cart = readCart();
  if (!cart[id]) return cart;
  if (quantity <= 0) delete cart[id];
  else cart[id] = { ...cart[id], quantity: Math.min(quantity, 99) };
  saveCart(cart);
  return cart;
}

export function addToCart(product: CartProduct) {
  const cart = readCart();
  cart[product.id] = {
    product,
    quantity: (cart[product.id]?.quantity ?? 0) + 1,
  };
  saveCart(cart);
  return cart;
}
