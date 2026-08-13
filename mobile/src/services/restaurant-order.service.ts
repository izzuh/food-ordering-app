import { api } from './api';
export async function getRestaurantOrders(accessToken: string) { const response = await api.get('/restaurant-orders', { headers: { Authorization: `Bearer ${accessToken}` } }); return response.data.data.orders; }
export async function updateRestaurantOrderStatus(accessToken: string, orderId: string, status: string) { const response = await api.patch(`/restaurant-orders/${orderId}/status`, { status }, { headers: { Authorization: `Bearer ${accessToken}` } }); return response.data.data.order; }
