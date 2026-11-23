import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';

export async function login(req, res) {
  const { username, password, empresaId } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({
      ok: false,
      message: 'Debes ingresar el nombre de usuario y la clave.',
    });
  }

  const client = await pool.connect();

  try {
    const params = [username.trim()];
    let sql = `
      SELECT
        u.id AS usuario_id,
        u.empresa_id,
        u.persona_id,
        u.username,
        u.password_hash,
        u.activo,
        u.debe_cambiar_clave,
        u.intentos_fallidos,
        u.bloqueado_hasta,
        e.razon_social,
        e.nombre_comercial,
        e.rif,
        e.moneda_codigo,
        p.primer_nombre,
        p.primer_apellido
      FROM usuario u
      INNER JOIN empresa e ON e.id = u.empresa_id
      LEFT JOIN persona p ON p.id = u.persona_id
      WHERE u.username = $1
    `;

    if (empresaId) {
      sql += ' AND u.empresa_id = $2';
      params.push(empresaId);
    }

    sql += ' LIMIT 1';

    const userResult = await client.query(sql, params);

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        ok: false,
        message: 'Usuario o clave incorrectos.',
      });
    }

    const user = userResult.rows[0];

    if (!user.activo) {
      return res.status(403).json({
        ok: false,
        message: 'El usuario se encuentra inactivo.',
      });
    }

    if (user.bloqueado_hasta && new Date(user.bloqueado_hasta) > new Date()) {
      return res.status(423).json({
        ok: false,
        message: 'El usuario está bloqueado temporalmente por intentos fallidos.',
      });
    }

    const passwordValida = await bcrypt.compare(password, user.password_hash);

    if (!passwordValida) {
      const nuevosIntentos = (user.intentos_fallidos || 0) + 1;
      const bloquear = nuevosIntentos >= 5;

      await client.query(
        `UPDATE usuario
         SET intentos_fallidos = $1,
             bloqueado_hasta = CASE WHEN $2 THEN now() + interval '15 minutes' ELSE bloqueado_hasta END,
             updated_at = now()
         WHERE id = $3`,
        [nuevosIntentos, bloquear, user.usuario_id]
      );

      return res.status(401).json({
        ok: false,
        message: 'Usuario o clave incorrectos.',
      });
    }

    await client.query(
      `UPDATE usuario
       SET intentos_fallidos = 0,
           bloqueado_hasta = NULL,
           ultimo_acceso = now(),
           updated_at = now()
       WHERE id = $1`,
      [user.usuario_id]
    );

    const perfilesRes = await client.query(
      `SELECT pf.id, pf.nombre_perfil, pf.descripcion
       FROM usuario_perfil up
       INNER JOIN perfil pf ON pf.id = up.perfil_id
       WHERE up.usuario_id = $1 AND pf.activo = TRUE`,
      [user.usuario_id]
    );

    const perfilIds = perfilesRes.rows.map((r) => r.id);

    let opciones = [];
    if (perfilIds.length > 0) {
      const opcionesRes = await client.query(
        `SELECT DISTINCT
           o.id,
           o.nombre,
           o.descripcion,
           o.orden,
           o.subsistema_id,
           s.nombre AS subsistema
         FROM permiso_opcion po
         INNER JOIN opcion o ON o.id = po.opcion_id
         INNER JOIN subsistema s ON s.id = o.subsistema_id
         WHERE po.perfil_id = ANY($1::int[])
           AND o.activo = TRUE
           AND s.activo = TRUE
         ORDER BY o.orden ASC, o.id ASC`,
        [perfilIds]
      );
      opciones = opcionesRes.rows;
    }

    const sesion = {
      usuario: {
        id: user.usuario_id,
        personaId: user.persona_id,
        username: user.username,
        nombreCompleto: [user.primer_nombre, user.primer_apellido]
          .filter(Boolean)
          .join(' ') || user.username,
        debeCambiarClave: user.debe_cambiar_clave,
      },
      empresa: {
        id: user.empresa_id,
        rif: user.rif,
        razonSocial: user.razon_social,
        nombreComercial: user.nombre_comercial,
        monedaCodigo: user.moneda_codigo,
      },
      perfiles: perfilesRes.rows,
      opciones,
    };

    return res.status(200).json({
      ok: true,
      message: 'Autenticación exitosa.',
      sesion,
    });
  } catch (err) {
    console.error('Error en login:', err);
    return res.status(500).json({
      ok: false,
      message: 'Error interno al autenticar el usuario.',
    });
  } finally {
    client.release();
  }
}