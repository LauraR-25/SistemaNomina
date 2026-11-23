import {
  crearEstadoContrato,
  prepararPayloadContrato,
} from '../../components/rrhh-contratos/ContratoForm.jsx';

export function crearModeloContratosPage(contratos = []) {
  return {
    titulo: 'Contratos Laborales',
    contratos,
    formulario: crearEstadoContrato(),
  };
}

export function agregarContratoModelo(modeloActual, datosFormulario) {
  const nuevoContrato = {
    id: Date.now(),
    ...prepararPayloadContrato(datosFormulario),
  };

  return {
    ...modeloActual,
    contratos: [...modeloActual.contratos, nuevoContrato],
    formulario: crearEstadoContrato(),
  };
}

export default {
  crearModeloContratosPage,
  agregarContratoModelo,
};