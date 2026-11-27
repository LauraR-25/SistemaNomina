import { pool, withTransaction } from '../config/db.js';
import { naturalezaEsperada } from '../validators/conceptos-novedades-ley.validator.js';

const COLUMNAS_CONCEPTO = `id, empresa_id, codigo, nombre, tipo_concepto, categoria,
  naturaleza, unidad, es_fijo, es_imponible, activo, created_at`;

const CAMPOS_BLOQUEADOS = [
  'codigo',
  'tipo_concepto',
  'naturaleza',
  'categoria',
  'unidad',
];

const CONCEPTO_JSON = `json_build_object(
  'id', c.id,
  'empresa_id', c.empresa_id,
  'codigo', c.codigo,
  'nombre', c.nombre,
  'tipo_concepto', c.tipo_concepto,
  'categoria', c.categoria,
  'naturaleza', c.naturaleza,
  'unidad', c.unidad,
  'es_fijo', c.es_fijo,
  'es_imponible', c.es_imponible,
  'activo', c.activo
)`;

function errorNegocio(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function errorDb(err, mensajes = {}) {
  if (err?.code === '23505') {
    err.mensajePublico =
      mensajes.unique ||
      err.mensajePublico ||
      'Ya existe un registro con esos datos.';
  }
  if (err?.code === '23503') {
    err.mensajePublico =
      mensajes.fk ||
      err.mensajePublico ||
      'La referencia indicada no existe o no es válida.';
  }
  return err;
}

function requerirEmpresa(empresaId) {
  if (!empresaId) {
    throw errorNegocio(400, 'Debes indicar la empresa de la sesión (x-empresa-id).');
  }
}

async function obtenerUsoConcepto(db, conceptoId) {
  const res = await db.query(
    `SELECT
       EXISTS(SELECT 1 FROM concepto_persona WHERE concepto_id = $1) AS concepto_persona,
       EXISTS(SELECT 1 FROM novedad WHERE concepto_id = $1) AS novedad,
       EXISTS(SELECT 1 FROM prestamo WHERE concepto_id = $1) AS prestamo,
       EXISTS(SELECT 1 FROM tipo_aporte_ley
              WHERE concepto_deduccion_id = $1 OR concepto_patronal_id = $1) AS tipo_aporte_ley,
       EXISTS(SELECT 1 FROM detalle_prenomina WHERE concepto_id = $1) AS detalle_prenomina,
       EXISTS(SELECT 1 FROM detalle_recibo WHERE concepto_id = $1) AS detalle_recibo`,
    [conceptoId]
  );
  const uso = res.rows[0] ?? {};
  const tablas = [
    'concepto_persona',
    'novedad',
    'prestamo',
    'tipo_aporte_ley',
    'detalle_prenomina',
    'detalle_recibo',
  ].filter((tabla) => Boolean(uso[tabla]));

  return { ...uso, tablas, enUso: tablas.length > 0 };
}

function verificarCoherenciaConcepto(concepto) {
  const esperada = naturalezaEsperada(concepto.tipo_concepto);
  if (concepto.naturaleza !== esperada) {
    throw errorNegocio(
      400,
      `La naturaleza debe ser ${esperada} cuando tipo_concepto es ${concepto.tipo_concepto}.`
    );
  }
}

function verificarUnidadTipoValor(unidad, tipoValor) {
  if (tipoValor === 'PORCENTAJE_SALDO' && unidad !== 'MONTO') {
    throw errorNegocio(
      400,
      'PORCENTAJE_SALDO solo es compatible con conceptos de unidad MONTO.'
    );
  }
}

async function asegurarContrato(db, contratoId, empresaId, { exigirVigente = false } = {}) {
  const res = await db.query(
    `SELECT id, empresa_id, estado FROM contrato WHERE id = $1 AND empresa_id = $2`,
    [contratoId, empresaId]
  );
  const contrato = res.rows[0];

  if (!contrato) {
    throw errorNegocio(400, 'El contrato no existe en la empresa de la sesión.');
  }
  if (exigirVigente && contrato.estado !== 'VIGENTE') {
    throw errorNegocio(400, 'Solo se pueden asignar conceptos a contratos VIGENTES.');
  }
  return contrato;
}

async function asegurarConceptoAsignable(db, conceptoId, empresaId) {
  const res = await db.query(
    `SELECT id, empresa_id, unidad, activo FROM concepto
     WHERE id = $1 AND empresa_id = $2`,
    [conceptoId, empresaId]
  );
  const concepto = res.rows[0];

  if (!concepto) {
    throw errorNegocio(400, 'El concepto no existe en la empresa de la sesión.');
  }
  if (!concepto.activo) {
    throw errorNegocio(400, 'El concepto indicado no está activo.');
  }
  return concepto;
}

async function asegurarSinSolape(db, asignacion, excluirId = null) {
  const res = await db.query(
    `SELECT id
     FROM concepto_persona
     WHERE contrato_id = $1
       AND concepto_id = $2
       AND activo = TRUE
       AND ($5::uuid IS NULL OR id <> $5::uuid)
       AND ($4::date IS NULL OR fecha_inicio <= $4::date)
       AND (fecha_fin IS NULL OR $3::date IS NULL OR fecha_fin >= $3::date)
     LIMIT 1`,
    [
      asignacion.contratoId,
      asignacion.conceptoId,
      asignacion.fechaInicio,
      asignacion.fechaFin,
      excluirId,
    ]
  );

  if (res.rows[0]) {
    throw errorNegocio(
      409,
      'Ya existe una asignación activa del mismo concepto para este contrato con fechas solapadas.'
    );
  }
}

async function obtenerAsignacionDb(db, id, empresaId) {
  const res = await db.query(
    `SELECT cp.id, cp.contrato_id, cp.concepto_id, cp.tipo_valor, cp.valor,
            cp.fecha_inicio, cp.fecha_fin, cp.activo,
            ${CONCEPTO_JSON} AS concepto
     FROM concepto_persona cp
     INNER JOIN contrato ct ON ct.id = cp.contrato_id
     INNER JOIN concepto c ON c.id = cp.concepto_id
     WHERE cp.id = $1 AND ct.empresa_id = $2 AND c.empresa_id = $2`,
    [id, empresaId]
  );
  return res.rows[0] ?? null;
}

export async function listarConceptos(empresaId) {
  requerirEmpresa(empresaId);
  const res = await pool.query(
    `SELECT ${COLUMNAS_CONCEPTO}
     FROM concepto
     WHERE empresa_id = $1
     ORDER BY codigo ASC`,
    [empresaId]
  );
  return res.rows;
}

export async function crearConcepto(datos) {
  requerirEmpresa(datos?.empresaId);
  verificarCoherenciaConcepto({
    tipo_concepto: datos.tipoConcepto,
    naturaleza: datos.naturaleza,
  });

  try {
    const res = await pool.query(
      `INSERT INTO concepto (
         empresa_id, codigo, nombre, tipo_concepto, categoria,
         naturaleza, unidad, es_fijo, es_imponible, activo
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING ${COLUMNAS_CONCEPTO}`,
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
        datos.activo ?? true,
      ]
    );
    return res.rows[0];
  } catch (err) {
    throw errorDb(err, {
      unique: 'Ya existe un concepto con ese código en la empresa.',
      fk: 'La empresa indicada no existe o no es válida.',
    });
  }
}

