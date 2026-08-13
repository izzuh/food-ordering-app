import { db } from '../../db/pool.js';
import { addItem, ensureCart, getCart, removeItem, updateItem } from './cart.repository.js';

export async function getUserCart(userId: string) {
  return getCart(userId);
}

export async function addToCart(userId: string, menuItemId: string, quantity: number) {
  if (quantity < 1) throw new Error('INVALID_QUANTITY');

  const item = await db.query<{ restaurant_id: string; is_available: boolean }>(
    `SELECT restaurant_id, is_available FROM menu_items WHERE id = $1 LIMIT 1`,
    [menuItemId],
  );
  const menuItem = item.rows[0];
  if (!menuItem || !menuItem.is_available) throw new Error('MENU_ITEM_UNAVAILABLE');

  const current = await getCart(userId);
  if (current?.restaurant_id && current.restaurant_id !== menuItem.restaurant_id) {
    throw new Error('CART_RESTAURANT_MISMATCH');
  }

  const cartId = current?.id ?? await ensureCart(userId, menuItem.restaurant_id);
  await addItem(cartId, menuItemId, quantity);
  return getCart(userId);
}

export async function updateCartItem(userId: string, menuItemId: string, quantity: number) {
  const cart = await getCart(userId);
  if (!cart) throw new Error('CART_NOT_FOUND');
  if (quantity < 1) return removeFromCart(userId, menuItemId);
  await updateItem(cart.id, menuItemId, quantity);
  return getCart(userId);
}

export async function removeFromCart(userId: string, menuItemId: string) {
  const cart = await getCart(userId);
  if (!cart) return null;
  await removeItem(cart.id, menuItemId);
  return getCart(userId);
}
