import { db } from '../../db/pool.js';

export async function listUserOrders(userId: string) {
  const result = await db.query(
    `SELECT o.id, o.restaurant_id, r.name AS restaurant_name,
            o.status, o.payment_status, o.subtotal_minor, o.delivery_fee_minor,
            o.total_minor, o.currency, o.created_at
     FROM orders o
     JOIN restaurants r ON r.id = o.restaurant_id
     WHERE o.user_id = $1
     ORDER BY o.created_at DESC`,
    [userId],
  );
  return result.rows;
}

export async function findUserOrder(userId: string, orderId: string) {
  const order = await db.query(
    `SELECT o.id, o.restaurant_id, r.name AS restaurant_name, o.status,
            o.payment_status, o.subtotal_minor, o.delivery_fee_minor,
            o.total_minor, o.currency, o.delivery_address_snapshot, o.created_at
     FROM orders o JOIN restaurants r ON r.id = o.restaurant_id
     WHERE o.id = $1 AND o.user_id = $2 LIMIT 1`,
    [orderId, userId],
  );
  if (!order.rows[0]) return null;

  const items = await db.query(
    `SELECT id, menu_item_id, item_name_snapshot, unit_price_minor, quantity, line_total_minor
     FROM order_items WHERE order_id = $1 ORDER BY id`,
    [orderId],
  );
  return { ...order.rows[0], items: items.rows };
}
