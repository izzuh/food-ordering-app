import { api } from './api';

export async function getOrderDelivery(accessToken: string, orderId: string) {
  const response = await api.get(`/delivery/order/${orderId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data.data.delivery;
}

export async function getAvailableDeliveries(accessToken: string) {
  const response = await api.get('/delivery/available', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data.data.deliveries;
}

export async function claimDelivery(accessToken: string, deliveryId: string) {
  const response = await api.post(`/delivery/${deliveryId}/claim`, {}, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data.data.delivery;
}

export async function updateDeliveryStatus(accessToken: string, deliveryId: string, status: string) {
  const response = await api.patch(`/delivery/${deliveryId}/status`, { status }, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data.data.delivery;
}

export async function updateRiderLocation(accessToken: string, deliveryId: string, latitude: number, longitude: number) {
  const response = await api.patch(`/delivery/${deliveryId}/location`, { latitude, longitude }, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data.data.delivery;
}
