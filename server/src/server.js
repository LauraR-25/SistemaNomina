import dotenv from 'dotenv';
import app from './app.js';
import { closePool } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

async function shutdown(signal) {
  console.log(`\nRecibido ${signal}, cerrando servidor...`);
  server.close(async () => {
    await closePool();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));