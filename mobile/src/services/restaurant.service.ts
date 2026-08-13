import { api } from './api';
import type { MenuCategory, MenuItem, Restaurant } from '../types/restaurant';

export async function getRestaurants(): Promise<Restaurant[]> {
  const response = await api.get<{ success: true; data: { restaurants: Restaurant[] } }>('/restaurants');
  return response.data.data.restaurants;
}

export async function getRestaurant(id: string): Promise<Restaurant> {
  const response = await api.get<{ success: true; data: { restaurant: Restaurant } }>(`/restaurants/${id}`);
  return response.data.data.restaurant;
}

export async function getRestaurantMenu(id: string): Promise<{ categories: MenuCategory[]; items: MenuItem[] }> {
  const response = await api.get<{ success: true; data: { categories: MenuCategory[]; items: MenuItem[] } }>(`/restaurants/${id}/menu`);
  return response.data.data;
}
