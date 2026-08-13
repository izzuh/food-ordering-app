import { Router } from 'express';
import { checkDatabaseConnection } from '../db/health.js';

export const healthRouter = Router();

healthRouter.get('/', async (_req, res) => {
  try {
    await checkDatabaseConnection();
    res.status(200).json({
      success: true,
      service: 'food-ordering-api',
      database: 'ok',
    });
  } catch {
    res.status(503).json({
      success: false,
      service: 'food-ordering-api',
      database: 'unavailable',
    });
  }
});
