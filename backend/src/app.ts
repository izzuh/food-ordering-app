import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { apiRouter } from './routes/index.js';
import { handleStripeWebhook } from './modules/payments/stripe.webhook.js';

export const app = express();

app.use(helmet());
app.use(cors());

// Stripe requires the exact raw request body for webhook signature verification.
app.post('/api/v1/payments/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    await handleStripeWebhook(req.body as Buffer, req.headers['stripe-signature']);
    res.status(200).json({ received: true });
  } catch {
    res.status(400).json({ received: false });
  }
});

app.use(express.json());

app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({ success: true, service: 'food-ordering-api', status: 'ok' });
});

app.use('/api/v1', apiRouter);

app.use((_req, res) => {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found' } });
});
