import { db } from '../../db/pool.js';
import type { Cart, CartItem } from './cart.types.js';

export async function getCart(userId: string): Promise<Cart | null> {
  const cartResult = await db.query<{ id: string; user_id: string; restaurant_id: string | null }>(
    `SELECT id, user_id, restaurant_id FROM carts WHERE user_id = $1 LIMIT 1`,
    [userId],
  );
  const cart = cartResult.rows[0];
  if (!cart) return null;

  const itemsResult = await db.query<CartItem>(
    `SELECT ci.id, ci.cart_id, ci.menu_item_id, ci.quantity,
            mi.name, mi.price_minor AS unit_price_minor, mi.image_url
     FROM cart_items ci
     JOIN menu_items mi ON mi.id = ci.menu_item_id
     WHERE ci.cart_id = $1 ORDER BY ci.created_at ASC`,
    [cart.id],
  );

  const items = itemsResult.rows;
  const subtotal_minor = items.reduce((sum, item) => sum + item.unit_price_minor * item.quantity, 0);
  return { ...cart, items, subtotal_minor };
}

export async function ensureCart(userId: string, restaurantId: string): Promise<string> {
  const result = await db.query<{ id: string; restaurant_id: string | null }>(
    `INSERT INTO carts (user_id, restaurant_id) VALUES ($1, $2)
     ON CONFLICT (user_id) DO UPDATE SET restaurant_id = EXCLUDED.restaurant_id, updated_at = NOW()
     RETURNING id, restaurant_id`,
    [userId, restaurantId],
  );
  return result.rows[0].id;
}

export async function addItem(cartId: string, menuItemId: string, quantity: number): Promise<void> {
  await db.query(
    `INSERT INTO cart_items (cart_id, menu_item_id, quantity) VALUES ($1, $2, $3)
     ON CONFLICT (cart_id, menu_item_id)
     DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity`,
    [cartId, menuItemId, quantity],
  );
}

export async function updateItem(cartId: string, menuItemId: string, quantity: number): Promise<void> {
  await db.query(
    `UPDATE cart_items SET quantity = $3 WHERE cart_id = $1 AND menu_item_id = $2`,
    [cartId, menuItemId, quantity],
  );
}

export async function removeItem(cartId: string, menuItemId: string): Promise<void> {
  await db.query(`DELETE FROM cart_items WHERE cart_id = $1 AND menu_item_id = $2`, [cartId, menuItemId]);
}
