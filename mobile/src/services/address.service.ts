import { api } from './api';

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

export async function getAddresses(accessToken: string): Promise<Address[]> {
  const response = await api.get<{ success: true; data: { addresses: Address[] } }>('/addresses', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data.data.addresses;
}

export async function createAddress(accessToken: string, input: {
  recipientName: string;
  phone: string;
  addressLine: string;
  city: string;
  postcode: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
}): Promise<Address> {
  const response = await api.post<{ success: true; data: { address: Address } }>('/addresses', input, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data.data.address;
}
