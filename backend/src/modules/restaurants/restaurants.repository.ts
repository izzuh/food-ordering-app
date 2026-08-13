import { db } from '../../db/pool.js';
import type { MenuCategory, MenuItem, Restaurant } from './restaurants.types.js';

export async function listRestaurants(): Promise<Restaurant[]> {
  const result = await db.query<Restaurant>(
    `SELECT id, owner_id, name, description, address, phone, image_url, is_open
     FROM restaurants ORDER BY name ASC`,
  );
  return result.rows;
}

export async function findRestaurantById(id: string): Promise<Restaurant | null> {
  const result = await db.query<Restaurant>(
    `SELECT id, owner_id, name, description, address, phone, image_url, is_open
     FROM restaurants WHERE id = $1 LIMIT 1`,
    [id],
  );
  return result.rows[0] ?? null;
}

export async function listMenu(restaurantId: string): Promise<{ categories: MenuCategory[]; items: MenuItem[] }> {
  const [categories, items] = await Promise.all([
    db.query<MenuCategory>(
      `SELECT id, restaurant_id, name, sort_order FROM menu_categories
       WHERE restaurant_id = $1 ORDER BY sort_order ASC, name ASC`,
      [restaurantId],
    ),
    db.query<MenuItem>(
      `SELECT id, restaurant_id, category_id, name, description, price_minor, image_url, is_available
       FROM menu_items WHERE restaurant_id = $1 ORDER BY name ASC`,
      [restaurantId],
    ),
  ]);
  return { categories: categories.rows, items: items.rows };
}
