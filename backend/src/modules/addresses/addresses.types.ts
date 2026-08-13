export interface Address {
  id: string;
  user_id: string;
  recipient_name: string;
  phone: string;
  address_line: string;
  city: string;
  postcode: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  is_default: boolean;
}
