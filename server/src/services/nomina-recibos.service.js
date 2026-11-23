import { pool } from '../config/db.js';

export async function listarPeriodosNomina(empresaId) {
  if (empresaId) {
    const res = await pool.query(
      `SELECT *
       FROM periodo_nomina
       WHERE empresa_id = $1
       ORDER BY created_at DESC`,
      [empresaId]
    );
    return res.rows;
  }

  const res = await pool.query(
    `SELECT *
     FROM periodo_nomina
     ORDER BY created_at DESC`
  );
  return res.rows;
}