import dotenv from 'dotenv';
import { pool, closePool } from '../src/config/db.js';

dotenv.config();

const rifEmpresaDemo = 'J-40123456-7';
const nombrePerfilAdmin = 'ADMIN';

const subsistemas = [
  {
    nombre: 'Configuración',
    descripcion: 'Datos maestros, bancos y configuración general del sistema.',
  },
  {
    nombre: 'Recursos Humanos',
    descripcion: 'Gestión del personal, cargos, contratos y novedades.',
  },
  {
    nombre: 'Nómina',
    descripcion: 'Procesos de nómina, recibos y préstamos del personal.',
  },
  {
    nombre: 'Seguridad',
    descripcion: 'Usuarios, perfiles y permisos de acceso.',
  },
];

const opciones = [
  {
    nombre: 'CATALOGOS',
    descripcion: 'Administrar empresas, bancos y cuentas bancarias.',
    orden: 1,
    subsistema: 'Configuración',
  },
  {
    nombre: 'RRHH',
    descripcion: 'Gestionar personas, cargos y contratos del personal.',
    orden: 2,
    subsistema: 'Recursos Humanos',
  },
  {
    nombre: 'CONCEPTOS',
    descripcion: 'Administrar conceptos, novedades, horas y aportes de ley.',
    orden: 3,
    subsistema: 'Recursos Humanos',
  },
  {
    nombre: 'NOMINA',
    descripcion: 'Gestionar períodos, prenómina y recibos de pago.',
    orden: 4,
    subsistema: 'Nómina',
  },
  {
    nombre: 'PRESTAMOS',
    descripcion: 'Gestionar préstamos y cuotas del personal.',
    orden: 5,
    subsistema: 'Nómina',
  },
  {
    nombre: 'SEGURIDAD',
    descripcion: 'Administrar usuarios, perfiles y permisos del sistema.',
    orden: 6,
    subsistema: 'Seguridad',
  },
];

async function obtenerOCrearSubsistema(client, subsistema, reporte) {
  const insert = await client.query(
    `INSERT INTO subsistema (nombre, descripcion, activo)
     VALUES ($1, $2, TRUE)
     ON CONFLICT (nombre) DO NOTHING
     RETURNING id`,
    [subsistema.nombre, subsistema.descripcion]
  );

  if (insert.rows.length > 0) {
    reporte.creados.subsistemas.push({
      nombre: subsistema.nombre,
      id: insert.rows[0].id,
    });
    return insert.rows[0].id;
  }

  const existente = await client.query(
    `SELECT id FROM subsistema WHERE nombre = $1`,
    [subsistema.nombre]
  );

  if (existente.rows.length === 0) {
    throw new Error(`No se pudo obtener el subsistema ${subsistema.nombre}`);
  }

  reporte.ya_existian.subsistemas.push({
    nombre: subsistema.nombre,
    id: existente.rows[0].id,
  });
  return existente.rows[0].id;
}

async function obtenerOCrearOpcion(client, opcion, subsistemaId, reporte) {
  const existente = await client.query(
    `SELECT id FROM opcion WHERE nombre = $1 ORDER BY id LIMIT 1`,
    [opcion.nombre]
  );

  if (existente.rows.length > 0) {
    reporte.ya_existian.opciones.push({
      nombre: opcion.nombre,
      id: existente.rows[0].id,
    });
    return existente.rows[0].id;
  }

  const insert = await client.query(
    `INSERT INTO opcion (subsistema_id, nombre, descripcion, orden, activo)
     VALUES ($1, $2, $3, $4, TRUE)
     RETURNING id`,
    [subsistemaId, opcion.nombre, opcion.descripcion, opcion.orden]
  );

  reporte.creados.opciones.push({
    nombre: opcion.nombre,
    id: insert.rows[0].id,
  });
  return insert.rows[0].id;
}

async function asignarPermiso(client, perfilId, opcionId, nombreOpcion, reporte) {
  const insert = await client.query(
    `INSERT INTO permiso_opcion (perfil_id, opcion_id)
     VALUES ($1, $2)
     ON CONFLICT (perfil_id, opcion_id) DO NOTHING
     RETURNING opcion_id`,
    [perfilId, opcionId]
  );

  if (insert.rows.length > 0) {
    reporte.creados.permisos.push({
      perfil: nombrePerfilAdmin,
      opcion: nombreOpcion,
    });
  } else {
    reporte.ya_existian.permisos.push({
      perfil: nombrePerfilAdmin,
      opcion: nombreOpcion,
    });
  }
}

async function seedPermisos() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const reporte = {
      creados: { subsistemas: [], opciones: [], permisos: [] },
      ya_existian: { subsistemas: [], opciones: [], permisos: [] },
    };

    const empresaRes = await client.query(
      `SELECT e.id
       FROM empresa e
       INNER JOIN pais p ON p.id = e.pais_id
       WHERE p.codigo_iso = 'VE' AND e.rif = $1`,
      [rifEmpresaDemo]
    );

    if (empresaRes.rows.length === 0) {
      throw new Error(
        'No se encontró la empresa demo. Ejecuta primero: pnpm --dir server run db:seed'
      );
    }

    const empresaId = empresaRes.rows[0].id;

    const perfilRes = await client.query(
      `SELECT id FROM perfil
       WHERE empresa_id = $1 AND nombre_perfil = $2
       ORDER BY id LIMIT 1`,
      [empresaId, nombrePerfilAdmin]
    );

    if (perfilRes.rows.length === 0) {
      throw new Error(
        'No se encontró el perfil ADMIN de la empresa demo. Ejecuta primero: pnpm --dir server run db:seed'
      );
    }

    const perfilId = perfilRes.rows[0].id;
    const subsistemaIds = new Map();

    for (const subsistema of subsistemas) {
      const subsistemaId = await obtenerOCrearSubsistema(
        client,
        subsistema,
        reporte
      );
      subsistemaIds.set(subsistema.nombre, subsistemaId);
    }

    for (const opcion of opciones) {
      const subsistemaId = subsistemaIds.get(opcion.subsistema);
      if (!subsistemaId) {
        throw new Error(
          `Subsistema no resuelto para la opción ${opcion.nombre}`
        );
      }

      const opcionId = await obtenerOCrearOpcion(
        client,
        opcion,
        subsistemaId,
        reporte
      );
      await asignarPermiso(client, perfilId, opcionId, opcion.nombre, reporte);
    }

    await client.query('COMMIT');

    console.log('Seed de permisos completado con éxito.');
    console.log({ empresaId, perfilId });
    console.log('Creado:', {
      subsistemas: reporte.creados.subsistemas,
      opciones: reporte.creados.opciones,
      permisos: reporte.creados.permisos,
    });
    console.log('Ya existía:', {
      subsistemas: reporte.ya_existian.subsistemas,
      opciones: reporte.ya_existian.opciones,
      permisos: reporte.ya_existian.permisos,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error en seed de permisos, se revirtieron los cambios:', err);
    process.exitCode = 1;
  } finally {
    client.release();
    await closePool();
  }
}

seedPermisos();
