import { createUser, findUserByEmail, findUserById } from './auth.repository.js';
import { hashPassword, verifyPassword } from './password.js';
import { createTokens } from './tokens.js';
import type { AuthTokens, AuthUser } from './auth.types.js';

export class AuthError extends Error {
  constructor(public readonly code: 'EMAIL_EXISTS' | 'INVALID_CREDENTIALS' | 'USER_NOT_FOUND') {
    super(code);
  }
}

export async function register(input: {
  name: string;
  email: string;
  phone?: string;
  password: string;
}): Promise<{ user: AuthUser; tokens: AuthTokens }> {
  const existing = await findUserByEmail(input.email);
  if (existing) throw new AuthError('EMAIL_EXISTS');

  const user = await createUser({
    name: input.name,
    email: input.email,
    phone: input.phone,
    passwordHash: await hashPassword(input.password),
  });

  return { user, tokens: createTokens(user) };
}

export async function login(email: string, password: string): Promise<{ user: AuthUser; tokens: AuthTokens }> {
  const record = await findUserByEmail(email);
  if (!record || !(await verifyPassword(password, record.password_hash))) {
    throw new AuthError('INVALID_CREDENTIALS');
  }

  const { password_hash: _passwordHash, ...user } = record;
  return { user, tokens: createTokens(user) };
}

export async function getCurrentUser(id: string): Promise<AuthUser> {
  const user = await findUserById(id);
  if (!user) throw new AuthError('USER_NOT_FOUND');
  return user;
}
