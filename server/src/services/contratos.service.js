import { pool } from '../config/db.js';

function errorNegocio(status, message) { const err = new Error(message); err.status = status; return err; }
function errorDb(err, mensajes = {}) {
  if (err?.code === '23505') err.mensajePublico = mensajes.unique || err.mensajePublico;
  if (err?.code === '23503') err.mensajePublico = mensajes.fk || err.mensajePublico;
  return err;
}
function requerirEmpresa(empresaId) { if (!empresaId) throw errorNegocio(400, 'Debes indicar la empresa de la sesión (x-empresa-id).'); }

const SELECT_CONTRATO = `
  SELECT c.id, c.empresa_id, c.persona_id, c.cargo_id, c.fecha_inicio, c.fecha_fin,
         c.tipo_pago, c.frecuencia_pago, c.horas_semanales, c.estado, c.created_at,
         p.cedula, p.primer_nombre, p.segundo_nombre, p.primer_apellido, p.segundo_apellido, p.estado AS persona_estado,
         cg.nombre AS cargo_nombre, cg.activo AS cargo_activo,
         sv.monto AS salario_vigente, sv.vigente_desde AS salario_vigente_desde
  FROM contrato c
  INNER JOIN persona p ON p.id = c.persona_id
  INNER JOIN cargo cg ON cg.id = c.cargo_id
  LEFT JOIN LATERAL (
    SELECT monto, vigente_desde FROM contrato_salario cs
    WHERE cs.contrato_id = c.id AND cs.vigente_hasta IS NULL
    ORDER BY cs.vigente_desde DESC LIMIT 1
  ) sv ON TRUE`;

function mapContrato(r) {
  return {
    ...r,
    persona: { id: r.persona_id, cedula: r.cedula, primer_nombre: r.primer_nombre, segundo_nombre: r.segundo_nombre, primer_apellido: r.primer_apellido, segundo_apellido: r.segundo_apellido, estado: r.persona_estado },
    cargo: { id: r.cargo_id, nombre: r.cargo_nombre, activo: r.cargo_activo },
  };
}

export async function listarContratos(empresaId) {
  requerirEmpresa(empresaId);
  const res = await pool.query(`${SELECT_CONTRATO} WHERE c.empresa_id = $1 ORDER BY c.created_at DESC`, [empresaId]);
  return res.rows.map(mapContrato);
}

export async function obtenerContrato(id, empresaId) {
  requerirEmpresa(empresaId);
  const res = await pool.query(`${SELECT_CONTRATO} WHERE c.id = $1 AND c.empresa_id = $2`, [id, empresaId]);
  if (!res.rows[0]) return null;
  const historial = await pool.query(
    `SELECT id, contrato_id, monto, vigente_desde, vigente_hasta, motivo
     FROM contrato_salario WHERE contrato_id = $1 ORDER BY vigente_desde DESC`,
    [id]
  );
  return { ...mapContrato(res.rows[0]), historial_salarios: historial.rows };
}

async function asegurarRefs(db, empresaId, personaId, cargoId) {
  const p = await db.query(`SELECT id FROM persona WHERE id=$1 AND empresa_id=$2`, [personaId, empresaId]);
  if (!p.rows[0]) throw errorNegocio(400, 'La persona indicada no existe en la empresa de la sesión.');
  const c = await db.query(`SELECT id FROM cargo WHERE id=$1 AND empresa_id=$2`, [cargoId, empresaId]);
  if (!c.rows[0]) throw errorNegocio(400, 'El cargo indicado no existe en la empresa de la sesión.');
}

