import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({
    success: true,
    service: 'food-ordering-api',
    status: 'ok',
  });
});

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
    },
  });
});
