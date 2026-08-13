import { db } from '../../db/pool.js';

export async function updateRiderLocation(riderId: string, deliveryId: string, latitude: number, longitude: number) {
  const result = await db.query(
    `UPDATE deliveries
     SET rider_latitude = $3, rider_longitude = $4, updated_at = NOW()
     WHERE id = $2 AND rider_id = $1 AND status IN ('accepted','picked_up')
     RETURNING id, order_id, rider_id, status, rider_latitude, rider_longitude`,
    [riderId, deliveryId, latitude, longitude],
  );
  return result.rows[0] ?? null;
}

export async function getOrderDelivery(userId: string, orderId: string) {
  const result = await db.query(
    `SELECT d.id, d.order_id, d.status, d.rider_id,
            d.rider_latitude, d.rider_longitude,
            o.status AS order_status
     FROM deliveries d JOIN orders o ON o.id = d.order_id
     WHERE d.order_id = $1 AND o.user_id = $2 LIMIT 1`,
    [orderId, userId],
  );
  return result.rows[0] ?? null;
}
