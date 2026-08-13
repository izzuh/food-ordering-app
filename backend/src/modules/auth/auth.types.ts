export type UserRole = 'customer' | 'restaurant_owner' | 'rider' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
