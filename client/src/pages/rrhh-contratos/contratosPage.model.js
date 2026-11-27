import { crearEstadoContrato } from '../../components/rrhh-contratos/ContratoForm/index.js';
import { ordenarHistorialSalarios } from '../../components/rrhh-contratos/SalarioHistorial/index.js';

export function crearModeloContratosPage(contratos = [], historialSalarios = []) {
  return {
    titulo: 'Contratos Laborales',
    contratos,
    historialSalarios: ordenarHistorialSalarios(historialSalarios),
    formulario: crearEstadoContrato(),
  };
}

export function agregarContratoModelo(modeloActual, contrato) {
  return {
    ...modeloActual,
    contratos: [...modeloActual.contratos, contrato],
    historialSalarios: ordenarHistorialSalarios([...(modeloActual.historialSalarios || []), ...(contrato?.historial_salarios || [])]),
    formulario: crearEstadoContrato(),
  };
}

export function actualizarContratoModelo(modeloActual, contrato) {
  return {
    ...modeloActual,
    contratos: modeloActual.contratos.map((item) => String(item.id) === String(contrato.id) ? contrato : item),
    historialSalarios: ordenarHistorialSalarios([
      ...(modeloActual.historialSalarios || []).filter((h) => String(h.contrato_id) !== String(contrato.id)),
      ...(contrato?.historial_salarios || []),
    ]),
    formulario: crearEstadoContrato(),
  };
}

export function eliminarContratoModelo(modeloActual, id) {
  return {
    ...modeloActual,
    contratos: modeloActual.contratos.filter((item) => String(item.id) !== String(id)),
    historialSalarios: (modeloActual.historialSalarios || []).filter((item) => String(item.contrato_id) !== String(id)),
  };
}

export default { crearModeloContratosPage, agregarContratoModelo, actualizarContratoModelo, eliminarContratoModelo };
