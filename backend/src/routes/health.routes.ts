import { Router } from 'express';
import { db } from '../db/pool.js';
export const healthRouter = Router();
healthRouter.get('/', async (_req, res) => { try { await db.query('SELECT 1'); res.json({ success: true, service: 'food-ordering-api', status: 'ok' }); } catch { res.status(503).json({ success: false, service: 'food-ordering-api', status: 'unavailable' }); } });
