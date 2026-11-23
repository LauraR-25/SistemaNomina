import { pool } from '../config/db.js';

export async function listarPersonas(empresaId) {
  if (empresaId) {
    const res = await pool.query(
      `SELECT id, empresa_id, cedula, rif, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, email, nro_tlf, estado
       FROM persona
       WHERE empresa_id = $1
       ORDER BY primer_apellido ASC, primer_nombre ASC`,
      [empresaId]
    );
    return res.rows;
  }

  const res = await pool.query(
    `SELECT id, empresa_id, cedula, rif, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, email, nro_tlf, estado
     FROM persona
     ORDER BY primer_apellido ASC, primer_nombre ASC`
  );
  return res.rows;
}

export async function crearPersona(datos) {
  const res = await pool.query(
    `INSERT INTO persona (empresa_id, cedula, primer_nombre, primer_apellido, email, nro_tlf, estado)
     VALUES ($1, $2, $3, $4, $5, $6, 'ACTIVO')
     RETURNING *`,
    [datos.empresaId, datos.cedula, datos.primerNombre, datos.primerApellido, datos.email, datos.nroTlf]
  );
  return res.rows[0];
}