import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import type { AuthUser, AuthTokens } from './auth.types.js';

interface TokenPayload {
  sub: string;
  role: AuthUser['role'];
}

export function createTokens(user: AuthUser): AuthTokens {
  const payload: TokenPayload = { sub: user.id, role: user.role };
  return {
    accessToken: jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: '15m' }),
    refreshToken: jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: '30d' }),
  };
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
}
