import { crearEstadoCargo } from '../../components/rrhh-contratos/CargoForm/index.js';

export function crearModeloCargosPage(cargos = []) {
  return {
    titulo: 'Catálogo de Cargos',
    cargos,
    formulario: crearEstadoCargo(),
  };
}

export function agregarCargoModelo(modeloActual, cargo) {
  return {
    ...modeloActual,
    cargos: [...modeloActual.cargos, cargo],
    formulario: crearEstadoCargo(),
  };
}

export function actualizarCargoModelo(modeloActual, cargo) {
  return {
    ...modeloActual,
    cargos: modeloActual.cargos.map((item) =>
      item.id === cargo.id ? { ...item, ...cargo } : item
    ),
    formulario: crearEstadoCargo(),
  };
}

export function eliminarCargoModelo(modeloActual, id) {
  return {
    ...modeloActual,
    cargos: modeloActual.cargos.filter((item) => item.id !== id),
  };
}

export default {
  crearModeloCargosPage,
  agregarCargoModelo,
  actualizarCargoModelo,
  eliminarCargoModelo,
};
