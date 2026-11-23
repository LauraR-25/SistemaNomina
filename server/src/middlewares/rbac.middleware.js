import { pool } from '../config/db.js';

export function requerirPerfil(...perfilesPermitidos) {
  return async (req, res, next) => {
    try {
      if (!req.usuario?.id) {
        return res.status(401).json({
          ok: false,
          message: 'No autenticado.',
        });
      }

      const result = await pool.query(
        `SELECT pf.nombre_perfil
         FROM usuario_perfil up
         INNER JOIN perfil pf ON pf.id = up.perfil_id
         WHERE up.usuario_id = $1 AND pf.activo = TRUE`,
        [req.usuario.id]
      );

      const perfilesUsuario = result.rows.map((r) => r.nombre_perfil);
      const tieneAcceso = perfilesUsuario.some((p) =>
        perfilesPermitidos.includes(p)
      );

      if (!tieneAcceso) {
        return res.status(403).json({
          ok: false,
          message: 'No tienes permisos para acceder a este recurso.',
        });
      }

      req.perfiles = perfilesUsuario;
      next();
    } catch (err) {
      next(err);
    }
  };
}