import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';

// Side-effect import to ensure Firebase Admin boots up immediately
import('./config/firebaseadmin.js');

// route imports


const app = express();

// middlewares
app.use(cors({ origin: true }));
app.use(express.json());



// --- Routes ---
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from backend!');
});



// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// --- Route mounting ---


const PORT = ENV.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});