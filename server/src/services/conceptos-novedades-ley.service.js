import { pool } from '../config/db.js';

export async function listarConceptos(empresaId) {
  if (empresaId) {
    const res = await pool.query(
      `SELECT id, empresa_id, codigo, nombre, tipo_concepto, categoria, naturaleza, unidad, es_fijo, es_imponible, activo
       FROM concepto
       WHERE empresa_id = $1
       ORDER BY codigo ASC`,
      [empresaId]
    );
    return res.rows;
  }

  const res = await pool.query(
    `SELECT id, empresa_id, codigo, nombre, tipo_concepto, categoria, naturaleza, unidad, es_fijo, es_imponible, activo
     FROM concepto
     ORDER BY codigo ASC`
  );
  return res.rows;
}

export async function crearConcepto(datos) {
  const res = await pool.query(
    `INSERT INTO concepto (
       empresa_id, codigo, nombre, tipo_concepto, categoria,
       naturaleza, unidad, es_fijo, es_imponible, activo
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE)
     RETURNING *`,
    [
      datos.empresaId,
      datos.codigo,
      datos.nombre,
      datos.tipoConcepto,
      datos.categoria,
      datos.naturaleza,
      datos.unidad,
      datos.esFijo,
      datos.esImponible,
    ]
  );
  return res.rows[0];
}