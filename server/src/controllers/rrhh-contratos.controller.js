import { validarCrearPersona } from '../validators/rrhh-contratos.validator.js';
import {
  listarPersonas,
  crearPersona,
} from '../services/rrhh-contratos.service.js';

function empresaSesion(req) {
  return req.headers['x-empresa-id'] || req.usuario?.empresa_id || null;
}

function requerirEmpresaSesion(req, res) {
  const empresaId = empresaSesion(req);
  if (!empresaId) {
    res.status(400).json({
      ok: false,
      message: 'Debes indicar la empresa de la sesión (x-empresa-id).',
    });
    return null;
  }
  return empresaId;
}

export async function getPersonas(req, res, next) {
  try {
    const empresaId = requerirEmpresaSesion(req, res);
    if (!empresaId) return;
    const data = await listarPersonas(empresaId);
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function postPersona(req, res, next) {
  const empresaId = requerirEmpresaSesion(req, res);
  if (!empresaId) return;
  const validacion = validarCrearPersona({
    ...req.body,
    empresaId,
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