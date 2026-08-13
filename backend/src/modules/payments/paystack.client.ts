import { env } from '../../config/env.js';
import type { InitializePaymentResult } from './payments.types.js';

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export async function initializePaystackPayment(input: {
  email: string;
  amountMinor: number;
  reference: string;
  callbackUrl?: string;
}): Promise<InitializePaymentResult> {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: input.email,
      amount: input.amountMinor,
      reference: input.reference,
      currency: 'NGN',
      callback_url: input.callbackUrl,
    }),
  });

  const body = await response.json() as {
    status: boolean;
    message: string;
    data?: InitializePaymentResult;
  };

  if (!response.ok || !body.status || !body.data) {
    throw new Error(`PAYMENT_INITIALIZATION_FAILED:${body.message}`);
  }

  return body.data;
}

export async function verifyPaystackPayment(reference: string) {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}` },
  });

  const body = await response.json() as {
    status: boolean;
    message: string;
    data?: { status: string; amount: number; reference: string; currency: string };
  };

  if (!response.ok || !body.status || !body.data) {
    throw new Error(`PAYMENT_VERIFICATION_FAILED:${body.message}`);
  }

  return body.data;
}
