import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';
import './config/firebaseadmin.js';

import webhooksRouter from './routes/webhooks.js';
import lettersRouter from './routes/letters.routes.js';
import checkoutRouter from './routes/checkout.js';
import pdfRouter from './routes/pdf.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

// Webhooks must come before express.json() — Stripe needs the raw body.
// Mounted at root so Stripe CLI forwarding (localhost:8080/webhook) works
app.use(webhooksRouter);

app.use(cors({ origin: ENV.CLIENT_URL || true }));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Spacey Mail API!');
});

app.use('/api/letters', lettersRouter);
app.use('/api/letters', pdfRouter);
app.use('/api', checkoutRouter);

app.use(errorHandler);

const PORT = ENV.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received: closing HTTP server');
  server.close(() => console.log('HTTP server closed'));
});
