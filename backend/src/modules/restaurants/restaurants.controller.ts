import type { Request, Response } from 'express';
import { getRestaurant, getRestaurantMenu, getRestaurants } from './restaurants.service.js';

export async function listRestaurantsController(_req: Request, res: Response): Promise<void> {
  const restaurants = await getRestaurants();
  res.json({ success: true, data: { restaurants } });
}

export async function getRestaurantController(req: Request, res: Response): Promise<void> {
  const restaurant = await getRestaurant(req.params.id);
  if (!restaurant) {
    res.status(404).json({ success: false, error: { code: 'RESTAURANT_NOT_FOUND', message: 'Restaurant not found' } });
    return;
  }
  res.json({ success: true, data: { restaurant } });
}

export async function getRestaurantMenuController(req: Request, res: Response): Promise<void> {
  const restaurant = await getRestaurant(req.params.id);
  if (!restaurant) {
    res.status(404).json({ success: false, error: { code: 'RESTAURANT_NOT_FOUND', message: 'Restaurant not found' } });
    return;
  }
  const menu = await getRestaurantMenu(req.params.id);
  res.json({ success: true, data: menu });
}
