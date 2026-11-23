import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.resolve(__dirname, '../db/migrations');

const { Pool } = pg;

const migrationConnectionString =
  process.env.DATABASE_URL_DIRECT || process.env.DATABASE_URL;

if (!migrationConnectionString) {
  throw new Error(
    'Falta DATABASE_URL_DIRECT o DATABASE_URL en el archivo .env'
  );
}

const pool = new Pool({
  connectionString: migrationConnectionString,
  max: 2,
  connectionTimeoutMillis: 15000,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function runMigrations() {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    const appliedResult = await client.query(
      'SELECT filename FROM schema_migrations'
    );
    const appliedSet = new Set(appliedResult.rows.map((r) => r.filename));

    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      if (appliedSet.has(file)) {
        console.log(`↷ Omitida (ya aplicada): ${file}`);
        continue;
      }

      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      console.log(`▶ Aplicando: ${file}...`);
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query(
          'INSERT INTO schema_migrations (filename) VALUES ($1)',
          [file]
        );
        await client.query('COMMIT');
        console.log(`✔ Aplicada con éxito: ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`✖ Error en ${file}:`, err.message);
        throw err;
      }
    }

    console.log('Migraciones finalizadas.');
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch((err) => {
  console.error('Fallo fatal en migraciones:', err);
  process.exit(1);
});