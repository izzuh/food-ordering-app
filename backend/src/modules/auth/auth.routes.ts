import { Router } from 'express';
import { requireAuth } from './auth.middleware.js';
import { loginController, meController, refreshController, registerController } from './auth.controller.js';

export const authRouter = Router();

authRouter.post('/register', registerController);
authRouter.post('/login', loginController);
authRouter.post('/refresh', refreshController);
authRouter.get('/me', requireAuth, meController);
