import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { pool, closePool } from '../src/config/db.js';

dotenv.config();

async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. País base (Venezuela)
    const paisRes = await client.query(
      `INSERT INTO pais (codigo_iso, nombre, moneda_codigo, activo)
       VALUES ($1, $2, $3, TRUE)
       ON CONFLICT (codigo_iso) DO UPDATE SET nombre = EXCLUDED.nombre
       RETURNING id`,
      ['VE', 'Venezuela', 'VES']
    );
    const paisId = paisRes.rows[0].id;

    // 2. Bancos base
    const bancos = [
      { codigo: '0191', nombre: 'Banco Nacional de Crédito (BNC)' },
      { codigo: '0102', nombre: 'Banco de Venezuela' },
      { codigo: '0105', nombre: 'Banco Mercantil' },
      { codigo: '0134', nombre: 'Banesco Banco Universal' },
    ];

    for (const banco of bancos) {
      await client.query(
        `INSERT INTO banco (codigo, nombre, activo)
         VALUES ($1, $2, TRUE)
         ON CONFLICT (nombre) DO NOTHING`,
        [banco.codigo, banco.nombre]
      );
    }

    // 3. Empresa multi-tenant inicial
    const rifEmpresa = 'J-40123456-7';
    let empresaRes = await client.query(
      `SELECT id FROM empresa WHERE pais_id = $1 AND rif = $2`,
      [paisId, rifEmpresa]
    );

    let empresaId;
    if (empresaRes.rows.length > 0) {
      empresaId = empresaRes.rows[0].id;
    } else {
      const insertEmpresa = await client.query(
        `INSERT INTO empresa (
           pais_id, rif, razon_social, nombre_comercial, moneda_codigo, activo
         )
         VALUES ($1, $2, $3, $4, $5, TRUE)
         RETURNING id`,
        [
          paisId,
          rifEmpresa,
          'Soluciones Empresariales Demo C.A.',
          'Demo Nómina',
          'VES',
        ]
      );
      empresaId = insertEmpresa.rows[0].id;
    }

    // 4. Persona administradora inicial
    const cedulaAdmin = 'V-20123456';
    let personaRes = await client.query(
      `SELECT id FROM persona WHERE empresa_id = $1 AND cedula = $2`,
      [empresaId, cedulaAdmin]
    );

    let personaId;
    if (personaRes.rows.length > 0) {
      personaId = personaRes.rows[0].id;
    } else {
      const insertPersona = await client.query(
        `INSERT INTO persona (
           empresa_id, cedula, primer_nombre, primer_apellido, estado
         )
         VALUES ($1, $2, $3, $4, 'ACTIVO')
         RETURNING id`,
        [empresaId, cedulaAdmin, 'Admin', 'Sistema']
      );
      personaId = insertPersona.rows[0].id;
    }

    // 5. Perfil ADMIN para la empresa
    let perfilRes = await client.query(
      `SELECT id FROM perfil WHERE empresa_id = $1 AND nombre_perfil = $2`,
      [empresaId, 'ADMIN']
    );

    let perfilId;
    if (perfilRes.rows.length > 0) {
      perfilId = perfilRes.rows[0].id;
    } else {
      const insertPerfil = await client.query(
        `INSERT INTO perfil (empresa_id, nombre_perfil, descripcion, activo)
         VALUES ($1, $2, $3, TRUE)
         RETURNING id`,
        [empresaId, 'ADMIN', 'Administrador general de la empresa']
      );
      perfilId = insertPerfil.rows[0].id;
    }

    // 6. Usuario administrador inicial
    const usernameAdmin = 'admin';
    const passwordPlain = process.env.SEED_ADMIN_PASSWORD || 'Admin1234*';
    const passwordHash = await bcrypt.hash(passwordPlain, 10);

    let usuarioRes = await client.query(
      `SELECT id FROM usuario WHERE empresa_id = $1 AND username = $2`,
      [empresaId, usernameAdmin]
    );

    let usuarioId;
    if (usuarioRes.rows.length > 0) {
      usuarioId = usuarioRes.rows[0].id;
    } else {
      const insertUsuario = await client.query(
        `INSERT INTO usuario (
           empresa_id, persona_id, username, password_hash, activo, debe_cambiar_clave
         )
         VALUES ($1, $2, $3, $4, TRUE, FALSE)
         RETURNING id`,
        [empresaId, personaId, usernameAdmin, passwordHash]
      );
      usuarioId = insertUsuario.rows[0].id;
    }

    // Asignar perfil ADMIN al usuario
    await client.query(
      `INSERT INTO usuario_perfil (usuario_id, perfil_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [usuarioId, perfilId]
    );

    // 7. Conceptos base de la empresa
    const conceptosBase = [
      {
        codigo: 'SAL_BASE',
        nombre: 'Salario Base',
        tipo_concepto: 'ASIGNACION',
        categoria: 'SALARIO_BASE',
        naturaleza: 'CREDITO',
        unidad: 'DIAS',
        es_fijo: true,
        es_imponible: true,
      },
      {
        codigo: 'BONO_ALIM',
        nombre: 'Bono de Alimentación',
        tipo_concepto: 'ASIGNACION',
        categoria: 'BONO',
        naturaleza: 'CREDITO',
        unidad: 'MONTO',
        es_fijo: true,
        es_imponible: false,
      },
      {
        codigo: 'DED_IVSS',
        nombre: 'Deducción IVSS Empleado',
        tipo_concepto: 'DEDUCCION',
        categoria: 'LEY',
        naturaleza: 'DEBITO',
        unidad: 'MONTO',
        es_fijo: false,
        es_imponible: false,
      },
      {
        codigo: 'PAT_IVSS',
        nombre: 'Aporte Patronal IVSS',
        tipo_concepto: 'APORTE_PATRONAL',
        categoria: 'LEY',
        naturaleza: 'DEBITO',
        unidad: 'MONTO',
        es_fijo: false,
        es_imponible: false,
      },
    ];

    for (const c of conceptosBase) {
      const existe = await client.query(
        `SELECT id FROM concepto WHERE empresa_id = $1 AND codigo = $2`,
        [empresaId, c.codigo]
      );

      if (existe.rows.length === 0) {
        await client.query(
          `INSERT INTO concepto (
             empresa_id, codigo, nombre, tipo_concepto, categoria,
             naturaleza, unidad, es_fijo, es_imponible, activo
           )
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE)`,
          [
            empresaId,
            c.codigo,
            c.nombre,
            c.tipo_concepto,
            c.categoria,
            c.naturaleza,
            c.unidad,
            c.es_fijo,
            c.es_imponible,
          ]
        );
      }
    }

    await client.query('COMMIT');
    console.log('Seed completado con éxito.');
    console.log({ empresaId, usuarioId, username: usernameAdmin });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error en seed, se revirtieron los cambios:', err);
    process.exitCode = 1;
  } finally {
    client.release();
    await closePool();
  }
}

seed();