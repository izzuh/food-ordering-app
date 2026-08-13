import type { Response } from 'express';
import type { AuthenticatedRequest } from './auth.middleware.js';
import { loginSchema, registerSchema } from './auth.validation.js';
import { AuthError, getCurrentUser, login, register } from './auth.service.js';

function handleError(error: unknown, res: Response): void {
  if (error instanceof AuthError) {
    const status = error.code === 'EMAIL_EXISTS' ? 409 : 401;
    res.status(status).json({ success: false, error: { code: error.code, message: error.code === 'EMAIL_EXISTS' ? 'Email is already registered' : 'Authentication failed' } });
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

export async function meController(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const user = await getCurrentUser(req.auth!.userId);
    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    handleError(error, res);
  }
}