export async function obtenerConcepto(id, empresaId) {
  requerirEmpresa(empresaId);
  const res = await pool.query(
    `SELECT ${COLUMNAS_CONCEPTO} FROM concepto WHERE id = $1 AND empresa_id = $2`,
    [id, empresaId]
  );
  return res.rows[0] ?? null;
}

export async function actualizarConcepto(id, datos, empresaId) {
  const actual = await obtenerConcepto(id, empresaId);
  if (!actual) throw errorNegocio(404, 'El concepto no fue encontrado.');

  const final = {
    codigo: datos.codigo ?? actual.codigo,
    nombre: datos.nombre ?? actual.nombre,
    tipo_concepto: datos.tipoConcepto ?? actual.tipo_concepto,
    categoria: datos.categoria ?? actual.categoria,
    naturaleza: datos.naturaleza ?? actual.naturaleza,
    unidad: datos.unidad ?? actual.unidad,
    es_fijo: datos.esFijo ?? actual.es_fijo,
    es_imponible: datos.esImponible ?? actual.es_imponible,
    activo: datos.activo ?? actual.activo,
  };
  verificarCoherenciaConcepto(final);

  const cambioBloqueado = CAMPOS_BLOQUEADOS.find(
    (campo) => final[campo] !== actual[campo]
  );
  if (cambioBloqueado) {
    const uso = await obtenerUsoConcepto(pool, id);
    if (uso.enUso) {
      throw errorNegocio(
        409,
        `El concepto está en uso (${uso.tablas.join(', ')}). No se puede cambiar ${cambioBloqueado}; solo puedes modificar nombre, es_fijo, es_imponible o activo. Si ya no lo necesitas, desactívalo.`
      );
    }
  }

  try {
    const res = await pool.query(
      `UPDATE concepto
       SET codigo = $1, nombre = $2, tipo_concepto = $3, categoria = $4,
           naturaleza = $5, unidad = $6, es_fijo = $7, es_imponible = $8, activo = $9
       WHERE id = $10 AND empresa_id = $11
       RETURNING ${COLUMNAS_CONCEPTO}`,
      [
        final.codigo,
        final.nombre,
        final.tipo_concepto,
        final.categoria,
        final.naturaleza,
        final.unidad,
        final.es_fijo,
        final.es_imponible,
        final.activo,
        id,
        empresaId,
      ]
    );
    return res.rows[0];
  } catch (err) {
    throw errorDb(err, {
      unique: 'Ya existe un concepto con ese código en la empresa.',
      fk: 'La referencia indicada no existe o no es válida.',
    });
  }
}

