import { env } from '../../config/env.js';
import type { InitializePaymentResult } from './payments.types.js';

const STRIPE_BASE_URL = 'https://api.stripe.com/v1';

function authHeaders() {
  return { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, 'Content-Type': 'application/x-www-form-urlencoded' };
}

export async function createStripePaymentIntent(input: { amountMinor: number; currency: string; reference: string; customerEmail: string }): Promise<InitializePaymentResult> {
  const params = new URLSearchParams({
    amount: String(input.amountMinor), currency: input.currency.toLowerCase(),
    'metadata[reference]': input.reference, receipt_email: input.customerEmail,
    automatic_payment_methods: JSON.stringify({ enabled: true }),
  });
  const response = await fetch(`${STRIPE_BASE_URL}/payment_intents`, { method: 'POST', headers: authHeaders(), body: params });
  const body = await response.json() as { id?: string; client_secret?: string; status?: string; error?: { message?: string } };
  if (!response.ok || !body.id || !body.client_secret) throw new Error(`PAYMENT_INITIALIZATION_FAILED:${body.error?.message ?? 'Stripe error'}`);
  return { id: body.id, client_secret: body.client_secret, status: body.status ?? 'requires_payment_method' };
}

export async function retrieveStripePaymentIntent(paymentIntentId: string) {
  const response = await fetch(`${STRIPE_BASE_URL}/payment_intents/${encodeURIComponent(paymentIntentId)}`, { headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` } });
  const body = await response.json() as { id?: string; amount?: number; currency?: string; status?: string; metadata?: { reference?: string } };
  if (!response.ok || !body.id) throw new Error('PAYMENT_VERIFICATION_FAILED');
  return body;
}
