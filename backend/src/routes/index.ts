import { Router } from 'express';
import { authRouter } from '../modules/auth/auth.routes.js';
import { addressesRouter } from '../modules/addresses/addresses.routes.js';
import { cartRouter } from '../modules/cart/cart.routes.js';
import { ordersRouter } from '../modules/orders/orders.routes.js';
import { paymentsRouter } from '../modules/payments/payments.routes.js';
import { restaurantOrdersRouter } from '../modules/restaurant-orders/restaurant-orders.routes.js';
import { restaurantsRouter } from '../modules/restaurants/restaurants.routes.js';
import { healthRouter } from './health.routes.js';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/restaurants', restaurantsRouter);
apiRouter.use('/cart', cartRouter);
apiRouter.use('/orders', ordersRouter);
apiRouter.use('/payments', paymentsRouter);
apiRouter.use('/addresses', addressesRouter);
apiRouter.use('/restaurant-orders', restaurantOrdersRouter);
