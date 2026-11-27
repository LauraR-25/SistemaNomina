import {
  crearEstadoCuentaBancaria,
  prepararPayloadCuentaBancaria,
} from '../../components/catalogos-tenant/CuentaBancariaForm/index.js';

export function crearModeloCuentasBancariasPage(cuentas = []) {
  return {
    titulo: 'Cuentas Bancarias',
    cuentas,
    formulario: crearEstadoCuentaBancaria(),
  };
}

export function normalizarCuentaBancaria(cuenta = {}) {
  return {
    ...cuenta,
    nro_cuenta: cuenta.nro_cuenta ?? cuenta.numero_cuenta ?? '',
    numero_cuenta: cuenta.numero_cuenta ?? cuenta.nro_cuenta ?? '',
    banco:
      cuenta.banco ||
      (cuenta.banco_nombre
        ? { id: cuenta.banco_id, nombre: cuenta.banco_nombre, codigo: cuenta.banco_codigo }
        : null),
  };
}

export async function cargarCuentasBancariasModelo(modeloActual, cargarCuentas) {
  const respuesta = await cargarCuentas();
  if (!respuesta?.ok) {
    return {
      ...modeloActual,
      mensaje: { tipo: 'error', texto: respuesta?.message || 'No se pudieron cargar las cuentas.' },
    };
  }
  return {
    ...modeloActual,
    cuentas: (respuesta.data || []).map(normalizarCuentaBancaria),
    mensaje: null,
  };
}

export async function guardarCuentaBancariaModelo(modeloActual, { registro, datos, crearCuenta, actualizarCuenta }) {
  const payload = prepararPayloadCuentaBancaria(datos);
  const respuesta = registro
    ? await actualizarCuenta(registro.id, payload)
    : await crearCuenta(payload);

  if (!respuesta?.ok) {
    return {
      ...modeloActual,
      mensaje: { tipo: 'error', texto: respuesta?.message || 'No se pudo guardar la cuenta bancaria.' },
    };
  }

  const cuenta = normalizarCuentaBancaria(respuesta.data);
  const cuentas = registro
    ? modeloActual.cuentas.map((item) => (String(item.id) === String(registro.id) ? cuenta : item))
    : [cuenta, ...modeloActual.cuentas];

  return {
    ...modeloActual,
    cuentas,
    formulario: crearEstadoCuentaBancaria(),
    mensaje: { tipo: 'exito', texto: respuesta.message || 'Cuenta bancaria guardada.' },
  };
}

export async function eliminarCuentaBancariaModelo(modeloActual, id, eliminarCuenta) {
  const respuesta = await eliminarCuenta(id);
  if (!respuesta?.ok) {
    return {
      ...modeloActual,
      mensaje: { tipo: 'error', texto: respuesta?.message || 'No se pudo eliminar la cuenta bancaria.' },
    };
  }
  return {
    ...modeloActual,
    cuentas: modeloActual.cuentas.filter((item) => String(item.id) !== String(id)),
    mensaje: { tipo: 'exito', texto: respuesta.message || 'Cuenta bancaria eliminada.' },
  };
}

export default {
  crearModeloCuentasBancariasPage,
  normalizarCuentaBancaria,
  cargarCuentasBancariasModelo,
  guardarCuentaBancariaModelo,
  eliminarCuentaBancariaModelo,
};
