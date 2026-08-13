export type UserRole = 'customer' | 'restaurant_owner' | 'rider' | 'admin';

export interface User {
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

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}
