import dotenv from 'dotenv';
import { pool, closePool } from '../src/config/db.js';

dotenv.config();

const rifEmpresaDemo = 'J-40123456-7';
const codigoPais = 'VE';
const vigenteDesde = '2026-01-01';

const conceptos = [
  { codigo: 'SAL_BASE', soloVerificar: true },
  { codigo: 'BONO_ALIM', soloVerificar: true },
  {
    codigo: 'HE_DIURNA',
    nombre: 'Horas extra diurnas',
    tipo_concepto: 'ASIGNACION',
    categoria: 'HORA_EXTRA',
    naturaleza: 'CREDITO',
    unidad: 'HORAS',
    es_fijo: false,
    es_imponible: true,
  },
  { codigo: 'DED_IVSS', soloVerificar: true },
  { codigo: 'PAT_IVSS', soloVerificar: true },
  {
    codigo: 'DED_RPE',
    nombre: 'Deducción RPE Empleado',
    tipo_concepto: 'DEDUCCION',
    categoria: 'LEY',
    naturaleza: 'DEBITO',
    unidad: 'MONTO',
    es_fijo: false,
    es_imponible: false,
  },
  {
    codigo: 'PAT_RPE',
    nombre: 'Aporte Patronal RPE',
    tipo_concepto: 'APORTE_PATRONAL',
    categoria: 'LEY',
    naturaleza: 'DEBITO',
    unidad: 'MONTO',
    es_fijo: false,
    es_imponible: false,
  },
  {
    codigo: 'DED_FAOV',
    nombre: 'Deducción FAOV Empleado',
    tipo_concepto: 'DEDUCCION',
    categoria: 'LEY',
    naturaleza: 'DEBITO',
    unidad: 'MONTO',
    es_fijo: false,
    es_imponible: false,
  },
  {
    codigo: 'PAT_FAOV',
    nombre: 'Aporte Patronal FAOV',
    tipo_concepto: 'APORTE_PATRONAL',
    categoria: 'LEY',
    naturaleza: 'DEBITO',
    unidad: 'MONTO',
    es_fijo: false,
    es_imponible: false,
  },
  {
    codigo: 'PAT_INCES',
    nombre: 'Aporte Patronal INCES',
    tipo_concepto: 'APORTE_PATRONAL',
    categoria: 'LEY',
    naturaleza: 'DEBITO',
    unidad: 'MONTO',
    es_fijo: false,
    es_imponible: false,
  },
  {
    codigo: 'DED_PREST',
    nombre: 'Descuento de préstamo',
    tipo_concepto: 'DEDUCCION',
    categoria: 'PRESTAMO',
    naturaleza: 'DEBITO',
    unidad: 'MONTO',
    es_fijo: false,
    es_imponible: false,
  },
];

// Los porcentajes son valores por defecto EDITABLES: pueden ajustarse en parametro_aporte_ley.
const tiposAporteLey = [
  {
    codigo: 'IVSS',
    nombre: 'Instituto Venezolano de los Seguros Sociales',
    entidad: 'IVSS',
    concepto_deduccion: 'DED_IVSS',
    concepto_patronal: 'PAT_IVSS',
    porcentaje_empleado: '4.0000',
    porcentaje_patronal: '9.0000',
  },
  {
    codigo: 'RPE',
    nombre: 'Régimen de Pensiones y Jubilaciones',
    entidad: 'IVSS',
    concepto_deduccion: 'DED_RPE',
    concepto_patronal: 'PAT_RPE',
    porcentaje_empleado: '0.5000',
    porcentaje_patronal: '2.0000',
  },
  {
    codigo: 'FAOV',
    nombre: 'Fondo de Ahorro Obligatorio para la Vivienda',
    entidad: 'BANAVIH',
    concepto_deduccion: 'DED_FAOV',
    concepto_patronal: 'PAT_FAOV',
    porcentaje_empleado: '1.0000',
    porcentaje_patronal: '2.0000',
  },
  {
    codigo: 'INCES',
    nombre: 'Instituto Nacional de Capacitación y Educación Socialista',
    entidad: 'INCES',
    concepto_deduccion: null,
    concepto_patronal: 'PAT_INCES',
    porcentaje_empleado: '0.0000',
    porcentaje_patronal: '2.0000',
  },
];

async function obtenerOCrearConcepto(client, concepto, empresaId, reporte) {
  const existente = await client.query(
    `SELECT id FROM concepto WHERE empresa_id = $1 AND codigo = $2`,
    [empresaId, concepto.codigo]
  );

  if (existente.rows.length > 0) {
    reporte.ya_existian.conceptos.push({
      codigo: concepto.codigo,
      id: existente.rows[0].id,
    });
    return existente.rows[0].id;
  }

  if (concepto.soloVerificar) {
    throw new Error(
      `No se encontró el concepto base ${concepto.codigo}. Ejecuta primero: pnpm --dir server run db:seed`
    );
  }

  const insert = await client.query(
    `INSERT INTO concepto (
       empresa_id, codigo, nombre, tipo_concepto, categoria,
       naturaleza, unidad, es_fijo, es_imponible, activo
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE)
     RETURNING id`,
    [
      empresaId,
      concepto.codigo,
      concepto.nombre,
      concepto.tipo_concepto,
      concepto.categoria,
      concepto.naturaleza,
      concepto.unidad,
      concepto.es_fijo,
      concepto.es_imponible,
    ]
  );

  reporte.creados.conceptos.push({
    codigo: concepto.codigo,
    id: insert.rows[0].id,
  });
  return insert.rows[0].id;
}

