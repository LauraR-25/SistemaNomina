import {
  validarActualizarCuentaBancaria,
  validarActualizarEmpresa,
  validarCrearCuentaBancaria,
  validarCrearEmpresa,
} from '../validators/catalogos-tenant.validator.js';
import {
  actualizarCuentaBancaria,
  actualizarEmpresa,
  crearCuentaBancaria,
  crearEmpresa,
  eliminarCuentaBancaria,
  listarBancos,
  listarCuentasBancarias,
  listarEmpresas,
  listarPaises,
  obtenerCuentaBancaria,
  obtenerEmpresaPorId,
} from '../services/catalogos-tenant.service.js';

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

function responderValidacion(res, validacion) {
  return res.status(400).json({
    ok: false,
    message: validacion.errores[0],
    errores: validacion.errores,
  });
}

export async function getPaises(req, res, next) {
  try {
    const data = await listarPaises();
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getBancos(req, res, next) {
  try {
    const data = await listarBancos();
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getEmpresas(req, res, next) {
  try {
    const empresaId = requerirEmpresaSesion(req, res);
    if (!empresaId) return;
    const data = await listarEmpresas(empresaId);
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getEmpresa(req, res, next) {
  try {
    const empresaId = requerirEmpresaSesion(req, res);
    if (!empresaId) return;
    const data = await obtenerEmpresaPorId(req.params.id, empresaId);
    if (!data) return res.status(404).json({ ok: false, message: 'La empresa no fue encontrada.' });
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function postEmpresa(req, res, next) {
  const validacion = validarCrearEmpresa(req.body);
  if (!validacion.valido) return responderValidacion(res, validacion);
  try {
    const data = await crearEmpresa(validacion.datos);
    res.status(201).json({ ok: true, message: 'Empresa creada.', data });
  } catch (err) {
    next(err);
  }
}

export async function patchEmpresa(req, res, next) {
  const validacion = validarActualizarEmpresa(req.body);
  if (!validacion.valido) return responderValidacion(res, validacion);
  try {
    const empresaId = requerirEmpresaSesion(req, res);
    if (!empresaId) return;
    const data = await actualizarEmpresa(req.params.id, validacion.datos, empresaId);
    res.json({ ok: true, message: 'Empresa actualizada.', data });
  } catch (err) {
    next(err);
  }
}

export async function getCuentasBancarias(req, res, next) {
  try {
    const empresaId = requerirEmpresaSesion(req, res);
    if (!empresaId) return;
    const data = await listarCuentasBancarias(empresaId);
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getCuentaBancaria(req, res, next) {
  try {
    const empresaId = requerirEmpresaSesion(req, res);
    if (!empresaId) return;
    const data = await obtenerCuentaBancaria(req.params.id, empresaId);
    if (!data) return res.status(404).json({ ok: false, message: 'La cuenta bancaria no fue encontrada.' });
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function postCuentaBancaria(req, res, next) {
  const validacion = validarCrearCuentaBancaria(req.body);
  if (!validacion.valido) return responderValidacion(res, validacion);
  try {
    const empresaId = requerirEmpresaSesion(req, res);
    if (!empresaId) return;
    const data = await crearCuentaBancaria(validacion.datos, empresaId);
    res.status(201).json({ ok: true, message: 'Cuenta bancaria creada.', data });
  } catch (err) {
    next(err);
  }
}

export async function patchCuentaBancaria(req, res, next) {
  const validacion = validarActualizarCuentaBancaria(req.body);
  if (!validacion.valido) return responderValidacion(res, validacion);
  try {
    const empresaId = requerirEmpresaSesion(req, res);
    if (!empresaId) return;
    const data = await actualizarCuentaBancaria(req.params.id, validacion.datos, empresaId);
    res.json({ ok: true, message: 'Cuenta bancaria actualizada.', data });
  } catch (err) {
    next(err);
  }
}

export async function deleteCuentaBancaria(req, res, next) {
  try {
    const empresaId = requerirEmpresaSesion(req, res);
    if (!empresaId) return;
    const data = await eliminarCuentaBancaria(req.params.id, empresaId);
    res.json({ ok: true, message: 'Cuenta bancaria eliminada.', data });
  } catch (err) {
    next(err);
  }
}