import express from 'express';
import cors from 'cors';
import { testConnection } from './config/db.js';
import routes from './routes/index.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    const dbOk = await testConnection();
    res.status(dbOk ? 200 : 503).json({
      status: dbOk ? 'ok' : 'degraded',
      database: dbOk ? 'connected' : 'unreachable',
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      database: 'error',
      message: err.message,
    });
  }
});

app.use('/api', routes);
app.use(errorMiddleware);

export default app;