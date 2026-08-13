import { api } from './api';

export interface PaymentInitialization {
  payment: {
    id: string;
    order_id: string;
    reference: string;
    amount_minor: number;
    currency: string;
    status: string;
  };
  checkout: {
    reference: string;
    authorization_url: string;
    access_code: string;
  };
}

export async function initializePayment(accessToken: string, orderId: string): Promise<PaymentInitialization> {
  const response = await api.post<{ success: true; data: PaymentInitialization }>('/payments/initialize', { orderId }, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data.data;
}

export async function verifyPayment(accessToken: string, reference: string) {
  const response = await api.get(`/payments/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data.data;
}
