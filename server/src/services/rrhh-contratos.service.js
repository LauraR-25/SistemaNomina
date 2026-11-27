import { pool } from '../config/db.js';

function errorNegocio(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}
function errorDb(err, mensajes = {}) {
  if (err?.code === '23505') err.mensajePublico = mensajes.unique || err.mensajePublico || 'Ya existe un registro con esos datos.';
  if (err?.code === '23503') err.mensajePublico = mensajes.fk || err.mensajePublico || 'La referencia indicada no existe o no es válida.';
  return err;
}

export async function listarPersonas(empresaId) {
  if (!empresaId) throw errorNegocio(400, 'Debes indicar la empresa de la sesión (x-empresa-id).');
  const res = await pool.query(
    `SELECT id, empresa_id, cedula, rif, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
            fecha_nacimiento, sexo, estado_civil, nro_tlf, email, direccion, estado, created_at, updated_at
     FROM persona WHERE empresa_id = $1
     ORDER BY primer_apellido ASC, primer_nombre ASC`,
    [empresaId]
  );
  return res.rows;
}

export async function obtenerPersona(id, empresaId) {
  if (!empresaId) throw errorNegocio(400, 'Debes indicar la empresa de la sesión (x-empresa-id).');
  const res = await pool.query(
    `SELECT id, empresa_id, cedula, rif, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
            fecha_nacimiento, sexo, estado_civil, nro_tlf, email, direccion, estado, created_at, updated_at
     FROM persona WHERE id = $1 AND empresa_id = $2`,
    [id, empresaId]
  );
  return res.rows[0] || null;
}

export async function crearPersona(datos) {
  try {
    const res = await pool.query(
      `INSERT INTO persona (empresa_id, cedula, rif, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
                            fecha_nacimiento, sexo, estado_civil, nro_tlf, email, direccion, estado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       RETURNING id, empresa_id, cedula, rif, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
                 fecha_nacimiento, sexo, estado_civil, nro_tlf, email, direccion, estado, created_at, updated_at`,
      [datos.empresaId, datos.cedula, datos.rif, datos.primerNombre, datos.segundoNombre, datos.primerApellido, datos.segundoApellido,
       datos.fechaNacimiento, datos.sexo, datos.estadoCivil, datos.nroTlf, datos.email, datos.direccion, datos.estado || 'ACTIVO']
    );
    return res.rows[0];
  } catch (err) {
    throw errorDb(err, { unique: 'Ya existe una persona registrada con esa cédula en la empresa.' });
  }
}

export async function actualizarPersona(id, datos, empresaId) {
  const actual = await obtenerPersona(id, empresaId);
  if (!actual) throw errorNegocio(404, 'La persona no fue encontrada.');
  if (Object.prototype.hasOwnProperty.call(datos, 'cedula') && datos.cedula !== actual.cedula) {
    const contratos = await pool.query(`SELECT 1 FROM contrato WHERE persona_id = $1 LIMIT 1`, [id]);
    if (contratos.rows[0]) throw errorNegocio(409, 'No se puede cambiar la cédula porque la persona tiene contratos registrados.');
  }
  const s = {
    cedula: datos.cedula ?? actual.cedula,
    rif: Object.prototype.hasOwnProperty.call(datos, 'rif') ? datos.rif : actual.rif,
    primerNombre: datos.primerNombre ?? actual.primer_nombre,
    segundoNombre: Object.prototype.hasOwnProperty.call(datos, 'segundoNombre') ? datos.segundoNombre : actual.segundo_nombre,
    primerApellido: datos.primerApellido ?? actual.primer_apellido,
    segundoApellido: Object.prototype.hasOwnProperty.call(datos, 'segundoApellido') ? datos.segundoApellido : actual.segundo_apellido,
    fechaNacimiento: Object.prototype.hasOwnProperty.call(datos, 'fechaNacimiento') ? datos.fechaNacimiento : actual.fecha_nacimiento,
    sexo: Object.prototype.hasOwnProperty.call(datos, 'sexo') ? datos.sexo : actual.sexo,
    estadoCivil: Object.prototype.hasOwnProperty.call(datos, 'estadoCivil') ? datos.estadoCivil : actual.estado_civil,
    nroTlf: Object.prototype.hasOwnProperty.call(datos, 'nroTlf') ? datos.nroTlf : actual.nro_tlf,
    email: Object.prototype.hasOwnProperty.call(datos, 'email') ? datos.email : actual.email,
    direccion: Object.prototype.hasOwnProperty.call(datos, 'direccion') ? datos.direccion : actual.direccion,
    estado: datos.estado ?? actual.estado,
  };
  try {
    const res = await pool.query(
      `UPDATE persona SET cedula=$1, rif=$2, primer_nombre=$3, segundo_nombre=$4, primer_apellido=$5, segundo_apellido=$6,
        fecha_nacimiento=$7, sexo=$8, estado_civil=$9, nro_tlf=$10, email=$11, direccion=$12, estado=$13, updated_at=now()
       WHERE id=$14 AND empresa_id=$15
       RETURNING id, empresa_id, cedula, rif, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
                 fecha_nacimiento, sexo, estado_civil, nro_tlf, email, direccion, estado, created_at, updated_at`,
      [s.cedula, s.rif, s.primerNombre, s.segundoNombre, s.primerApellido, s.segundoApellido, s.fechaNacimiento, s.sexo, s.estadoCivil, s.nroTlf, s.email, s.direccion, s.estado, id, empresaId]
    );
    return res.rows[0];
  } catch (err) {
    throw errorDb(err, { unique: 'Ya existe una persona registrada con esa cédula en la empresa.' });
  }
}

export async function eliminarPersona(id, empresaId) {
  const actual = await obtenerPersona(id, empresaId);
  if (!actual) throw errorNegocio(404, 'La persona no fue encontrada.');
  const deps = await pool.query(
    `SELECT
      EXISTS(SELECT 1 FROM contrato WHERE persona_id = $1) AS contratos,
      EXISTS(SELECT 1 FROM cuenta_bancaria WHERE persona_id = $1) AS cuentas,
      EXISTS(SELECT 1 FROM usuario WHERE persona_id = $1) AS usuarios`,
    [id]
  );
  const d = deps.rows[0] || {};
  if (d.contratos || d.cuentas || d.usuarios) {
    throw errorNegocio(409, 'No se puede eliminar la persona porque tiene contratos, cuentas bancarias o un usuario asociado.');
  }
  await pool.query(`DELETE FROM persona WHERE id = $1 AND empresa_id = $2`, [id, empresaId]);
  return { id };
}
