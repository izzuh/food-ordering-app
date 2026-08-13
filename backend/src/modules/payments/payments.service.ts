import { randomUUID } from 'node:crypto';
import { db } from '../../db/pool.js';
import { createStripePaymentIntent, retrieveStripePaymentIntent } from './stripe.client.js';
import { createPayment, findPaymentByReference, markPaymentFailed, markPaymentPaid } from './payments.repository.js';

export async function initializePayment(userId: string, orderId: string) {
  const result = await db.query<{ id: string; email: string; total_minor: number; currency: string; payment_status: string }>(
    `SELECT o.id, u.email, o.total_minor, o.currency, o.payment_status
     FROM orders o JOIN users u ON u.id = o.user_id
     WHERE o.id = $1 AND o.user_id = $2 LIMIT 1`, [orderId, userId]);
  const order = result.rows[0];
  if (!order) throw new Error('ORDER_NOT_FOUND');
  if (order.payment_status === 'paid') throw new Error('ORDER_ALREADY_PAID');

  const reference = `food-${order.id}-${randomUUID()}`;
  const payment = await createPayment({ orderId, userId, reference, amountMinor: order.total_minor });
  const intent = await createStripePaymentIntent({ amountMinor: order.total_minor, currency: order.currency, reference, customerEmail: order.email });
  return { payment, checkout: intent };
}

export async function verifyPayment(userId: string, paymentIntentId: string) {
  const intent = await retrieveStripePaymentIntent(paymentIntentId);
  const reference = intent.metadata?.reference;
  if (!reference) throw new Error('PAYMENT_REFERENCE_MISSING');
  const payment = await findPaymentByReference(reference);
  if (!payment || payment.user_id !== userId) throw new Error('PAYMENT_NOT_FOUND');
  if (intent.id !== paymentIntentId || intent.amount !== payment.amount_minor || intent.currency?.toLowerCase() !== payment.currency.toLowerCase()) throw new Error('PAYMENT_AMOUNT_MISMATCH');

  if (intent.status === 'succeeded') {
    await markPaymentPaid(payment.id, payment.order_id);
    return { status: 'paid', orderId: payment.order_id, reference, paymentIntentId };
  }
  if (['canceled'].includes(intent.status ?? '')) await markPaymentFailed(payment.id);
  return { status: intent.status, orderId: payment.order_id, reference, paymentIntentId };
}
