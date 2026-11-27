export function crearModeloCargosPage(cargos = []) {
  return {
    titulo: 'Catálogo de Cargos',
    cargos,
  };
}

export function agregarCargoModelo(modeloActual, cargo) {
  return { ...modeloActual, cargos: [...modeloActual.cargos, cargo] };
}

export function actualizarCargoModelo(modeloActual, cargo) {
  return {
    ...modeloActual,
    cargos: modeloActual.cargos.map((item) => (String(item.id) === String(cargo.id) ? { ...item, ...cargo } : item)),
  };
}

export function eliminarCargoModelo(modeloActual, id) {
  return { ...modeloActual, cargos: modeloActual.cargos.filter((item) => String(item.id) !== String(id)) };
}

export default { crearModeloCargosPage, agregarCargoModelo, actualizarCargoModelo, eliminarCargoModelo };
