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

export async function listarPaises() {
  const res = await pool.query(
    `SELECT id, codigo_iso, nombre, moneda_codigo, activo
     FROM pais
     WHERE activo = TRUE
     ORDER BY nombre ASC`
  );
  return res.rows;
}

export async function listarBancos() {
  const res = await pool.query(
    `SELECT id, codigo, nombre, activo
     FROM banco
     WHERE activo = TRUE
     ORDER BY nombre ASC`
  );
  return res.rows;
}

export async function listarEmpresas(empresaId) {
  if (!empresaId) throw errorNegocio(400, 'Debes indicar la empresa de la sesión (x-empresa-id).');
  const res = await pool.query(
    `SELECT id, pais_id, rif, razon_social, nombre_comercial, moneda_codigo, activo
     FROM empresa
     WHERE activo = TRUE AND id = $1
     ORDER BY created_at DESC`,
    [empresaId]
  );
  return res.rows;
}

export async function obtenerEmpresaPorId(id, empresaId) {
  if (!empresaId) throw errorNegocio(400, 'Debes indicar la empresa de la sesión (x-empresa-id).');
  const res = await pool.query(
    `SELECT id, pais_id, rif, razon_social, nombre_comercial, moneda_codigo, activo
     FROM empresa
     WHERE id = $1 AND id = $2`,
    [id, empresaId]
  );
  return res.rows[0] || null;
}

export async function crearEmpresa(datos) {
  try {
    const res = await pool.query(
      `INSERT INTO empresa (pais_id, rif, razon_social, nombre_comercial, moneda_codigo, activo)
       VALUES ($1, $2, $3, $4, $5, TRUE)
       RETURNING id, pais_id, rif, razon_social, nombre_comercial, moneda_codigo, activo`,
      [datos.paisId, datos.rif, datos.razonSocial, datos.nombreComercial, datos.monedaCodigo]
    );
    return res.rows[0];
  } catch (err) {
    throw errorDb(err, {
      unique: 'Ya existe una empresa registrada con ese RIF en el país seleccionado.',
      fk: 'El país seleccionado no existe.',
    });
  }
}

export async function actualizarEmpresa(id, datos, empresaId) {
  const actual = await obtenerEmpresaPorId(id, empresaId);
  if (!actual) throw errorNegocio(404, 'La empresa no fue encontrada.');

  const dependencias = await pool.query(
    `SELECT
      EXISTS(SELECT 1 FROM persona WHERE empresa_id = $1) AS tiene_personas,
      EXISTS(SELECT 1 FROM usuario WHERE empresa_id = $1) AS tiene_usuarios,
      EXISTS(SELECT 1 FROM contrato WHERE empresa_id = $1) AS tiene_contratos`,
    [id]
  );
  const dep = dependencias.rows[0] || {};
  const hayDependencias = dep.tiene_personas || dep.tiene_usuarios || dep.tiene_contratos;
  if (hayDependencias) {
    if (datos.paisId && Number(datos.paisId) !== Number(actual.pais_id)) {
      throw errorNegocio(409, 'No se puede cambiar el país de la empresa porque tiene datos dependientes.');
    }
    if (datos.rif && datos.rif !== actual.rif) {
      throw errorNegocio(409, 'No se puede cambiar el RIF de la empresa porque tiene datos dependientes.');
    }
  }

  const siguiente = {
    paisId: datos.paisId ?? actual.pais_id,
    rif: datos.rif ?? actual.rif,
    razonSocial: datos.razonSocial ?? actual.razon_social,
    nombreComercial:
      Object.prototype.hasOwnProperty.call(datos, 'nombreComercial')
        ? datos.nombreComercial
        : actual.nombre_comercial,
    monedaCodigo: datos.monedaCodigo ?? actual.moneda_codigo,
  };

  try {
    const res = await pool.query(
      `UPDATE empresa
       SET pais_id = $1, rif = $2, razon_social = $3, nombre_comercial = $4, moneda_codigo = $5
       WHERE id = $6
       RETURNING id, pais_id, rif, razon_social, nombre_comercial, moneda_codigo, activo`,
      [
        siguiente.paisId,
        siguiente.rif,
        siguiente.razonSocial,
        siguiente.nombreComercial,
        siguiente.monedaCodigo,
        id,
      ]
    );
    return res.rows[0];
  } catch (err) {
    throw errorDb(err, {
      unique: 'Ya existe una empresa registrada con ese RIF en el país seleccionado.',
      fk: 'El país seleccionado no existe.',
    });
  }
}

async function asegurarPersonaEmpresa(personaId, empresaId, db = pool) {
  const res = await db.query(`SELECT id, empresa_id FROM persona WHERE id = $1`, [personaId]);
  const persona = res.rows[0];
  if (!persona) throw errorNegocio(400, 'La persona indicada no existe.');
  if (empresaId && String(persona.empresa_id) !== String(empresaId)) {
    throw errorNegocio(403, 'No puedes registrar cuentas para una persona de otra empresa.');
  }
  return persona;
}

async function aplicarPrincipalUnica(db, personaId, cuentaId, esPrincipal, activa) {
  if (!activa && esPrincipal) {
    throw errorNegocio(400, 'Una cuenta inactiva no puede ser principal.');
  }
  if (esPrincipal && activa) {
    await db.query(
      `UPDATE cuenta_bancaria
       SET es_principal = FALSE
       WHERE persona_id = $1 AND id <> $2 AND es_principal = TRUE`,
      [personaId, cuentaId]
    );
  }
  const conflicto = await db.query(
    `SELECT id FROM cuenta_bancaria
     WHERE persona_id = $1 AND activa = TRUE AND es_principal = TRUE AND id <> $2
     LIMIT 1`,
    [personaId, cuentaId]
  );
  if (conflicto.rows[0]) {
    throw errorNegocio(409, 'La persona ya tiene otra cuenta activa marcada como principal.');
  }
}

