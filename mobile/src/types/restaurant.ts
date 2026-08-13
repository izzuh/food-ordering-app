export interface Restaurant {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  address: string;
  phone: string | null;
  image_url: string | null;
  is_open: boolean;
}

export interface MenuCategory {
  id: string;
  restaurant_id: string;
  name: string;
  sort_order: number;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price_minor: number;
  image_url: string | null;
  is_available: boolean;
}
