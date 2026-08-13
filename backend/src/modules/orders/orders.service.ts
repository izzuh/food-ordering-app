import { db } from '../../db/pool.js';
import { createOrderFromCart } from './orders.repository.js';

export async function checkout(userId: string, addressId: string) {
  const address = await db.query(`SELECT id FROM addresses WHERE id = $1 AND user_id = $2 LIMIT 1`, [addressId, userId]);
  if (!address.rows[0]) throw new Error('ADDRESS_NOT_FOUND');
  return createOrderFromCart(userId, addressId);
}
