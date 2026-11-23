export function crearModeloCargosPage(cargos = []) {
  return {
    titulo: 'Catálogo de Cargos',
    cargos,
  };
}

export function agregarCargoModelo(modeloActual, cargo) {
  return {
    ...modeloActual,
    cargos: [...modeloActual.cargos, cargo],
  };
}

export default {
  crearModeloCargosPage,
  agregarCargoModelo,
};