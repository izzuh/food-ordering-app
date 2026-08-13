export type DeliveryStatus = 'assigned' | 'accepted' | 'picked_up' | 'delivered' | 'cancelled';

export interface Delivery {
  id: string;
  order_id: string;
  rider_id: string | null;
  status: DeliveryStatus;
  pickup_latitude: number | null;
  pickup_longitude: number | null;
  rider_latitude: number | null;
  rider_longitude: number | null;
}
