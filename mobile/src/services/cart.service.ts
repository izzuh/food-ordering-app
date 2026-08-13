import { api } from './api';
import type { Cart } from '../types/cart';

export async function getCart(accessToken: string): Promise<Cart | null> {
  const response = await api.get<{ success: true; data: { cart: Cart | null } }>('/cart', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data.data.cart;
}

export async function addToCart(accessToken: string, menuItemId: string, quantity = 1): Promise<Cart | null> {
  const response = await api.post<{ success: true; data: { cart: Cart } }>('/cart/items', { menuItemId, quantity }, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data.data.cart;
}

export async function updateCartItem(accessToken: string, menuItemId: string, quantity: number): Promise<Cart | null> {
  const response = await api.patch<{ success: true; data: { cart: Cart | null } }>(`/cart/items/${menuItemId}`, { quantity }, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data.data.cart;
}

export async function removeCartItem(accessToken: string, menuItemId: string): Promise<Cart | null> {
  const response = await api.delete<{ success: true; data: { cart: Cart | null } }>(`/cart/items/${menuItemId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data.data.cart;
}
