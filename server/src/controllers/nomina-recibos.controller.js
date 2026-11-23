import { validarConsultaNomina } from '../validators/nomina-recibos.validator.js';
import { listarPeriodosNomina } from '../services/nomina-recibos.service.js';

export async function getPeriodosNomina(req, res, next) {
  const validacion = validarConsultaNomina(req.query);
  if (!validacion.valido) {
    return res.status(400).json({ ok: false, message: validacion.errores[0], errores: validacion.errores });
  }

  try {
    const empresaId = validacion.datos.empresaId || req.usuario?.empresa_id || null;
    const data = await listarPeriodosNomina(empresaId);
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}