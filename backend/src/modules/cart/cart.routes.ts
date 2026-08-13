import { Router } from 'express';
import { requireAuth, type AuthenticatedRequest } from '../auth/auth.middleware.js';
import { addToCart, getUserCart, removeFromCart, updateCartItem } from './cart.service.js';

export const cartRouter = Router();
cartRouter.use(requireAuth);

cartRouter.get('/', async (req: AuthenticatedRequest, res) => {
  const cart = await getUserCart(req.auth!.userId);
  res.json({ success: true, data: { cart } });
});

cartRouter.post('/items', async (req: AuthenticatedRequest, res) => {
  try {
    const { menuItemId, quantity } = req.body;
    const cart = await addToCart(req.auth!.userId, menuItemId, Number(quantity));
    res.status(201).json({ success: true, data: { cart } });
  } catch (error) {
    const code = error instanceof Error ? error.message : 'CART_ERROR';
    const status = code === 'CART_RESTAURANT_MISMATCH' ? 409 : 400;
    res.status(status).json({ success: false, error: { code, message: 'Unable to update cart' } });
  }
});

cartRouter.patch('/items/:menuItemId', async (req: AuthenticatedRequest, res) => {
  const cart = await updateCartItem(req.auth!.userId, req.params.menuItemId, Number(req.body.quantity));
  res.json({ success: true, data: { cart } });
});

cartRouter.delete('/items/:menuItemId', async (req: AuthenticatedRequest, res) => {
  const cart = await removeFromCart(req.auth!.userId, req.params.menuItemId);
  res.json({ success: true, data: { cart } });
});
