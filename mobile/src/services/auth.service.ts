import { api } from './api';
import type { AuthResponse, User } from '../types/auth';

export interface RegisterInput {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const response = await api.post<{ success: true; data: AuthResponse }>('/auth/register', input);
  return response.data.data;
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  const response = await api.post<{ success: true; data: AuthResponse }>('/auth/login', input);
  return response.data.data;
}

export async function getCurrentUser(accessToken: string): Promise<User> {
  const response = await api.get<{ success: true; data: { user: User } }>('/auth/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data.data.user;
}
