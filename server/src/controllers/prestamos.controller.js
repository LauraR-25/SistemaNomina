import { validarConsultaPrestamos } from '../validators/prestamos.validator.js';
import { listarPrestamos } from '../services/prestamos.service.js';

export async function getPrestamos(req, res, next) {
  const validacion = validarConsultaPrestamos(req.query);
  if (!validacion.valido) {
    return res.status(400).json({ ok: false, message: validacion.errores[0], errores: validacion.errores });
  }

  try {
    const empresaId = validacion.datos.empresaId || req.usuario?.empresa_id || null;
    const data = await listarPrestamos(empresaId);
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}