export async function desactivarConcepto(id, empresaId) {
  return actualizarConcepto(id, { activo: false }, empresaId);
}

export async function eliminarConcepto(id, empresaId) {
  const actual = await obtenerConcepto(id, empresaId);
  if (!actual) throw errorNegocio(404, 'El concepto no fue encontrado.');

  if (actual.categoria === 'LEY' || actual.categoria === 'SALARIO_BASE') {
    throw errorNegocio(
      409,
      'Los conceptos de categoría LEY o SALARIO_BASE son de sistema y no se pueden eliminar; solo se pueden desactivar.'
    );
  }

  const uso = await obtenerUsoConcepto(pool, id);
  if (uso.enUso) {
    throw errorNegocio(
      409,
      `No se puede eliminar el concepto porque está en uso (${uso.tablas.join(', ')}). Te sugerimos desactivarlo.`
    );
  }

  try {
    await pool.query(`DELETE FROM concepto WHERE id = $1 AND empresa_id = $2`, [
      id,
      empresaId,
    ]);
    return { id };
  } catch (err) {
    throw errorDb(err, {
      fk: 'No se puede eliminar el concepto porque está referenciado por otros registros.',
    });
  }
}

export async function listarAsignacionesPorContrato(contratoId, empresaId) {
  requerirEmpresa(empresaId);
  await asegurarContrato(pool, contratoId, empresaId);

  const res = await pool.query(
    `SELECT cp.id, cp.contrato_id, cp.concepto_id, cp.tipo_valor, cp.valor,
            cp.fecha_inicio, cp.fecha_fin, cp.activo,
            ${CONCEPTO_JSON} AS concepto
     FROM concepto_persona cp
     INNER JOIN contrato ct ON ct.id = cp.contrato_id
     INNER JOIN concepto c ON c.id = cp.concepto_id
     WHERE cp.contrato_id = $1 AND ct.empresa_id = $2 AND c.empresa_id = $2
     ORDER BY cp.fecha_inicio DESC, cp.id DESC`,
    [contratoId, empresaId]
  );
  return res.rows;
}

export async function obtenerAsignacion(id, empresaId) {
  requerirEmpresa(empresaId);
  return obtenerAsignacionDb(pool, id, empresaId);
}

