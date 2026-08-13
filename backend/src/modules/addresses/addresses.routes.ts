import { Router } from 'express';
import { requireAuth, type AuthenticatedRequest } from '../auth/auth.middleware.js';
import { createAddress, listAddresses } from './addresses.repository.js';

export const addressesRouter = Router();
addressesRouter.use(requireAuth);

addressesRouter.get('/', async (req: AuthenticatedRequest, res) => {
  const addresses = await listAddresses(req.auth!.userId);
  res.json({ success: true, data: { addresses } });
});

addressesRouter.post('/', async (req: AuthenticatedRequest, res) => {
  const { recipientName, phone, addressLine, city, postcode, country, latitude, longitude, isDefault } = req.body;
  if (!recipientName || !phone || !addressLine || !city || !postcode) {
    res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Required address fields are missing' } });
    return;
  }
  const address = await createAddress(req.auth!.userId, {
    recipientName, phone, addressLine, city, postcode, country, latitude, longitude, isDefault,
  });
  res.status(201).json({ success: true, data: { address } });
});
