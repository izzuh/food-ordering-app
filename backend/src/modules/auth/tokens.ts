import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import type { AuthTokens, AuthUser } from './auth.types.js';
interface AccessPayload { sub: string; role: AuthUser['role']; }
export function createTokens(user: AuthUser): AuthTokens { const payload: AccessPayload = { sub: user.id, role: user.role }; return { accessToken: jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: '15m' }), refreshToken: jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: '30d' }) }; }
export function verifyAccessToken(token: string): AccessPayload { const payload = jwt.verify(token, env.JWT_ACCESS_SECRET); if (typeof payload === 'string' || !payload.sub || !payload.role) throw new Error('INVALID_TOKEN'); return { sub: payload.sub, role: payload.role as AuthUser['role'] }; }
