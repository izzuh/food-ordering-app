export type RestaurantOrderStatus = 'confirmed' | 'accepted' | 'preparing' | 'ready_for_delivery' | 'cancelled';

export const restaurantOrderTransitions: Record<RestaurantOrderStatus, RestaurantOrderStatus[]> = {
  confirmed: ['accepted', 'cancelled'],
  accepted: ['preparing', 'cancelled'],
  preparing: ['ready_for_delivery'],
  ready_for_delivery: [],
  cancelled: [],
};
