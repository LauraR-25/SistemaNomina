import { validarCrearPersona } from '../validators/rrhh-contratos.validator.js';
import {
  listarPersonas,
  crearPersona,
} from '../services/rrhh-contratos.service.js';

export async function getPersonas(req, res, next) {
  try {
    const empresaId = req.query.empresaId || req.usuario?.empresa_id || null;
    const data = await listarPersonas(empresaId);
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function postPersona(req, res, next) {
  const validacion = validarCrearPersona({
    ...req.body,
    empresaId: req.body.empresaId || req.usuario?.empresa_id,
  });

  if (!validacion.valido) {
    return res.status(400).json({ ok: false, message: validacion.errores[0], errores: validacion.errores });
  }

  try {
    const data = await crearPersona(validacion.datos);
    res.status(201).json({ ok: true, message: 'Persona registrada.', data });
  } catch (err) {
    next(err);
  }
}