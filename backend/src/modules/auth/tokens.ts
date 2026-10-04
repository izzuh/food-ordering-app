import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import type { AuthTokens, AuthUser } from './auth.types.js';

interface TokenPayload {
  sub: string;
  role: AuthUser['role'];
}

function parsePayload(payload: string | jwt.JwtPayload): TokenPayload {
  if (typeof payload === 'string' || typeof payload.sub !== 'string' || typeof payload.role !== 'string') {
    throw new Error('INVALID_TOKEN');
  }
  return { sub: payload.sub, role: payload.role as AuthUser['role'] };
}

export function createTokens(user: AuthUser): AuthTokens {
  const payload: TokenPayload = { sub: user.id, role: user.role };
  return {
    accessToken: jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: '15m' }),
    refreshToken: jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: '30d' }),
  };
}

export function verifyAccessToken(token: string): TokenPayload {
  return parsePayload(jwt.verify(token, env.JWT_ACCESS_SECRET));
}

export function verifyRefreshToken(token: string): TokenPayload {
  return parsePayload(jwt.verify(token, env.JWT_REFRESH_SECRET));
}
