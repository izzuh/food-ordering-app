import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from '../../config/env.js';
import { findPaymentByReference, markPaymentFailed, markPaymentPaid } from './payments.repository.js';

function verifySignature(rawBody: Buffer, signatureHeader: string | undefined) {
  if (!signatureHeader) throw new Error('MISSING_STRIPE_SIGNATURE');
  const parts = Object.fromEntries(signatureHeader.split(',').map(part => part.split('=')));
  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature) throw new Error('INVALID_STRIPE_SIGNATURE');
  const age = Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) throw new Error('EXPIRED_STRIPE_SIGNATURE');
  const expected = createHmac('sha256', env.STRIPE_WEBHOOK_SECRET).update(`${timestamp}.${rawBody.toString('utf8')}`).digest('hex');
  const a = Buffer.from(expected, 'utf8'); const b = Buffer.from(signature, 'utf8');
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new Error('INVALID_STRIPE_SIGNATURE');
}

export async function handleStripeWebhook(rawBody: Buffer, signatureHeader: string | string[] | undefined) {
  const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;
  verifySignature(rawBody, signature);
  const event = JSON.parse(rawBody.toString('utf8')) as { type: string; data?: { object?: any } };
  const intent = event.data?.object;
  const reference = intent?.metadata?.reference;
  if (!reference) return;
  const payment = await findPaymentByReference(reference);
  if (!payment) return;
  if (intent.amount !== payment.amount_minor || intent.currency?.toLowerCase() !== payment.currency.toLowerCase()) throw new Error('PAYMENT_AMOUNT_MISMATCH');
  if (event.type === 'payment_intent.succeeded') await markPaymentPaid(payment.id, payment.order_id);
  if (event.type === 'payment_intent.payment_failed' || event.type === 'payment_intent.canceled') await markPaymentFailed(payment.id);
}
