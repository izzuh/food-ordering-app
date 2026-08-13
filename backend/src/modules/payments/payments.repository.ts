import { db } from '../../db/pool.js';

export async function createPayment(input: { orderId: string; userId: string; reference: string; amountMinor: number }) {
  const result = await db.query(
    `INSERT INTO payments (order_id, user_id, provider, reference, amount_minor, currency, status)
     VALUES ($1, $2, 'stripe', $3, $4, 'GBP', 'pending')
     RETURNING id, order_id, provider, reference, amount_minor, currency, status`,
    [input.orderId, input.userId, input.reference, input.amountMinor],
  );
  return result.rows[0];
}

export async function findPaymentByReference(reference: string) {
  const result = await db.query(`SELECT id, order_id, user_id, provider, reference, amount_minor, currency, status FROM payments WHERE reference = $1 LIMIT 1`, [reference]);
  return result.rows[0] ?? null;
}

export async function markPaymentPaid(paymentId: string, orderId: string) {
  const client = await db.connect();
  try { await client.query('BEGIN'); await client.query(`UPDATE payments SET status = 'paid', paid_at = NOW(), updated_at = NOW() WHERE id = $1`, [paymentId]); await client.query(`UPDATE orders SET payment_status = 'paid', status = 'confirmed', updated_at = NOW() WHERE id = $1 AND payment_status <> 'paid'`, [orderId]); await client.query('COMMIT'); }
  catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); }
}
export async function markPaymentFailed(paymentId: string) { await db.query(`UPDATE payments SET status = 'failed', updated_at = NOW() WHERE id = $1 AND status <> 'paid'`, [paymentId]); }
