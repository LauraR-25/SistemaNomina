import {
  crearEstadoCuentaBancaria,
  prepararPayloadCuentaBancaria,
} from '../../components/catalogos-tenant/CuentaBancariaForm.jsx';

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

export default {
  crearModeloCuentasBancariasPage,
  agregarCuentaBancariaModelo,
};