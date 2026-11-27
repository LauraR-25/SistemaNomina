import {
  validarActualizarCargo,
  validarCrearCargo,
} from '../validators/rrhh-contratos.validator.js';
import {
  actualizarCargo,
  crearCargo,
  eliminarCargo,
  listarCargos,
  obtenerCargo,
} from '../services/cargos.service.js';

function empresaSesion(req) {
  return req.headers['x-empresa-id'] || req.usuario?.empresa_id || null;
}
function requerirEmpresaSesion(req, res) {
  const empresaId = empresaSesion(req);
  if (!empresaId) {
    res.status(400).json({ ok: false, message: 'Debes indicar la empresa de la sesión (x-empresa-id).' });
    return null;
  }
  return empresaId;
}
function responderValidacion(res, validacion) {
  return res.status(400).json({ ok: false, message: validacion.errores[0], errores: validacion.errores });
}

export async function getCargos(req, res, next) {
  try { const empresaId = requerirEmpresaSesion(req, res); if (!empresaId) return;
    res.json({ ok: true, data: await listarCargos(empresaId) });
  } catch (err) { next(err); }
}
export async function getCargo(req, res, next) {
  try { const empresaId = requerirEmpresaSesion(req, res); if (!empresaId) return;
    const data = await obtenerCargo(req.params.id, empresaId);
    if (!data) return res.status(404).json({ ok: false, message: 'El cargo no fue encontrado.' });
    res.json({ ok: true, data });
  } catch (err) { next(err); }
}
export async function postCargo(req, res, next) {
  const validacion = validarCrearCargo(req.body);
  if (!validacion.valido) return responderValidacion(res, validacion);
  try { const empresaId = requerirEmpresaSesion(req, res); if (!empresaId) return;
    const data = await crearCargo(validacion.datos, empresaId);
    res.status(201).json({ ok: true, message: 'Cargo creado.', data });
  } catch (err) { next(err); }
}
export async function patchCargo(req, res, next) {
  const validacion = validarActualizarCargo(req.body);
  if (!validacion.valido) return responderValidacion(res, validacion);
  try { const empresaId = requerirEmpresaSesion(req, res); if (!empresaId) return;
    const data = await actualizarCargo(req.params.id, validacion.datos, empresaId);
    res.json({ ok: true, message: 'Cargo actualizado.', data });
  } catch (err) { next(err); }
}
export async function deleteCargo(req, res, next) {
  try { const empresaId = requerirEmpresaSesion(req, res); if (!empresaId) return;
    const data = await eliminarCargo(req.params.id, empresaId);
    res.json({ ok: true, message: 'Cargo eliminado.', data });
  } catch (err) { next(err); }
}


