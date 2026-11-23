import { validarCrearEmpresa } from '../validators/catalogos-tenant.validator.js';
import {
  listarPaises,
  listarBancos,
  listarEmpresas,
  crearEmpresa,
} from '../services/catalogos-tenant.service.js';

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
    const data = await listarEmpresas();
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function postEmpresa(req, res, next) {
  const validacion = validarCrearEmpresa(req.body);
  if (!validacion.valido) {
    return res.status(400).json({ ok: false, message: validacion.errores[0], errores: validacion.errores });
  }
  try {
    const data = await crearEmpresa(validacion.datos);
    res.status(201).json({ ok: true, message: 'Empresa creada.', data });
  } catch (err) {
    next(err);
  }
}