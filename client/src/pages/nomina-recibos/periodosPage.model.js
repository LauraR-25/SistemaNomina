import {
  crearEstadoPeriodo,
  prepararPayloadPeriodo,
} from '../../components/nomina-recibos/PeriodoForm/periodoForm.model.js';

export function crearModeloPeriodosPage(periodos = []) {
  return {
    titulo: 'Períodos de Nómina',
    periodos,
    formulario: crearEstadoPeriodo(),
  };
}

export function establecerPeriodosModelo(modeloActual, periodos = []) {
  return {
    ...modeloActual,
    periodos,
  };
}

export function agregarPeriodoModelo(modeloActual, datosFormulario) {
  const nuevoPeriodo = {
    id: Date.now(),
    ...prepararPayloadPeriodo(datosFormulario),
  };

  return {
    ...modeloActual,
    periodos: [nuevoPeriodo, ...modeloActual.periodos],
    formulario: crearEstadoPeriodo(),
  };
}

export function actualizarPeriodoModelo(modeloActual, datosFormulario) {
  const { id, ...campos } = datosFormulario ?? {};
  const payload = prepararPayloadPeriodo(campos);

  return {
    ...modeloActual,
    periodos: modeloActual.periodos.map((periodo) =>
      String(periodo.id) === String(id) ? { ...periodo, ...payload } : periodo
    ),
    formulario: crearEstadoPeriodo(),
  };
}

export function anularPeriodoModelo(modeloActual, id) {
  return {
    ...modeloActual,
    periodos: modeloActual.periodos.map((periodo) =>
      String(periodo.id) === String(id)
        ? { ...periodo, estado: 'ANULADO' }
        : periodo
    ),
  };
}

export default {
  crearModeloPeriodosPage,
  establecerPeriodosModelo,
  agregarPeriodoModelo,
  actualizarPeriodoModelo,
  anularPeriodoModelo,
};
