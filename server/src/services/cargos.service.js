import { pool } from '../config/db.js';

function errorNegocio(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function errorDb(err, mensajes = {}) {
  if (err?.code === '23505') err.mensajePublico = mensajes.unique || err.mensajePublico;
  if (err?.code === '23503') err.mensajePublico = mensajes.fk || err.mensajePublico;
  return err;
}

export async function listarCargos(empresaId) {
  if (!empresaId) throw errorNegocio(400, 'Debes indicar la empresa de la sesión (x-empresa-id).');
  const res = await pool.query(
    `SELECT id, empresa_id, nombre, descripcion, activo
     FROM cargo WHERE empresa_id = $1 ORDER BY activo DESC, nombre ASC`,
    [empresaId]
  );
  return res.rows;
}

export async function obtenerCargo(id, empresaId) {
  if (!empresaId) throw errorNegocio(400, 'Debes indicar la empresa de la sesión (x-empresa-id).');
  const res = await pool.query(
    `SELECT id, empresa_id, nombre, descripcion, activo
     FROM cargo WHERE id = $1 AND empresa_id = $2`,
    [id, empresaId]
  );
  return res.rows[0] || null;
}

export async function crearCargo(datos, empresaId) {
  if (!empresaId) throw errorNegocio(400, 'Debes indicar la empresa de la sesión (x-empresa-id).');
  const res = await pool.query(
    `INSERT INTO cargo (empresa_id, nombre, descripcion, activo)
     VALUES ($1, $2, $3, $4)
     RETURNING id, empresa_id, nombre, descripcion, activo`,
    [empresaId, datos.nombre, datos.descripcion, datos.activo]
  );
  return res.rows[0];
}

export async function actualizarCargo(id, datos, empresaId) {
  const actual = await obtenerCargo(id, empresaId);
  if (!actual) throw errorNegocio(404, 'El cargo no fue encontrado.');
  const siguiente = {
    nombre: datos.nombre ?? actual.nombre,
    descripcion: Object.prototype.hasOwnProperty.call(datos, 'descripcion') ? datos.descripcion : actual.descripcion,
    activo: Object.prototype.hasOwnProperty.call(datos, 'activo') ? datos.activo : actual.activo,
  };
  const res = await pool.query(
    `UPDATE cargo SET nombre = $1, descripcion = $2, activo = $3
     WHERE id = $4 AND empresa_id = $5
     RETURNING id, empresa_id, nombre, descripcion, activo`,
    [siguiente.nombre, siguiente.descripcion, siguiente.activo, id, empresaId]
  );
  return res.rows[0];
}

export async function eliminarCargo(id, empresaId) {
  const actual = await obtenerCargo(id, empresaId);
  if (!actual) throw errorNegocio(404, 'El cargo no fue encontrado.');
  const uso = await pool.query(`SELECT 1 FROM contrato WHERE cargo_id = $1 LIMIT 1`, [id]);
  if (uso.rows[0]) {
    throw errorNegocio(409, 'No se puede eliminar el cargo porque tiene contratos asociados. Desactívalo en su lugar.');
  }
  await pool.query(`DELETE FROM cargo WHERE id = $1 AND empresa_id = $2`, [id, empresaId]);
  return { id };
}



