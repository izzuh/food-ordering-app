import { db } from '../../db/pool.js';

export async function listAvailableDeliveries() {
  const result = await db.query(
    `SELECT d.id, d.order_id, d.status, o.restaurant_id, r.name AS restaurant_name,
            o.delivery_address_snapshot, o.total_minor, o.currency
     FROM deliveries d
     JOIN orders o ON o.id = d.order_id
     JOIN restaurants r ON r.id = o.restaurant_id
     WHERE d.status = 'assigned' AND d.rider_id IS NULL
     ORDER BY d.created_at ASC`,
  );
  return result.rows;
}

export async function getRiderDeliveries(riderId: string) {
  const result = await db.query(
    `SELECT d.id, d.order_id, d.rider_id, d.status, d.rider_latitude, d.rider_longitude,
            r.name AS restaurant_name, o.delivery_address_snapshot, o.total_minor, o.currency
     FROM deliveries d JOIN orders o ON o.id = d.order_id
     JOIN restaurants r ON r.id = o.restaurant_id
     WHERE d.rider_id = $1 ORDER BY d.created_at DESC`,
    [riderId],
  );
  return result.rows;
}

export async function claimDelivery(riderId: string, deliveryId: string) {
  const result = await db.query(
    `UPDATE deliveries SET rider_id = $1, status = 'accepted', updated_at = NOW()
     WHERE id = $2 AND rider_id IS NULL AND status = 'assigned'
     RETURNING id, order_id, rider_id, status`,
    [riderId, deliveryId],
  );
  return result.rows[0] ?? null;
}

export async function updateDeliveryStatus(riderId: string, deliveryId: string, status: string) {
  const result = await db.query(
    `UPDATE deliveries SET status = $3, updated_at = NOW()
     WHERE id = $2 AND rider_id = $1 RETURNING id, order_id, rider_id, status`,
    [riderId, deliveryId, status],
  );
  return result.rows[0] ?? null;
}
