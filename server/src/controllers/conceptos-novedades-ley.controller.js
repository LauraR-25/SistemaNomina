import {
  validarActualizarAsignacionConcepto,
  validarActualizarConcepto,
  validarConsultaAsignaciones,
  validarCrearAsignacionConcepto,
  validarCrearConcepto,
  validarTerminarAsignacionConcepto,
} from '../validators/conceptos-novedades-ley.validator.js';
import {
  actualizarAsignacion,
  actualizarConcepto,
  crearAsignacion,
  crearConcepto,
  desactivarConcepto,
  eliminarAsignacion,
  eliminarConcepto,
  listarAsignacionesPorContrato,
  listarConceptos,
  obtenerAsignacion,
  obtenerConcepto,
  terminarAsignacion,
} from '../services/conceptos-novedades-ley.service.js';

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

function bad(res, validacion) {
  return res.status(400).json({
    ok: false,
    message: validacion.errores[0],
    errores: validacion.errores,
  });
}

export async function getConceptos(req, res, next) {
  try {
    const empresaId = requerirEmpresaSesion(req, res);
    if (!empresaId) return;
    res.json({ ok: true, data: await listarConceptos(empresaId) });
  } catch (err) {
    next(err);
  }
}

export async function postConcepto(req, res, next) {
  const validacion = validarCrearConcepto(req.body);
  if (!validacion.valido) return bad(res, validacion);

  try {
    const empresaId = requerirEmpresaSesion(req, res);
    if (!empresaId) return;
    const data = await crearConcepto({ ...validacion.datos, empresaId });
    res.status(201).json({ ok: true, message: 'Concepto creado.', data });
  } catch (err) {
    next(err);
  }
}

export async function getConcepto(req, res, next) {
  try {
    const empresaId = requerirEmpresaSesion(req, res);
    if (!empresaId) return;
    const data = await obtenerConcepto(req.params.id, empresaId);
    if (!data) {
      return res.status(404).json({ ok: false, message: 'El concepto no fue encontrado.' });
    }
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function patchConcepto(req, res, next) {
  const validacion = validarActualizarConcepto(req.body);
  if (!validacion.valido) return bad(res, validacion);

  try {
    const empresaId = requerirEmpresaSesion(req, res);
    if (!empresaId) return;
    const data = await actualizarConcepto(req.params.id, validacion.datos, empresaId);
    res.json({ ok: true, message: 'Concepto actualizado.', data });
  } catch (err) {
    next(err);
  }
}

export async function patchDesactivarConcepto(req, res, next) {
  try {
    const empresaId = requerirEmpresaSesion(req, res);
    if (!empresaId) return;
    const data = await desactivarConcepto(req.params.id, empresaId);
    res.json({ ok: true, message: 'Concepto desactivado.', data });
  } catch (err) {
    next(err);
  }
}

export async function deleteConcepto(req, res, next) {
  try {
    const empresaId = requerirEmpresaSesion(req, res);
    if (!empresaId) return;
    const data = await eliminarConcepto(req.params.id, empresaId);
    res.json({ ok: true, message: 'Concepto eliminado.', data });
  } catch (err) {
    next(err);
  }
}

export async function getAsignaciones(req, res, next) {
  const validacion = validarConsultaAsignaciones(req.query);
  if (!validacion.valido) return bad(res, validacion);

  try {
    const empresaId = requerirEmpresaSesion(req, res);
    if (!empresaId) return;
    const data = await listarAsignacionesPorContrato(
      validacion.datos.contratoId,
      empresaId
    );
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getAsignacion(req, res, next) {
  try {
    const empresaId = requerirEmpresaSesion(req, res);
    if (!empresaId) return;
    const data = await obtenerAsignacion(req.params.id, empresaId);
    if (!data) {
      return res.status(404).json({ ok: false, message: 'La asignación no fue encontrada.' });
    }
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function postAsignacion(req, res, next) {
  const validacion = validarCrearAsignacionConcepto(req.body);
  if (!validacion.valido) return bad(res, validacion);

  try {
    const empresaId = requerirEmpresaSesion(req, res);
    if (!empresaId) return;
    const data = await crearAsignacion(validacion.datos, empresaId);
    res.status(201).json({ ok: true, message: 'Concepto asignado al contrato.', data });
  } catch (err) {
    next(err);
  }
}

export async function patchAsignacion(req, res, next) {
  const validacion = validarActualizarAsignacionConcepto(req.body);
  if (!validacion.valido) return bad(res, validacion);

  try {
    const empresaId = requerirEmpresaSesion(req, res);
    if (!empresaId) return;
    const data = await actualizarAsignacion(req.params.id, validacion.datos, empresaId);
    res.json({ ok: true, message: 'Asignación actualizada.', data });
  } catch (err) {
    next(err);
  }
}

export async function patchTerminarAsignacion(req, res, next) {
  const validacion = validarTerminarAsignacionConcepto(req.body ?? {});
  if (!validacion.valido) return bad(res, validacion);

  try {
    const empresaId = requerirEmpresaSesion(req, res);
    if (!empresaId) return;
    const data = await terminarAsignacion(req.params.id, validacion.datos, empresaId);
    res.json({ ok: true, message: 'Asignación terminada.', data });
  } catch (err) {
    next(err);
  }
}

export async function deleteAsignacion(req, res, next) {
  try {
    const empresaId = requerirEmpresaSesion(req, res);
    if (!empresaId) return;
    const data = await eliminarAsignacion(req.params.id, empresaId);
    res.json({ ok: true, message: 'Asignación eliminada.', data });
  } catch (err) {
    next(err);
  }
}
