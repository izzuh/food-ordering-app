import { db } from '../../db/pool.js';

export async function listRestaurantOrders(ownerId: string) {
  const result = await db.query(`SELECT o.id, o.restaurant_id, o.status, o.payment_status, o.subtotal_minor, o.delivery_fee_minor, o.total_minor, o.currency, o.delivery_address_snapshot, o.created_at FROM orders o JOIN restaurants r ON r.id = o.restaurant_id WHERE r.owner_id = $1 ORDER BY o.created_at DESC`, [ownerId]);
  return result.rows;
}
export async function getRestaurantOrder(ownerId: string, orderId: string) {
  const order = await db.query(`SELECT o.id, o.restaurant_id, o.status, o.payment_status, o.subtotal_minor, o.delivery_fee_minor, o.total_minor, o.currency, o.delivery_address_snapshot, o.created_at FROM orders o JOIN restaurants r ON r.id = o.restaurant_id WHERE o.id = $1 AND r.owner_id = $2 LIMIT 1`, [orderId, ownerId]);
  if (!order.rows[0]) return null;
  const items = await db.query(`SELECT id, menu_item_id, item_name_snapshot, unit_price_minor, quantity, line_total_minor FROM order_items WHERE order_id = $1 ORDER BY id`, [orderId]);
  return { ...order.rows[0], items: items.rows };
}
export async function updateRestaurantOrderStatus(ownerId: string, orderId: string, status: string) {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(`UPDATE orders o SET status = $3, updated_at = NOW() FROM restaurants r WHERE o.id = $1 AND o.restaurant_id = r.id AND r.owner_id = $2 RETURNING o.id, o.status`, [orderId, ownerId, status]);
    if (!result.rows[0]) { await client.query('ROLLBACK'); return null; }
    if (status === 'ready_for_delivery') await client.query(`INSERT INTO deliveries (order_id, status) VALUES ($1, 'assigned') ON CONFLICT (order_id) DO NOTHING`, [orderId]);
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
}
