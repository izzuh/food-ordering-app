import { Router } from 'express';
import { requireAuth, type AuthenticatedRequest } from '../auth/auth.middleware.js';
import { checkout } from './orders.service.js';

export const ordersRouter = Router();
ordersRouter.use(requireAuth);

ordersRouter.post('/checkout', async (req: AuthenticatedRequest, res) => {
  try {
    const { addressId } = req.body;
    if (!addressId || typeof addressId !== 'string') {
      res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'addressId is required' } });
      return;
    }
    const order = await checkout(req.auth!.userId, addressId);
    res.status(201).json({ success: true, data: { order } });
  } catch (error) {
    const code = error instanceof Error ? error.message : 'CHECKOUT_ERROR';
    const status = code === 'ADDRESS_NOT_FOUND' ? 404 : 400;
    res.status(status).json({ success: false, error: { code, message: 'Unable to create order' } });
  }
});
