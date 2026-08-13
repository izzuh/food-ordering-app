import { Router } from 'express';
import { requireAuth, type AuthenticatedRequest } from '../auth/auth.middleware.js';
import { restaurantOrderTransitions } from './restaurant-orders.types.js';
import { getRestaurantOrder, listRestaurantOrders, updateRestaurantOrderStatus } from './restaurant-orders.repository.js';

export const restaurantOrdersRouter = Router();
restaurantOrdersRouter.use(requireAuth);

function requireRestaurantOwner(req: AuthenticatedRequest, res: any, next: any) {
  if (req.auth?.role !== 'restaurant_owner' && req.auth?.role !== 'admin') {
    res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Restaurant owner access required' } });
    return;
  }
  next();
}

restaurantOrdersRouter.use(requireRestaurantOwner);

restaurantOrdersRouter.get('/', async (req: AuthenticatedRequest, res) => {
  const orders = await listRestaurantOrders(req.auth!.userId);
  res.json({ success: true, data: { orders } });
});

restaurantOrdersRouter.get('/:id', async (req: AuthenticatedRequest, res) => {
  const order = await getRestaurantOrder(req.auth!.userId, req.params.id);
  if (!order) {
    res.status(404).json({ success: false, error: { code: 'ORDER_NOT_FOUND', message: 'Order not found' } });
    return;
  }
  res.json({ success: true, data: { order } });
});

restaurantOrdersRouter.patch('/:id/status', async (req: AuthenticatedRequest, res) => {
  const order = await getRestaurantOrder(req.auth!.userId, req.params.id);
  if (!order) {
    res.status(404).json({ success: false, error: { code: 'ORDER_NOT_FOUND', message: 'Order not found' } });
    return;
  }

  const nextStatus = req.body.status;
  const allowed = restaurantOrderTransitions[order.status as keyof typeof restaurantOrderTransitions] ?? [];
  if (!allowed.includes(nextStatus)) {
    res.status(409).json({ success: false, error: { code: 'INVALID_STATUS_TRANSITION', message: `Cannot move order from ${order.status} to ${nextStatus}` } });
    return;
  }

  const updated = await updateRestaurantOrderStatus(req.auth!.userId, req.params.id, nextStatus);
  res.json({ success: true, data: { order: updated } });
});
