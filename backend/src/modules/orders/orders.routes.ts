import { Router } from 'express';
import { requireAuth, type AuthenticatedRequest } from '../auth/auth.middleware.js';
import { checkout } from './orders.service.js';
import { getUserOrder, getUserOrders } from './orders.read.service.js';

export const ordersRouter = Router();
ordersRouter.use(requireAuth);

ordersRouter.get('/', async (req: AuthenticatedRequest, res) => {
  const orders = await getUserOrders(req.auth!.userId);
  res.json({ success: true, data: { orders } });
});

ordersRouter.get('/:id', async (req: AuthenticatedRequest, res) => {
  const order = await getUserOrder(req.auth!.userId, req.params.id);
  if (!order) {
    res.status(404).json({ success: false, error: { code: 'ORDER_NOT_FOUND', message: 'Order not found' } });
    return;
  }
  res.json({ success: true, data: { order } });
});

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
