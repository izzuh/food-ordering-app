import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { apiRouter } from './routes/index.js';
import { handleStripeWebhook } from './modules/payments/stripe.webhook.js';

export const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors());

const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

// Stripe requires the exact raw request body for webhook signature verification.
app.post('/api/v1/payments/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    await handleStripeWebhook(req.body as Buffer, req.headers['stripe-signature']);
    res.status(200).json({ received: true });
  } catch {
    res.status(400).json({ received: false });
  }
});

app.use(express.json({ limit: '100kb' }));

app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({ success: true, service: 'food-ordering-api', status: 'ok' });
});

app.use('/api/v1', apiRateLimiter);
app.use('/api/v1/auth', authRateLimiter);
app.use('/api/v1', apiRouter);

app.use((_req, res) => {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found' } });
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);
  if (res.headersSent) return;
  res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } });
});
