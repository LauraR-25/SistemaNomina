import { pool } from '../config/db.js';

export async function listarPrestamos(empresaId) {
  if (empresaId) {
    const res = await pool.query(
      `SELECT pr.*
       FROM prestamo pr
       INNER JOIN contrato c ON c.id = pr.contrato_id
       INNER JOIN persona p ON p.id = c.persona_id
       WHERE p.empresa_id = $1
       ORDER BY pr.created_at DESC`,
      [empresaId]
    );
    return res.rows;
  }

  const res = await pool.query(
    `SELECT *
     FROM prestamo
     ORDER BY created_at DESC`
  );
  return res.rows;
}