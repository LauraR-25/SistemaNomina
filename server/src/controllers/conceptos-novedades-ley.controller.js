import { validarCrearConcepto } from '../validators/conceptos-novedades-ley.validator.js';
import {
  listarConceptos,
  crearConcepto,
} from '../services/conceptos-novedades-ley.service.js';

export async function getConceptos(req, res, next) {
  try {
    const empresaId = req.query.empresaId || req.usuario?.empresa_id || null;
    const data = await listarConceptos(empresaId);
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function postConcepto(req, res, next) {
  const validacion = validarCrearConcepto({
    ...req.body,
    empresaId: req.body.empresaId || req.usuario?.empresa_id,
  });

  if (!validacion.valido) {
    return res.status(400).json({ ok: false, message: validacion.errores[0], errores: validacion.errores });
  }

  try {
    const data = await crearConcepto(validacion.datos);
    res.status(201).json({ ok: true, message: 'Concepto creado.', data });
  } catch (err) {
    next(err);
  }
}