async function validarSolapamiento(db, empresaId, personaId, fechaInicio, fechaFin, excluirId = null) {
  const params = [empresaId, personaId, fechaInicio, fechaFin || null];
  let excl = '';
  if (excluirId) { params.push(excluirId); excl = ` AND id <> $5`; }
  const res = await db.query(
    `SELECT id FROM contrato
     WHERE empresa_id=$1 AND persona_id=$2 AND estado='VIGENTE'
       AND daterange(fecha_inicio, COALESCE(fecha_fin,'infinity'::date), '[]')
           && daterange($3::date, COALESCE($4::date,'infinity'::date), '[]')
       ${excl} LIMIT 1`,
    params
  );
  if (res.rows[0]) throw errorNegocio(409, 'La persona ya tiene un contrato vigente con fechas solapadas.');
}

export async function crearContrato(datos, empresaId) {
  requerirEmpresa(empresaId);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await asegurarRefs(client, empresaId, datos.personaId, datos.cargoId);
    if (datos.estado === 'VIGENTE') await validarSolapamiento(client, empresaId, datos.personaId, datos.fechaInicio, datos.fechaFin);
    const c = await client.query(
      `INSERT INTO contrato (empresa_id, persona_id, cargo_id, fecha_inicio, fecha_fin, tipo_pago, frecuencia_pago, horas_semanales, estado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
      [empresaId, datos.personaId, datos.cargoId, datos.fechaInicio, datos.fechaFin, datos.tipoPago, datos.frecuenciaPago, datos.horasSemanales, datos.estado]
    );
    await client.query(
      `INSERT INTO contrato_salario (contrato_id, monto, vigente_desde, vigente_hasta, motivo)
       VALUES ($1,$2,$3,NULL,'Salario inicial')`,
      [c.rows[0].id, datos.monto, datos.fechaInicio]
    );
    await client.query('COMMIT');
    return obtenerContrato(c.rows[0].id, empresaId);
  } catch (err) { await client.query('ROLLBACK'); throw errorDb(err, { fk: 'La persona o el cargo indicado no existe en la empresa.' }); }
  finally { client.release(); }
}
export async function actualizarContrato(id, datos, empresaId) {
  requerirEmpresa(empresaId);
  const actual = await obtenerContrato(id, empresaId);
  if (!actual) throw errorNegocio(404, 'El contrato no fue encontrado.');
  if ((Object.prototype.hasOwnProperty.call(datos, 'tipoPago') && datos.tipoPago !== actual.tipo_pago) ||
      (Object.prototype.hasOwnProperty.call(datos, 'frecuenciaPago') && datos.frecuenciaPago !== actual.frecuencia_pago)) {
    const deps = await pool.query(
      `SELECT EXISTS(SELECT 1 FROM recibo_pago WHERE contrato_id=$1) AS recibos,
              EXISTS(SELECT 1 FROM resultado_prenomina WHERE contrato_id=$1) AS prenomina`,
      [id]
    );
    const d = deps.rows[0] || {};
    if (d.recibos || d.prenomina) throw errorNegocio(409, 'No se puede cambiar el tipo o la frecuencia de pago porque el contrato tiene recibos o ejecuciones de prenómina.');
  }
  const s = {
    personaId: datos.personaId ?? actual.persona_id,
    cargoId: datos.cargoId ?? actual.cargo_id,
    fechaInicio: datos.fechaInicio ?? actual.fecha_inicio?.toISOString?.().slice(0,10) ?? String(actual.fecha_inicio).slice(0,10),
    fechaFin: Object.prototype.hasOwnProperty.call(datos,'fechaFin') ? datos.fechaFin : (actual.fecha_fin ? String(actual.fecha_fin).slice(0,10) : null),
    tipoPago: datos.tipoPago ?? actual.tipo_pago,
    frecuenciaPago: datos.frecuenciaPago ?? actual.frecuencia_pago,
    horasSemanales: Object.prototype.hasOwnProperty.call(datos,'horasSemanales') ? datos.horasSemanales : actual.horas_semanales,
    estado: datos.estado ?? actual.estado,
  };
  if (s.fechaFin && s.fechaFin < s.fechaInicio) throw errorNegocio(400, 'La fecha de fin no puede ser anterior a la fecha de inicio.');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await asegurarRefs(client, empresaId, s.personaId, s.cargoId);
    if (s.estado === 'VIGENTE') await validarSolapamiento(client, empresaId, s.personaId, s.fechaInicio, s.fechaFin, id);
    await client.query(
      `UPDATE contrato SET persona_id=$1,cargo_id=$2,fecha_inicio=$3,fecha_fin=$4,tipo_pago=$5,frecuencia_pago=$6,horas_semanales=$7,estado=$8
       WHERE id=$9 AND empresa_id=$10`,
      [s.personaId,s.cargoId,s.fechaInicio,s.fechaFin,s.tipoPago,s.frecuenciaPago,s.horasSemanales,s.estado,id,empresaId]
    );
    await client.query('COMMIT');
    return obtenerContrato(id, empresaId);
  } catch (err) { await client.query('ROLLBACK'); throw errorDb(err, { fk: 'La persona o el cargo indicado no existe en la empresa.' }); }
  finally { client.release(); }
}

export async function cambiarEstadoContrato(id, estado, empresaId) {
  return actualizarContrato(id, { estado }, empresaId);
}

export async function listarHistorialSalarios(contratoId, empresaId) {
  const contrato = await obtenerContrato(contratoId, empresaId);
  if (!contrato) throw errorNegocio(404, 'El contrato no fue encontrado.');
  return contrato.historial_salarios;
}

export async function registrarCambioSalario(contratoId, datos, empresaId) {
  requerirEmpresa(empresaId);
  const contrato = await obtenerContrato(contratoId, empresaId);
  if (!contrato) throw errorNegocio(404, 'El contrato no fue encontrado.');
  const vigente = contrato.historial_salarios.find((h) => h.vigente_hasta === null);
  if (!vigente) throw errorNegocio(409, 'El contrato no tiene un salario vigente para cerrar.');
  const fechaInicioContrato = String(contrato.fecha_inicio).slice(0,10);
  const vigenteDesdeActual = String(vigente.vigente_desde).slice(0,10);
  if (datos.vigenteDesde < vigenteDesdeActual) throw errorNegocio(400, 'La fecha del nuevo salario no puede ser anterior a la del salario vigente.');
  if (datos.vigenteDesde < fechaInicioContrato) throw errorNegocio(400, 'La fecha del nuevo salario no puede ser anterior a la fecha de inicio del contrato.');
  const cierre = new Date(datos.vigenteDesde + 'T00:00:00Z');
  cierre.setUTCDate(cierre.getUTCDate() - 1);
  const vigenteHasta = cierre.toISOString().slice(0,10);
  if (vigenteHasta < vigenteDesdeActual) throw errorNegocio(400, 'La fecha del nuevo salario debe ser posterior a la vigencia actual.');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const solape = await client.query(
      `SELECT 1 FROM contrato_salario
       WHERE contrato_id=$1 AND daterange(vigente_desde, COALESCE(vigente_hasta,'infinity'::date),'[]')
         && daterange($2::date,'infinity'::date,'[]') LIMIT 1`,
      [contratoId, datos.vigenteDesde]
    );
    if (solape.rows[0]) throw errorNegocio(409, 'El cambio salarial se solapa con un registro existente.');
    await client.query(`UPDATE contrato_salario SET vigente_hasta=$1 WHERE id=$2`, [vigenteHasta, vigente.id]);
    await client.query(
      `INSERT INTO contrato_salario (contrato_id, monto, vigente_desde, vigente_hasta, motivo)
       VALUES ($1,$2,$3,NULL,$4)`,
      [contratoId, datos.monto, datos.vigenteDesde, datos.motivo]
    );
    await client.query('COMMIT');
    return obtenerContrato(contratoId, empresaId);
  } catch (err) { await client.query('ROLLBACK'); throw err; }
  finally { client.release(); }
}
