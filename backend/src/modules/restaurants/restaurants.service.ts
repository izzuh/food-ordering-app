import { findRestaurantById, listMenu, listRestaurants } from './restaurants.repository.js';

export async function getRestaurants() {
  return listRestaurants();
}

export async function getRestaurant(id: string) {
  return findRestaurantById(id);
}

export async function getRestaurantMenu(id: string) {
  return listMenu(id);
}
