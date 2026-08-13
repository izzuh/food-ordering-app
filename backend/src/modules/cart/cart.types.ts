export interface CartItem {
  id: string;
  cart_id: string;
  menu_item_id: string;
  quantity: number;
  name: string;
  unit_price_minor: number;
  image_url: string | null;
}

export interface Cart {
  id: string;
  user_id: string;
  restaurant_id: string | null;
  items: CartItem[];
  subtotal_minor: number;
}
