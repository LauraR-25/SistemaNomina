import { pool } from '../config/db.js';

export async function verificarAutenticacion(req, res, next) {
  try {
    const usuarioId = req.headers['x-usuario-id'];

    if (!usuarioId) {
      return res.status(401).json({
        ok: false,
        message: 'No autenticado. Debes iniciar sesión.',
      });
    }

    const result = await pool.query(
      `SELECT id, empresa_id, persona_id, username, activo
       FROM usuario
       WHERE id = $1
       LIMIT 1`,
      [usuarioId]
    );

    if (result.rows.length === 0 || !result.rows[0].activo) {
      return res.status(401).json({
        ok: false,
        message: 'Sesión inválida o usuario inactivo.',
      });
    }

    req.usuario = result.rows[0];
    next();
  } catch (err) {
    next(err);
  }
}