import type { Response } from 'express';
import type { AuthenticatedRequest } from './auth.middleware.js';
import { loginSchema, registerSchema } from './auth.validation.js';
import { AuthError, getCurrentUser, login, refresh, register } from './auth.service.js';

function handleError(error: unknown, res: Response): void {
  if (error instanceof AuthError) {
    const status = error.code === 'EMAIL_EXISTS' ? 409 : 401;
    const message = error.code === 'EMAIL_EXISTS'
      ? 'Email is already registered'
      : error.code === 'INVALID_CREDENTIALS'
        ? 'Email or password is incorrect'
        : 'Authentication failed';
    res.status(status).json({ success: false, error: { code: error.code, message } });
    return;
  }

  res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } });
}

export async function registerController(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const input = registerSchema.parse(req.body);
    const result = await register(input);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid registration data' } });
      return;
    }
    handleError(error, res);
  }
}

export async function loginController(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const input = loginSchema.parse(req.body);
    const result = await login(input.email, input.password);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid login data' } });
      return;
    }
    handleError(error, res);
  }
}

export async function refreshController(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const refreshToken = req.body?.refreshToken;
    if (typeof refreshToken !== 'string' || refreshToken.length < 10) {
      res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'refreshToken is required' } });
      return;
    }
    const result = await refresh(refreshToken);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    handleError(error, res);
  }
}

export async function meController(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const user = await getCurrentUser(req.auth!.userId);
    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    handleError(error, res);
  }
}
