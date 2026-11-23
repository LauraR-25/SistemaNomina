import {
  crearEstadoPeriodo,
  prepararPayloadPeriodo,
} from '../../components/nomina-recibos/PeriodoForm.jsx';

export function crearModeloPeriodosPage(periodos = []) {
  return {
    titulo: 'Períodos de Nómina',
    periodos,
    formulario: crearEstadoPeriodo(),
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

export default {
  crearModeloPeriodosPage,
  agregarPeriodoModelo,
};