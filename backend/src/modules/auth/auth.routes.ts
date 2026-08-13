import { Router } from 'express';
import { requireAuth } from './auth.middleware.js';
import { loginController, meController, registerController } from './auth.controller.js';

export const authRouter = Router();

authRouter.post('/register', registerController);
authRouter.post('/login', loginController);
authRouter.get('/me', requireAuth, meController);
