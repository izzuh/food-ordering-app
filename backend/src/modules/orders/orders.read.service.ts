import { findUserOrder, listUserOrders } from './orders.read.repository.js';

export function getUserOrders(userId: string) {
  return listUserOrders(userId);
}

export function getUserOrder(userId: string, orderId: string) {
  return findUserOrder(userId, orderId);
}
