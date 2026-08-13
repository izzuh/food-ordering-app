import { api } from './api';

export interface OrderSummary {
  id: string;
  restaurant_id: string;
  restaurant_name: string;
  status: string;
  payment_status: string;
  subtotal_minor: number;
  delivery_fee_minor: number;
  total_minor: number;
  currency: string;
  created_at: string;
}

export async function checkout(accessToken: string, addressId: string) {
  const response = await api.post('/orders/checkout', { addressId }, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data.data.order;
}

export async function getOrders(accessToken: string): Promise<OrderSummary[]> {
  const response = await api.get<{ success: true; data: { orders: OrderSummary[] } }>('/orders', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data.data.orders;
}

export async function getOrder(accessToken: string, orderId: string) {
  const response = await api.get(`/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data.data.order;
}
