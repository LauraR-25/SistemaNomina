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

export function agregarCuentaBancariaModelo(modeloActual, datosFormulario) {
  const nuevaCuenta = {
    id: Date.now(),
    ...prepararPayloadCuentaBancaria(datosFormulario),
  };

  return {
    ...modeloActual,
    cuentas: [...modeloActual.cuentas, nuevaCuenta],
    formulario: crearEstadoCuentaBancaria(),
  };
}

export function actualizarCuentaBancariaModelo(modeloActual, cuenta) {
  return {
    ...modeloActual,
    cuentas: modeloActual.cuentas.map((item) =>
      item.id === cuenta.id ? { ...item, ...cuenta } : item
    ),
    formulario: crearEstadoCuentaBancaria(),
  };
}

export function eliminarCuentaBancariaModelo(modeloActual, id) {
  return {
    ...modeloActual,
    cuentas: modeloActual.cuentas.filter((item) => item.id !== id),
  };
}

export default {
  crearModeloCuentasBancariasPage,
  agregarCuentaBancariaModelo,
  actualizarCuentaBancariaModelo,
  eliminarCuentaBancariaModelo,
};
