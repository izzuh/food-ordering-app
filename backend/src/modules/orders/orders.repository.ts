import { db } from '../../db/pool.js';

export async function createOrderFromCart(userId: string, addressId: string) {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const cart = await client.query<{
      id: string; restaurant_id: string; address_snapshot: object;
    }>(
      `SELECT c.id, c.restaurant_id,
              jsonb_build_object('recipient_name', a.recipient_name, 'phone', a.phone,
              'address_line', a.address_line, 'city', a.city, 'state', a.state,
              'latitude', a.latitude, 'longitude', a.longitude) AS address_snapshot
       FROM carts c JOIN addresses a ON a.id = $2 AND a.user_id = $1
       WHERE c.user_id = $1 LIMIT 1`,
      [userId, addressId],
    );

    const cartRow = cart.rows[0];
    if (!cartRow?.restaurant_id) throw new Error('CART_EMPTY');

    const items = await client.query<{
      menu_item_id: string; name: string; price_minor: number; quantity: number;
    }>(
      `SELECT ci.menu_item_id, mi.name, mi.price_minor, ci.quantity
       FROM cart_items ci JOIN menu_items mi ON mi.id = ci.menu_item_id
       WHERE ci.cart_id = $1 AND mi.is_available = TRUE
       FOR UPDATE OF mi`,
      [cartRow.id],
    );

    if (items.rows.length === 0) throw new Error('CART_EMPTY');

    const subtotal = items.rows.reduce((sum, item) => sum + item.price_minor * item.quantity, 0);
    const deliveryFee = 0;
    const total = subtotal + deliveryFee;

    const order = await client.query<{ id: string }>(
      `INSERT INTO orders
       (user_id, restaurant_id, address_id, subtotal_minor, delivery_fee_minor, total_minor,
        currency, delivery_address_snapshot)
       VALUES ($1, $2, $3, $4, $5, $6, 'NGN', $7)
       RETURNING id`,
      [userId, cartRow.restaurant_id, addressId, subtotal, deliveryFee, total, cartRow.address_snapshot],
    );

    for (const item of items.rows) {
      await client.query(
        `INSERT INTO order_items
         (order_id, menu_item_id, item_name_snapshot, unit_price_minor, quantity, line_total_minor)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [order.rows[0].id, item.menu_item_id, item.name, item.price_minor, item.quantity, item.price_minor * item.quantity],
      );
    }

    await client.query('DELETE FROM cart_items WHERE cart_id = $1', [cartRow.id]);
    await client.query('UPDATE carts SET restaurant_id = NULL, updated_at = NOW() WHERE id = $1', [cartRow.id]);
    await client.query('COMMIT');
    return { id: order.rows[0].id, subtotal_minor: subtotal, delivery_fee_minor: deliveryFee, total_minor: total };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
