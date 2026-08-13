import { Router } from 'express';
import { authRouter } from '../modules/auth/auth.routes.js';
import { restaurantsRouter } from '../modules/restaurants/restaurants.routes.js';
import { healthRouter } from './health.routes.js';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/restaurants', restaurantsRouter);
