import { randomUUID } from 'node:crypto';
import { db } from '../../db/pool.js';
import { initializePaystackPayment, verifyPaystackPayment } from './paystack.client.js';
import { createPayment, findPaymentByReference, markPaymentFailed, markPaymentPaid } from './payments.repository.js';

export async function initializePayment(userId: string, orderId: string) {
  const result = await db.query<{ id: string; email: string; total_minor: number; payment_status: string }>(
    `SELECT o.id, u.email, o.total_minor, o.payment_status
     FROM orders o JOIN users u ON u.id = o.user_id
     WHERE o.id = $1 AND o.user_id = $2 LIMIT 1`,
    [orderId, userId],
  );
  const order = result.rows[0];
  if (!order) throw new Error('ORDER_NOT_FOUND');
  if (order.payment_status === 'paid') throw new Error('ORDER_ALREADY_PAID');

  const reference = `food-${order.id}-${randomUUID()}`;
  const payment = await createPayment({ orderId, userId, reference, amountMinor: order.total_minor });
  const initialized = await initializePaystackPayment({
    email: order.email,
    amountMinor: order.total_minor,
    reference,
  });
  return { payment, checkout: initialized };
}

export async function verifyPayment(userId: string, reference: string) {
  const payment = await findPaymentByReference(reference);
  if (!payment || payment.user_id !== userId) throw new Error('PAYMENT_NOT_FOUND');

  const verified = await verifyPaystackPayment(reference);
  if (verified.reference !== payment.reference || verified.currency !== payment.currency || verified.amount !== payment.amount_minor) {
    throw new Error('PAYMENT_AMOUNT_MISMATCH');
  }

  if (verified.status === 'success') {
    await markPaymentPaid(payment.id, payment.order_id);
    return { status: 'paid', orderId: payment.order_id, reference };
  }

  await markPaymentFailed(payment.id);
  return { status: 'failed', orderId: payment.order_id, reference };
}
