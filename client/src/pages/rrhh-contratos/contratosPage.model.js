import {
  crearEstadoContrato,
  prepararPayloadContrato,
} from '../../components/rrhh-contratos/ContratoForm/index.js';
import { ordenarHistorialSalarios } from '../../components/rrhh-contratos/SalarioHistorial/index.js';

export function crearModeloContratosPage(contratos = [], historialSalarios = []) {
  return {
    titulo: 'Contratos Laborales',
    contratos,
    historialSalarios: ordenarHistorialSalarios(historialSalarios),
    formulario: crearEstadoContrato(),
  };
}

function crearRegistroSalario(contrato, datosFormulario) {
  const monto = Number(datosFormulario.salario_base ?? datosFormulario.salario);

  if (!Number.isFinite(monto)) return null;

  return {
    id: `salario-${contrato.id}`,
    contrato_id: contrato.id,
    persona_id: contrato.persona_id ?? null,
    monto,
    vigente_desde: contrato.fecha_inicio ?? null,
    vigente_hasta: null,
    motivo: 'Salario inicial del contrato',
  };
}

export function agregarContratoModelo(modeloActual, datosFormulario) {
  const payload = prepararPayloadContrato(datosFormulario);
  const nuevoContrato = {
    id: Date.now(),
    ...payload,
  };
  const registroSalario = crearRegistroSalario(nuevoContrato, payload);

  return {
    ...modeloActual,
    contratos: [...modeloActual.contratos, nuevoContrato],
    historialSalarios: registroSalario
      ? [...modeloActual.historialSalarios, registroSalario]
      : modeloActual.historialSalarios,
    formulario: crearEstadoContrato(),
  };
}

export function actualizarContratoModelo(modeloActual, datosFormulario) {
  const contratoActual = modeloActual.contratos.find(
    (item) => item.id === datosFormulario.id
  );
  const payload = prepararPayloadContrato(datosFormulario);
  const contrato = { ...contratoActual, ...payload, id: datosFormulario.id };

  return {
    ...modeloActual,
    contratos: modeloActual.contratos.map((item) =>
      item.id === contrato.id ? contrato : item
    ),
    formulario: crearEstadoContrato(),
  };
}

export function eliminarContratoModelo(modeloActual, id) {
  return {
    ...modeloActual,
    contratos: modeloActual.contratos.filter((item) => item.id !== id),
    historialSalarios: modeloActual.historialSalarios.filter(
      (item) => String(item.contrato_id) !== String(id)
    ),
  };
}

export default {
  crearModeloContratosPage,
  agregarContratoModelo,
  actualizarContratoModelo,
  eliminarContratoModelo,
};
