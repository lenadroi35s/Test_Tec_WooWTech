import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { errorHandler } from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);

app.use(errorHandler);

const start = async (): Promise<void> => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
  });
};

start();

export default app;