export async function crearAsignacion(datos, empresaId) {
  requerirEmpresa(empresaId);

  return withTransaction(async (client) => {
    await asegurarContrato(client, datos.contratoId, empresaId, {
      exigirVigente: true,
    });
    const concepto = await asegurarConceptoAsignable(
      client,
      datos.conceptoId,
      empresaId
    );
    verificarUnidadTipoValor(concepto.unidad, datos.tipoValor);
    await asegurarSinSolape(client, datos);

    try {
      const res = await client.query(
        `INSERT INTO concepto_persona (
           contrato_id, concepto_id, tipo_valor, valor,
           fecha_inicio, fecha_fin, activo
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [
          datos.contratoId,
          datos.conceptoId,
          datos.tipoValor,
          datos.valor,
          datos.fechaInicio,
          datos.fechaFin ?? null,
          datos.activo ?? true,
        ]
      );
      return obtenerAsignacionDb(client, res.rows[0].id, empresaId);
    } catch (err) {
      throw errorDb(err, {
        unique: 'Ya existe una asignación con esos datos.',
        fk: 'El contrato o el concepto indicado no existe en la empresa de la sesión.',
      });
    }
  });
}

export async function actualizarAsignacion(id, datos, empresaId) {
  requerirEmpresa(empresaId);

  return withTransaction(async (client) => {
    const actual = await obtenerAsignacionDb(client, id, empresaId);
    if (!actual) throw errorNegocio(404, 'La asignación no fue encontrada.');

    const final = {
      contratoId: datos.contratoId ?? actual.contrato_id,
      conceptoId: datos.conceptoId ?? actual.concepto_id,
      tipoValor: datos.tipoValor ?? actual.tipo_valor,
      valor: datos.valor ?? Number(actual.valor),
      fechaInicio: datos.fechaInicio ?? actual.fecha_inicio,
      fechaFin:
        datos.fechaFin !== undefined
          ? datos.fechaFin
          : actual.fecha_fin ?? null,
      activo: datos.activo ?? actual.activo,
    };

    if (final.contratoId !== actual.contrato_id) {
      await asegurarContrato(client, final.contratoId, empresaId, {
        exigirVigente: true,
      });
    }

    const concepto = await asegurarConceptoAsignable(
      client,
      final.conceptoId,
      empresaId
    );
    verificarUnidadTipoValor(concepto.unidad, final.tipoValor);

    if (final.tipoValor === 'PORCENTAJE_SALDO' && final.valor > 100) {
      throw errorNegocio(400, 'El porcentaje no puede ser mayor a 100.');
    }
    if (final.fechaFin && final.fechaFin < final.fechaInicio) {
      throw errorNegocio(400, 'La fecha_fin no puede ser anterior a la fecha_inicio.');
    }

    await asegurarSinSolape(client, final, id);

    try {
      await client.query(
        `UPDATE concepto_persona
         SET contrato_id = $1, concepto_id = $2, tipo_valor = $3, valor = $4,
             fecha_inicio = $5, fecha_fin = $6, activo = $7
         WHERE id = $8`,
        [
          final.contratoId,
          final.conceptoId,
          final.tipoValor,
          final.valor,
          final.fechaInicio,
          final.fechaFin,
          final.activo,
          id,
        ]
      );
      return obtenerAsignacionDb(client, id, empresaId);
    } catch (err) {
      throw errorDb(err, {
        unique: 'Ya existe una asignación con esos datos.',
        fk: 'El contrato o el concepto indicado no existe en la empresa de la sesión.',
      });
    }
  });
}

export async function terminarAsignacion(id, datos, empresaId) {
  requerirEmpresa(empresaId);

  return withTransaction(async (client) => {
    const actual = await obtenerAsignacionDb(client, id, empresaId);
    if (!actual) throw errorNegocio(404, 'La asignación no fue encontrada.');

    const fechaFin =
      datos.fechaFin ?? new Date().toISOString().slice(0, 10);
    if (fechaFin < actual.fecha_inicio) {
      throw errorNegocio(400, 'La fecha_fin no puede ser anterior a la fecha_inicio.');
    }

    try {
      await client.query(
        `UPDATE concepto_persona SET fecha_fin = $1, activo = FALSE WHERE id = $2`,
        [fechaFin, id]
      );
      return obtenerAsignacionDb(client, id, empresaId);
    } catch (err) {
      throw errorDb(err, {
        fk: 'La asignación indicada no existe o no es válida.',
      });
    }
  });
}

export async function eliminarAsignacion(id, empresaId) {
  requerirEmpresa(empresaId);
  const actual = await obtenerAsignacionDb(pool, id, empresaId);
  if (!actual) throw errorNegocio(404, 'La asignación no fue encontrada.');

  const res = await pool.query(
    `SELECT
       EXISTS(SELECT 1 FROM detalle_prenomina WHERE concepto_persona_id = $1) AS prenomina,
       EXISTS(SELECT 1 FROM detalle_recibo WHERE concepto_persona_id = $1) AS recibo`,
    [id]
  );
  const uso = res.rows[0] ?? {};
  if (uso.prenomina || uso.recibo) {
    throw errorNegocio(
      409,
      'No se puede eliminar físicamente la asignación porque ya tiene detalles de prenómina o recibo. Termínala con fecha_fin o activo=false.'
    );
  }

  try {
    await pool.query(`DELETE FROM concepto_persona WHERE id = $1`, [id]);
    return { id };
  } catch (err) {
    throw errorDb(err, {
      fk: 'La asignación está referenciada por otros registros; termínala en lugar de eliminarla.',
    });
  }
}