export async function listarCuentasBancarias(empresaId) {
  if (!empresaId) throw errorNegocio(400, 'Debes indicar la empresa de la sesión (x-empresa-id).');
  const res = await pool.query(
    `SELECT cb.id, cb.persona_id, cb.banco_id, cb.tipo_cuenta, cb.nro_cuenta,
            cb.es_principal, cb.activa,
            b.nombre AS banco_nombre, b.codigo AS banco_codigo,
            p.empresa_id,
            CONCAT_WS(' ', p.primer_nombre, p.primer_apellido) AS titular
     FROM cuenta_bancaria cb
     INNER JOIN banco b ON b.id = cb.banco_id
     INNER JOIN persona p ON p.id = cb.persona_id
     WHERE p.empresa_id = $1
     ORDER BY cb.activa DESC, b.nombre ASC, cb.nro_cuenta ASC`,
    [empresaId]
  );
  return res.rows;
}

export async function obtenerCuentaBancaria(id, empresaId) {
  if (!empresaId) throw errorNegocio(400, 'Debes indicar la empresa de la sesión (x-empresa-id).');
  const res = await pool.query(
    `SELECT cb.id, cb.persona_id, cb.banco_id, cb.tipo_cuenta, cb.nro_cuenta,
            cb.es_principal, cb.activa,
            b.nombre AS banco_nombre, b.codigo AS banco_codigo,
            p.empresa_id,
            CONCAT_WS(' ', p.primer_nombre, p.primer_apellido) AS titular
     FROM cuenta_bancaria cb
     INNER JOIN banco b ON b.id = cb.banco_id
     INNER JOIN persona p ON p.id = cb.persona_id
     WHERE cb.id = $1 AND p.empresa_id = $2`,
    [id, empresaId]
  );
  return res.rows[0] || null;
}

export async function crearCuentaBancaria(datos, empresaId) {
  if (!empresaId) throw errorNegocio(400, 'Debes indicar la empresa de la sesión (x-empresa-id).');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await asegurarPersonaEmpresa(datos.personaId, empresaId, client);
    const res = await client.query(
      `INSERT INTO cuenta_bancaria (persona_id, banco_id, tipo_cuenta, nro_cuenta, es_principal, activa)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [datos.personaId, datos.bancoId, datos.tipoCuenta, datos.nroCuenta, datos.esPrincipal, datos.activa]
    );
    await aplicarPrincipalUnica(client, datos.personaId, res.rows[0].id, datos.esPrincipal, datos.activa);
    await client.query('COMMIT');
    return obtenerCuentaBancaria(res.rows[0].id, empresaId);
  } catch (err) {
    await client.query('ROLLBACK');
    throw errorDb(err, { fk: 'La persona o el banco indicado no existe.' });
  } finally {
    client.release();
  }
}

export async function actualizarCuentaBancaria(id, datos, empresaId) {
  if (!empresaId) throw errorNegocio(400, 'Debes indicar la empresa de la sesión (x-empresa-id).');
  const actual = await obtenerCuentaBancaria(id, empresaId);
  if (!actual) throw errorNegocio(404, 'La cuenta bancaria no fue encontrada.');

  const personaId = datos.personaId ?? actual.persona_id;
  const siguiente = {
    personaId,
    bancoId: datos.bancoId ?? actual.banco_id,
    tipoCuenta: datos.tipoCuenta ?? actual.tipo_cuenta,
    nroCuenta: datos.nroCuenta ?? actual.nro_cuenta,
    esPrincipal:
      Object.prototype.hasOwnProperty.call(datos, 'esPrincipal') ? datos.esPrincipal : actual.es_principal,
    activa: Object.prototype.hasOwnProperty.call(datos, 'activa') ? datos.activa : actual.activa,
  };

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await asegurarPersonaEmpresa(personaId, empresaId, client);
    await client.query(
      `UPDATE cuenta_bancaria
       SET persona_id = $1, banco_id = $2, tipo_cuenta = $3, nro_cuenta = $4, es_principal = $5, activa = $6
       WHERE id = $7`,
      [
        siguiente.personaId,
        siguiente.bancoId,
        siguiente.tipoCuenta,
        siguiente.nroCuenta,
        siguiente.esPrincipal,
        siguiente.activa,
        id,
      ]
    );
    await aplicarPrincipalUnica(client, siguiente.personaId, id, siguiente.esPrincipal, siguiente.activa);
    await client.query('COMMIT');
    return obtenerCuentaBancaria(id, empresaId);
  } catch (err) {
    await client.query('ROLLBACK');
    throw errorDb(err, { fk: 'La persona o el banco indicado no existe.' });
  } finally {
    client.release();
  }
}

export async function eliminarCuentaBancaria(id, empresaId) {
  if (!empresaId) throw errorNegocio(400, 'Debes indicar la empresa de la sesión (x-empresa-id).');
  const actual = await obtenerCuentaBancaria(id, empresaId);
  if (!actual) throw errorNegocio(404, 'La cuenta bancaria no fue encontrada.');

  try {
    await pool.query(`DELETE FROM cuenta_bancaria WHERE id = $1`, [id]);
    return { id };
  } catch (err) {
    if (err?.code === '23503') {
      throw errorNegocio(
        409,
        'No se puede eliminar la cuenta bancaria porque está en uso por otros registros.'
      );
    }
    throw err;
  }
}