async function obtenerOCrearTipoAporte(
  client,
  tipo,
  paisId,
  conceptosIds,
  reporte
) {
  const existente = await client.query(
    `SELECT id FROM tipo_aporte_ley WHERE pais_id = $1 AND codigo = $2`,
    [paisId, tipo.codigo]
  );

  if (existente.rows.length > 0) {
    reporte.ya_existian.tipos_aporte_ley.push({
      codigo: tipo.codigo,
      id: existente.rows[0].id,
    });
    return existente.rows[0].id;
  }

  const conceptoDeduccionId = tipo.concepto_deduccion
    ? conceptosIds.get(tipo.concepto_deduccion)
    : null;
  const conceptoPatronalId = conceptosIds.get(tipo.concepto_patronal);

  if (!conceptoPatronalId) {
    throw new Error(
      `Concepto patronal no resuelto para ${tipo.codigo}: ${tipo.concepto_patronal}`
    );
  }

  const insert = await client.query(
    `INSERT INTO tipo_aporte_ley (
       pais_id, codigo, nombre, entidad,
       concepto_deduccion_id, concepto_patronal_id, activo
     )
     VALUES ($1, $2, $3, $4, $5, $6, TRUE)
     RETURNING id`,
    [
      paisId,
      tipo.codigo,
      tipo.nombre,
      tipo.entidad,
      conceptoDeduccionId,
      conceptoPatronalId,
    ]
  );

  reporte.creados.tipos_aporte_ley.push({
    codigo: tipo.codigo,
    id: insert.rows[0].id,
  });
  return insert.rows[0].id;
}

async function obtenerOCrearParametro(client, tipo, tipoAporteId, reporte) {
  const existente = await client.query(
    `SELECT id
     FROM parametro_aporte_ley
     WHERE tipo_aporte_id = $1
       AND empresa_id IS NULL
       AND vigente_desde = $2`,
    [tipoAporteId, vigenteDesde]
  );

  if (existente.rows.length > 0) {
    reporte.ya_existian.parametros_aporte_ley.push({
      codigo: tipo.codigo,
      id: existente.rows[0].id,
    });
    return;
  }

  const insert = await client.query(
    `INSERT INTO parametro_aporte_ley (
       tipo_aporte_id, empresa_id, vigente_desde, vigente_hasta,
       porcentaje_empleado, porcentaje_patronal, tope_salario_base,
       activo, piso_base, base_legal
     )
     VALUES ($1, NULL, $2, NULL, $3, $4, NULL, TRUE, NULL, $5)
     RETURNING id`,
    [
      tipoAporteId,
      vigenteDesde,
      tipo.porcentaje_empleado,
      tipo.porcentaje_patronal,
      'Por confirmar',
    ]
  );

  reporte.creados.parametros_aporte_ley.push({
    codigo: tipo.codigo,
    id: insert.rows[0].id,
  });
}

async function seedNominaBase() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const reporte = {
      creados: {
        conceptos: [],
        tipos_aporte_ley: [],
        parametros_aporte_ley: [],
      },
      ya_existian: {
        conceptos: [],
        tipos_aporte_ley: [],
        parametros_aporte_ley: [],
      },
    };

    const paisRes = await client.query(
      `SELECT id FROM pais WHERE codigo_iso = $1 AND nombre = $2`,
      [codigoPais, 'Venezuela']
    );

    if (paisRes.rows.length === 0) {
      throw new Error(
        'No se encontró Venezuela. Ejecuta primero: pnpm --dir server run db:seed'
      );
    }

    const paisId = paisRes.rows[0].id;

    const empresaRes = await client.query(
      `SELECT id FROM empresa WHERE pais_id = $1 AND rif = $2`,
      [paisId, rifEmpresaDemo]
    );

    if (empresaRes.rows.length === 0) {
      throw new Error(
        'No se encontró la empresa demo. Ejecuta primero: pnpm --dir server run db:seed'
      );
    }

    const empresaId = empresaRes.rows[0].id;
    const conceptosIds = new Map();

    for (const concepto of conceptos) {
      const conceptoId = await obtenerOCrearConcepto(
        client,
        concepto,
        empresaId,
        reporte
      );
      conceptosIds.set(concepto.codigo, conceptoId);
    }

    for (const tipo of tiposAporteLey) {
      const tipoAporteId = await obtenerOCrearTipoAporte(
        client,
        tipo,
        paisId,
        conceptosIds,
        reporte
      );
      await obtenerOCrearParametro(client, tipo, tipoAporteId, reporte);
    }

    await client.query('COMMIT');

    console.log('Seed de nómina base completado con éxito.');
    console.log({ empresaId, paisId });
    console.log('Creado:', {
      conceptos: reporte.creados.conceptos,
      tipos_aporte_ley: reporte.creados.tipos_aporte_ley,
      parametros_aporte_ley: reporte.creados.parametros_aporte_ley,
    });
    console.log('Ya existía:', {
      conceptos: reporte.ya_existian.conceptos,
      tipos_aporte_ley: reporte.ya_existian.tipos_aporte_ley,
      parametros_aporte_ley: reporte.ya_existian.parametros_aporte_ley,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error en seed de nómina base, se revirtieron los cambios:', err);
    process.exitCode = 1;
  } finally {
    client.release();
    await closePool();
  }
}

seedNominaBase();
